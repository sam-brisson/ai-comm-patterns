const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (flag) => {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : '';
};

const mode = getArg('--mode');
const issueNumber = getArg('--issue-number');

// Read content from files to avoid shell escaping issues
const conversationFile = getArg('--conversation-file');
const titleFile = getArg('--title-file');
const changesContextFile = getArg('--changes-context-file');

const conversation = conversationFile ? fs.readFileSync(conversationFile, 'utf8') : '';
const title = titleFile ? fs.readFileSync(titleFile, 'utf8') : '';

let changesContext;
try {
  const changesContextJson = changesContextFile ? fs.readFileSync(changesContextFile, 'utf8') : '{}';
  changesContext = JSON.parse(changesContextJson);
} catch (e) {
  changesContext = { existingChanges: [], templates: {} };
}

console.log('Mode:', mode);
console.log('Title:', title);
console.log('Conversation length:', conversation.length);
console.log('Existing changes:', changesContext.existingChanges.length);

// Initialize Claude API client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Retry wrapper for API calls with exponential backoff
async function withRetry(fn, maxRetries = 3, baseDelayMs = 2000) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const isRetryable = error.status === 529 || error.status === 503 || error.status === 500;
      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      console.log(`API error (${error.status}), retrying in ${delay}ms... (attempt ${attempt}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

// Extract explicit change name from conversation if specified in ### Change section
function extractExplicitChangeName() {
  const changeMatch = conversation.match(/###\s*Change\s*\n+([a-z][a-z0-9-]*)/i);
  if (changeMatch) {
    return changeMatch[1].toLowerCase().trim();
  }
  // Also check title for [ACTION]: change-name pattern
  const titleMatch = title.match(/\[(EXPLORE|PROPOSE|DESIGN|APPLY|ARCHIVE)\]:\s*([a-z][a-z0-9-]*)/i);
  if (titleMatch) {
    return titleMatch[2].toLowerCase().trim();
  }
  return null;
}

const explicitChangeName = extractExplicitChangeName();
console.log('Explicit change name:', explicitChangeName || '(none detected)');

// Build context about existing changes for Claude
function buildChangesContext() {
  if (changesContext.existingChanges.length === 0) {
    return 'No existing OpenSpec changes found in the repository.';
  }

  let context = 'Existing OpenSpec changes:\n\n';
  for (const change of changesContext.existingChanges) {
    context += `## ${change.name}\n`;
    context += `Status: ${change.status}\n`;
    if (change.proposal) {
      context += `Proposal summary:\n${change.proposal}\n`;
    }
    if (change.tasks) {
      context += `Tasks: ${change.tasks.completed}/${change.tasks.total} complete\n`;
    }
    context += '\n---\n\n';
  }
  return context;
}

// Check if explicit change name matches an existing change
function isExistingChange(name) {
  return changesContext.existingChanges.some(c => c.name === name);
}

// Prompts for different operations
const ANALYZE_PROMPT = `You are analyzing a conversation transcript to extract information relevant to OpenSpec change management.

<existing_changes>
${buildChangesContext()}
</existing_changes>

<conversation_title>
${title}
</conversation_title>

<conversation>
${conversation}
</conversation>

Analyze this conversation and identify:
1. Key decisions made (explicit agreements, chosen approaches)
2. Requirements or features discussed
3. Action items or next steps mentioned
4. Which existing change(s) this conversation relates to (if any)
5. If this appears to be a new initiative not covered by existing changes

Respond in JSON format:
{
  "decisions": [{"decision": "...", "context": "...", "participants": ["..."]}],
  "requirements": [{"requirement": "...", "details": "..."}],
  "actionItems": [{"item": "...", "assignee": "..."}],
  "matchedChanges": [{"name": "...", "confidence": 0-100, "reasoning": "..."}],
  "suggestedNewChange": {"name": "...", "reason": "..."} or null,
  "summary": "Brief summary of what this conversation is about"
}`;

// Build propose prompt with explicit change name constraint
function buildProposePrompt(analysis) {
  const explicitChangeInstruction = explicitChangeName
    ? `IMPORTANT: The user has explicitly specified the change name as "${explicitChangeName}".
You MUST use this exact name. ${isExistingChange(explicitChangeName)
  ? `This matches an existing change, so update that change's artifacts.`
  : `This is a NEW change - create a new change folder with this name. Do NOT merge this into an existing change.`}`
    : '';

  return `You are updating OpenSpec artifacts based on a conversation transcript analysis.

