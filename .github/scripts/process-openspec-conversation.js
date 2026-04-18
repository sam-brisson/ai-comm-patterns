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

const PROPOSE_PROMPT = `You are updating OpenSpec artifacts based on a conversation transcript analysis.

<analysis>
{analysis}
</analysis>

<existing_changes>
${buildChangesContext()}
</existing_changes>

<conversation>
${conversation}
</conversation>

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

const EXPLORE_PROMPT = `You are analyzing a conversation transcript and updating OpenSpec artifacts based on the insights.

<existing_changes>
${buildChangesContext()}
</existing_changes>

<conversation_title>
${title}
</conversation_title>

<conversation>
${conversation}
</conversation>

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

  const prompt = PROPOSE_PROMPT.replace('{analysis}', JSON.stringify(analysis, null, 2));

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

  const response = await withRetry(() => anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [{ role: 'user', content: EXPLORE_PROMPT }]
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
    try {
      execSync(`npx openspec new change "${proposal.changeName}"`, {
        cwd: process.cwd(),
        stdio: 'inherit'
      });
    } catch (e) {
      // If openspec CLI fails, create directory manually
      fs.mkdirSync(changesDir, { recursive: true });
    }

    // Also add entry to OpenSpecChanges component
    // Extract title from proposal or use changeName
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
      // Try to get the first paragraph after "## Why"
      const whyMatch = proposal.artifacts.proposal.match(/##\s*Why\s*\n+([^\n#]+)/);
      if (whyMatch) {
        description = whyMatch[1].trim().substring(0, 150);
        if (description.length === 150) description += '...';
      }
    }

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
