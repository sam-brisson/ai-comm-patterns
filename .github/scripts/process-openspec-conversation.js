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
const ANALYZE_PROMPT = `You are analyzing a Slack conversation to extract information relevant to OpenSpec change management.

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

const PROPOSE_PROMPT = `You are updating OpenSpec artifacts based on a Slack conversation analysis.

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

const EXPLORE_PROMPT = `You are analyzing a Slack conversation to provide insights for the team.

<existing_changes>
${buildChangesContext()}
</existing_changes>

<conversation_title>
${title}
</conversation_title>

<conversation>
${conversation}
</conversation>

Provide a structured analysis of this conversation. Do NOT make any file changes.

Your analysis should help the team understand:
1. What was discussed and what decisions were made
2. How this relates to existing OpenSpec changes (if at all)
3. What questions remain open
4. What actions might be needed next

Format your response as a GitHub comment (Markdown) with these sections:

## Conversation Analysis

### Summary
[2-3 sentence summary]

### Key Decisions
[Bullet list of decisions made, or "No explicit decisions identified"]

### Requirements Discussed
[Bullet list of features/requirements mentioned]

### Related Changes
[Which existing changes this relates to, with explanation]

### Open Questions
[Questions that weren't resolved in the conversation]

### Suggested Next Steps
[What the team might want to do next]

---
*This analysis was generated by Claude based on Issue #{issueNumber}*`;

async function analyzeConversation() {
  console.log('Step 1: Analyzing conversation...');

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: ANALYZE_PROMPT }]
  });

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

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = response.content[0].text;

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse proposal response');
  }

  return JSON.parse(jsonMatch[0]);
}

async function generateExploreAnalysis() {
  console.log('Generating explore analysis...');

  const prompt = EXPLORE_PROMPT.replace('{issueNumber}', issueNumber);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }]
  });

  return response.content[0].text;
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
  const prDescription = `## OpenSpec Updates from Slack Conversation

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
      // Explore mode: analyze and comment, no file changes
      const analysis = await generateExploreAnalysis();
      fs.writeFileSync('explore-analysis.md', analysis);
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