<analysis>
${analysis}
</analysis>

<existing_changes>
${buildChangesContext()}
</existing_changes>

<conversation>
${conversation}
</conversation>

${explicitChangeInstruction}

Based on the analysis, generate updates to OpenSpec artifacts.

If updating an existing change, provide updates to its artifacts.
If creating a new change, provide initial content for proposal.md.

For each artifact update, preserve existing content and ADD new information from the conversation.

Respond in JSON format:
{
  "changeName": "the-change-name",
  "isNewChange": true/false,
  "artifacts": {
    "proposal": "Full content for proposal.md (or null if no update)",
    "design": "Full content for design.md (or null if no update)",
    "tasks": "Full content for tasks.md (or null if no update)"
  },
  "prDescription": "Markdown content explaining what was updated and why",
  "confidence": 0-100,
  "reasoning": "Why these updates were made"
}`;
}

// Build explore prompt with explicit change name constraint
function buildExplorePrompt() {
  const explicitChangeInstruction = explicitChangeName
    ? `IMPORTANT: The user has explicitly specified the change name as "${explicitChangeName}".
You MUST use this exact name. ${isExistingChange(explicitChangeName)
  ? `This matches an existing change, so update that change's artifacts.`
  : `This is a NEW change - create a new change folder with this name. Do NOT merge this into an existing change.`}`
    : '';

  return `You are analyzing a conversation transcript and updating OpenSpec artifacts based on the insights.

<existing_changes>
${buildChangesContext()}
</existing_changes>

<conversation_title>
${title}
</conversation_title>

<conversation>
${conversation}
</conversation>

${explicitChangeInstruction}

Analyze this conversation and update the relevant OpenSpec change artifacts. Explore mode is for refining and iterating on existing changes based on team discussions.

Your goals:
1. Identify which existing change(s) this conversation relates to
2. Extract key decisions, refinements, and clarifications from the discussion
3. Update the relevant artifacts (proposal.md, design.md, tasks.md) to reflect the new insights
4. If the conversation suggests a completely new initiative, create a new change

Respond in JSON format:
{
  "changeName": "the-change-name",
  "isNewChange": true/false,
  "artifacts": {
    "proposal": "Full updated content for proposal.md (or null if no update needed)",
    "design": "Full updated content for design.md (or null if no update needed)",
    "tasks": "Full updated content for tasks.md (or null if no update needed)"
  },
  "analysis": {
    "summary": "2-3 sentence summary of what was discussed",
    "keyDecisions": ["decision 1", "decision 2"],
    "openQuestions": ["question 1", "question 2"],
    "refinements": ["what changed from the original proposal"]
  },
  "prDescription": "Markdown content explaining what was updated and why",
  "confidence": 0-100,
  "reasoning": "Why these updates were made"
}`;
}

// Build design prompt for generating design.md and tasks.md from existing proposal
function buildDesignPrompt() {
  if (!explicitChangeName) {
    throw new Error('Design mode requires an explicit change name');
  }

  // Find the existing change to get its proposal
  const existingChange = changesContext.existingChanges.find(c => c.name === explicitChangeName);
  if (!existingChange) {
    throw new Error(`Change "${explicitChangeName}" not found. Design mode requires an existing change with a proposal.`);
  }

  return `You are generating the design.md and tasks.md artifacts for an existing OpenSpec change proposal.

<change_name>
${explicitChangeName}
</change_name>

<existing_proposal>
${existingChange.proposal || 'No proposal content available'}
</existing_proposal>

<additional_context>
${conversation || '(No additional context provided)'}
</additional_context>

Based on the proposal above, generate:

1. **design.md** - Technical design document that includes:
   - Architecture decisions and rationale
   - Component/module breakdown
   - Data flow and interactions
   - API contracts (if applicable)
   - Dependencies and integration points
   - Error handling strategy
   - Testing approach

2. **tasks.md** - Implementation task breakdown with:
   - Clear, actionable tasks with checkbox format
   - Logical ordering (dependencies respected)
   - Tasks grouped by phase or component
   - Estimated complexity hints where helpful
   - Acceptance criteria for each major task

