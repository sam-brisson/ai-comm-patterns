const fs = require('fs');
const path = require('path');

/**
 * OpenSpec Artifacts Plugin for Docusaurus
 * Reads OpenSpec change artifacts (proposal.md, design.md, tasks.md) at build time
 * and makes them available to components via useGlobalData()
 */
module.exports = function openspecArtifactsPlugin(context, options) {
  return {
    name: 'openspec-artifacts-plugin',

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      const changesDir = path.join(context.siteDir, 'openspec', 'changes');

      const artifacts = {};

      // Check if changes directory exists
      if (!fs.existsSync(changesDir)) {
        console.warn('[openspec-artifacts-plugin] No openspec/changes directory found');
        setGlobalData({ artifacts: {} });
        return;
      }

      // Get all change directories (excluding 'archive')
      const changeDirs = fs.readdirSync(changesDir).filter(dir => {
        const fullPath = path.join(changesDir, dir);
        return fs.statSync(fullPath).isDirectory() && dir !== 'archive';
      });

      for (const changeDir of changeDirs) {
        const changePath = path.join(changesDir, changeDir);
        const changeArtifacts = {};

        // Read each artifact type
        for (const artifactType of ['proposal', 'design', 'tasks']) {
          const artifactPath = path.join(changePath, `${artifactType}.md`);

          if (fs.existsSync(artifactPath)) {
            try {
              const content = fs.readFileSync(artifactPath, 'utf-8');
              changeArtifacts[artifactType] = content;
            } catch (err) {
              console.warn(`[openspec-artifacts-plugin] Error reading ${artifactPath}:`, err.message);
            }
          }
        }

        // Only add if we found at least one artifact
        if (Object.keys(changeArtifacts).length > 0) {
          artifacts[changeDir] = changeArtifacts;
        }
      }

      console.log(`[openspec-artifacts-plugin] Loaded artifacts for ${Object.keys(artifacts).length} changes:`, Object.keys(artifacts).join(', '));

      setGlobalData({ artifacts });
    },
  };
};
