const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Gather context about existing OpenSpec changes for Claude to analyze
 */

const changesDir = path.join(process.cwd(), 'openspec', 'changes');

function getExistingChanges() {
  const changes = [];

  if (!fs.existsSync(changesDir)) {
    console.error('No openspec/changes directory found');
    return changes;
  }

  const entries = fs.readdirSync(changesDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === 'archive') continue; // Skip archived changes

    const changePath = path.join(changesDir, entry.name);
    const proposalPath = path.join(changePath, 'proposal.md');
    const designPath = path.join(changePath, 'design.md');
    const tasksPath = path.join(changePath, 'tasks.md');

    const change = {
      name: entry.name,
      path: changePath,
      proposal: null,
      design: null,
      tasks: null,
      status: 'unknown'
    };

    // Read proposal summary (first 500 chars)
    if (fs.existsSync(proposalPath)) {
      const content = fs.readFileSync(proposalPath, 'utf8');
      change.proposal = content.substring(0, 1000);
    }

    // Read design summary (first 500 chars)
    if (fs.existsSync(designPath)) {
      const content = fs.readFileSync(designPath, 'utf8');
      change.design = content.substring(0, 500);
    }

    // Check tasks status
    if (fs.existsSync(tasksPath)) {
      const content = fs.readFileSync(tasksPath, 'utf8');
      const totalTasks = (content.match(/- \[[ x]\]/g) || []).length;
      const completedTasks = (content.match(/- \[x\]/g) || []).length;
      change.tasks = {
        total: totalTasks,
        completed: completedTasks,
        summary: content.substring(0, 300)
      };
      change.status = completedTasks === totalTasks ? 'complete' : 'in-progress';
    }

    changes.push(change);
  }

  return changes;
}

function getArtifactTemplates() {
  // Try to get templates via openspec CLI if available
  try {
    const result = execSync('openspec instructions proposal --json 2>/dev/null', {
      encoding: 'utf8',
      cwd: process.cwd()
    });
    const instructions = JSON.parse(result);
    return {
      proposalTemplate: instructions.template || null,
      proposalInstructions: instructions.instruction || null
    };
  } catch (e) {
    // CLI not available or no change context, return defaults
    return {
      proposalTemplate: null,
      proposalInstructions: null
    };
  }
}

// Main execution
const context = {
  existingChanges: getExistingChanges(),
  templates: getArtifactTemplates(),
  timestamp: new Date().toISOString()
};

// Output as JSON
console.log(JSON.stringify(context, null, 2));