Guidelines:
- Keep the design practical and focused on what needs to be built
- Tasks should be granular enough to track progress but not so small as to be noise
- Use checkbox format: "- [ ] Task description"
- Reference the proposal's requirements to ensure all are covered

Respond in JSON format:
{
  "changeName": "${explicitChangeName}",
  "isNewChange": false,
  "artifacts": {
    "proposal": null,
    "design": "Full content for design.md",
    "tasks": "Full content for tasks.md with checkbox format"
  },
  "prDescription": "Markdown content explaining the design and tasks generated",
  "confidence": 0-100,
  "reasoning": "Brief explanation of design decisions"
}`;
}

async function generateDesign() {
  console.log('Generating design and tasks for:', explicitChangeName);

  const prompt = buildDesignPrompt();

  const response = await withRetry(() => anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }]
  }));

  const text = response.content[0].text;

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse design response');
  }

  return JSON.parse(jsonMatch[0]);
}

async function analyzeConversation() {
  console.log('Step 1: Analyzing conversation...');

  const response = await withRetry(() => anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: ANALYZE_PROMPT }]
  }));

  const text = response.content[0].text;

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse analysis response');
  }

  return JSON.parse(jsonMatch[0]);
}

async function generateProposal(analysis) {
  console.log('Step 2: Generating artifact updates...');

  const prompt = buildProposePrompt(JSON.stringify(analysis, null, 2));

  const response = await withRetry(() => anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }]
  }));

  const text = response.content[0].text;

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse proposal response');
  }

  return JSON.parse(jsonMatch[0]);
}

async function generateExploreUpdates() {
  console.log('Generating explore updates...');

  const prompt = buildExplorePrompt();

  const response = await withRetry(() => anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }]
  }));

  const text = response.content[0].text;

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse explore response');
  }

  return JSON.parse(jsonMatch[0]);
}

function addChangeToComponent(changeName, title, description) {
  const componentPath = path.join(process.cwd(), 'src', 'components', 'OpenSpecChanges', 'index.tsx');

  if (!fs.existsSync(componentPath)) {
    console.log('OpenSpecChanges component not found, skipping component update');
    return;
  }

  let content = fs.readFileSync(componentPath, 'utf8');

  // Check if change already exists in the component
  if (content.includes(`id: '${changeName}'`)) {
    console.log(`Change ${changeName} already exists in component, skipping`);
    return;
  }

  // Create the new entry
  const newEntry = `  {
    id: '${changeName}',
    title: '${title.replace(/'/g, "\\'")}',
    status: 'active',
    description: '${description.replace(/'/g, "\\'")}',
    resultLink: undefined,
    resultLabel: 'In Progress',
    artifactDir: '${changeName}',
  },`;

  // Find the position to insert - after the last entry in changeMetadata array
  // Look for the pattern: the closing of the last entry before the array closes
  const insertPattern = /(\s*}\s*,?\s*\n)(const changeMetadata)/;
  const match = content.match(insertPattern);

  if (!match) {
    // Try alternative: find closing bracket of changeMetadata array
    const arrayEndPattern = /(\n\];)\s*\n\s*\/\/ Simple markdown/;
    const arrayMatch = content.match(arrayEndPattern);
    if (arrayMatch) {
      // Insert before the closing bracket
      content = content.replace(arrayEndPattern, `\n${newEntry}\n];\\n\\n// Simple markdown`);
    } else {
      console.log('Could not find insertion point in component, skipping');
      return;
    }
  } else {
    // Insert before "const changeMetadata" would mean we need different approach
    // Let's find the last entry and insert after it
    const lastEntryPattern = /(artifactDir: '[^']+',?\s*\n\s*},?\s*\n)(\];)/;
    const lastMatch = content.match(lastEntryPattern);
    if (lastMatch) {
      content = content.replace(lastEntryPattern, `$1${newEntry}\n$2`);
    } else {
      console.log('Could not find insertion point in component, skipping');
      return;
    }
  }

  fs.writeFileSync(componentPath, content);
  console.log(`Added ${changeName} to OpenSpecChanges component`);
}

async function writeArtifacts(proposal) {
  const changesDir = path.join(process.cwd(), 'openspec', 'changes', proposal.changeName);

  // Create new change directory if needed
  if (proposal.isNewChange) {
    console.log(`Creating new change: ${proposal.changeName}`);

    // Create directory
    fs.mkdirSync(changesDir, { recursive: true });

    // Extract title from proposal or generate from changeName
    let title = proposal.changeName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Try to extract a better title from the proposal content
    if (proposal.artifacts.proposal) {
      const titleMatch = proposal.artifacts.proposal.match(/^#\s+(.+)$/m);
      if (titleMatch) {
        title = titleMatch[1];
      }
    }

    // Extract description from proposal or generate one
    let description = `OpenSpec change for ${title}`;
    if (proposal.artifacts.proposal) {
      // Try to get the first paragraph after "## Problem" or "## Why"
      const problemMatch = proposal.artifacts.proposal.match(/##\s*(Problem|Why)\s*\n+([^\n#]+)/);
      if (problemMatch) {
        description = problemMatch[2].trim().substring(0, 200);
        if (description.length === 200) description += '...';
      }
    }

    // Determine workflow status based on mode
    const workflowStatus = mode === 'explore' ? 'exploring' : 'proposed';

    // Create manifest.json for the workflow board
    const manifest = {
      id: proposal.changeName,
      title: title,
      description: description,
      workflowStatus: workflowStatus,
      resultLink: null,
      resultLabel: null,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const manifestPath = path.join(changesDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`Created: ${manifestPath}`);

    // Also add entry to OpenSpecChanges component (legacy support)
    addChangeToComponent(proposal.changeName, title, description);
  }

  // Write artifacts
  if (proposal.artifacts.proposal) {
    const proposalPath = path.join(changesDir, 'proposal.md');
    fs.writeFileSync(proposalPath, proposal.artifacts.proposal);
    console.log(`Updated: ${proposalPath}`);
  }

  if (proposal.artifacts.design) {
    const designPath = path.join(changesDir, 'design.md');
    fs.writeFileSync(designPath, proposal.artifacts.design);
    console.log(`Updated: ${designPath}`);
  }

  if (proposal.artifacts.tasks) {
    const tasksPath = path.join(changesDir, 'tasks.md');
    fs.writeFileSync(tasksPath, proposal.artifacts.tasks);
    console.log(`Updated: ${tasksPath}`);
  }

  // If in design mode, update manifest to 'designed' status
  if (mode === 'design') {
    const manifestPath = path.join(changesDir, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      manifest.workflowStatus = 'designed';
      manifest.updatedAt = new Date().toISOString().split('T')[0];
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
      console.log(`Updated manifest status to 'designed': ${manifestPath}`);
    }
  }

  // Write PR description
  const prDescription = `## OpenSpec Updates from Transcript

${proposal.prDescription}

### Analysis

**Change**: \`${proposal.changeName}\`
**Type**: ${proposal.isNewChange ? 'New change created' : 'Existing change updated'}
**Confidence**: ${proposal.confidence}%

### Reasoning

${proposal.reasoning}

---
*Generated from Issue #${issueNumber}*
*Closes #${issueNumber}*`;

  fs.writeFileSync('pr-description.md', prDescription);
  console.log('Wrote pr-description.md');
}

async function main() {
  try {
    if (mode === 'explore') {
      // Explore mode: analyze conversation and update artifacts
      const exploreResult = await generateExploreUpdates();
      console.log('Explore result:', exploreResult.changeName);

      // Check if there are artifact updates
      if (exploreResult.artifacts.proposal || exploreResult.artifacts.design || exploreResult.artifacts.tasks) {
        await writeArtifacts(exploreResult);
        console.log('Artifacts written successfully');
      } else {
        console.log('No artifact updates generated');
        // Write a summary as the PR description anyway
        const prDescription = `## OpenSpec Exploration from Conversation

### Summary
${exploreResult.analysis.summary}

### Key Decisions
${exploreResult.analysis.keyDecisions.map(d => `- ${d}`).join('\n')}

### Open Questions
${exploreResult.analysis.openQuestions.map(q => `- ${q}`).join('\n')}

### Refinements
${exploreResult.analysis.refinements.map(r => `- ${r}`).join('\n')}

---
*Generated from Issue #${issueNumber}*`;
        fs.writeFileSync('pr-description.md', prDescription);
      }

      // Also write the analysis for the issue comment
      const analysisComment = `## Exploration Analysis

### Summary
${exploreResult.analysis.summary}

### Key Decisions
${exploreResult.analysis.keyDecisions.map(d => `- ${d}`).join('\n')}

### Open Questions
${exploreResult.analysis.openQuestions.map(q => `- ${q}`).join('\n')}

### Refinements Made
${exploreResult.analysis.refinements.map(r => `- ${r}`).join('\n')}

---
*This analysis was generated by Claude based on Issue #${issueNumber}*
*A pull request has been created with the artifact updates.*`;
      fs.writeFileSync('explore-analysis.md', analysisComment);
      console.log('Wrote explore-analysis.md');

    } else if (mode === 'design') {
      // Design mode: generate design.md and tasks.md for existing proposal
      const designResult = await generateDesign();
      console.log('Design generated for:', designResult.changeName);

      await writeArtifacts(designResult);
      console.log('Design artifacts written successfully');

    } else if (mode === 'apply') {
      // Apply mode: update manifest to 'applied' status
      if (!explicitChangeName) {
        throw new Error('Apply mode requires an explicit change name');
      }
      const changesDir = path.join(process.cwd(), 'openspec', 'changes', explicitChangeName);
      const manifestPath = path.join(changesDir, 'manifest.json');

      if (!fs.existsSync(manifestPath)) {
        throw new Error(`Manifest not found for change: ${explicitChangeName}`);
      }

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      manifest.workflowStatus = 'applied';
      manifest.updatedAt = new Date().toISOString().split('T')[0];
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
      console.log(`Updated manifest status to 'applied': ${manifestPath}`);

      // Write PR description
      fs.writeFileSync('pr-description.md', `## OpenSpec Change Applied

**Change**: \`${explicitChangeName}\`

This change has been marked as applied/implemented.

---
*Generated from Issue #${issueNumber}*`);

    } else if (mode === 'archive') {
      // Archive mode: update manifest to 'archived' status
      if (!explicitChangeName) {
        throw new Error('Archive mode requires an explicit change name');
      }
      const changesDir = path.join(process.cwd(), 'openspec', 'changes', explicitChangeName);
      const manifestPath = path.join(changesDir, 'manifest.json');

      if (!fs.existsSync(manifestPath)) {
        throw new Error(`Manifest not found for change: ${explicitChangeName}`);
      }

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      manifest.workflowStatus = 'archived';
      manifest.archivedAt = new Date().toISOString().split('T')[0];
      manifest.updatedAt = new Date().toISOString().split('T')[0];
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
      console.log(`Updated manifest status to 'archived': ${manifestPath}`);

      // Write PR description
      fs.writeFileSync('pr-description.md', `## OpenSpec Change Archived

**Change**: \`${explicitChangeName}\`

This change has been archived.

---
*Generated from Issue #${issueNumber}*`);

    } else if (mode === 'propose') {
      // Propose mode: analyze, generate updates, write files
      const analysis = await analyzeConversation();
      console.log('Analysis complete:', JSON.stringify(analysis, null, 2));

      // Check if conversation has actionable content
      if (analysis.matchedChanges.length === 0 && !analysis.suggestedNewChange) {
        console.log('No actionable content found in conversation');

        // Write a "no changes" PR description
        fs.writeFileSync('pr-description.md', `## No OpenSpec Changes Identified

The conversation did not clearly relate to any existing changes or suggest a new initiative.

### Summary
${analysis.summary}

### Suggestions
- Consider adding more context to the conversation
- Use the \`explore\` label for exploratory discussions

---
*Generated from Issue #${issueNumber}*`);
        return;
      }

      const proposal = await generateProposal(analysis);
      console.log('Proposal generated:', proposal.changeName);

      await writeArtifacts(proposal);
      console.log('Artifacts written successfully');

    } else {
      throw new Error(`Unknown mode: ${mode}`);
    }

  } catch (error) {
    console.error('Error:', error.message);

    // Write error to file for workflow to report
    fs.writeFileSync('error.txt', error.message);
    process.exit(1);
  }
}

main();
