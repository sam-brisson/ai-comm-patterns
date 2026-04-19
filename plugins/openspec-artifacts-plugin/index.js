const fs = require('fs');
const path = require('path');

/**
 * OpenSpec Artifacts Plugin for Docusaurus
 * Reads OpenSpec change manifests and artifacts at build time
 * and makes them available to components via useGlobalData()
 */
module.exports = function openspecArtifactsPlugin(context, options) {
  return {
    name: 'openspec-artifacts-plugin',

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      const changesDir = path.join(context.siteDir, 'openspec', 'changes');

      const changes = [];

      // Check if changes directory exists
      if (!fs.existsSync(changesDir)) {
        console.warn('[openspec-artifacts-plugin] No openspec/changes directory found');
        setGlobalData({ changes: [], artifacts: {} });
        return;
      }

      // Helper function to read a change directory
      function readChangeDir(changePath, dirName) {
        const change = {
          id: dirName,
          artifacts: {}
        };

        // Read manifest if it exists
        const manifestPath = path.join(changePath, 'manifest.json');
        if (fs.existsSync(manifestPath)) {
          try {
            const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
            const manifest = JSON.parse(manifestContent);
            Object.assign(change, manifest);
          } catch (err) {
            console.warn(`[openspec-artifacts-plugin] Error reading ${manifestPath}:`, err.message);
          }
        }

        // Read each artifact type
        for (const artifactType of ['proposal', 'design', 'tasks']) {
          const artifactPath = path.join(changePath, `${artifactType}.md`);

          if (fs.existsSync(artifactPath)) {
            try {
              const content = fs.readFileSync(artifactPath, 'utf-8');
              change.artifacts[artifactType] = content;
            } catch (err) {
              console.warn(`[openspec-artifacts-plugin] Error reading ${artifactPath}:`, err.message);
            }
          }
        }

        return change;
      }

      // Get all active change directories (excluding 'archive')
      const activeDirs = fs.readdirSync(changesDir).filter(dir => {
        const fullPath = path.join(changesDir, dir);
        return fs.statSync(fullPath).isDirectory() && dir !== 'archive';
      });

      for (const changeDir of activeDirs) {
        const changePath = path.join(changesDir, changeDir);
        const change = readChangeDir(changePath, changeDir);

        // Only add if we found at least one artifact or a manifest
        if (Object.keys(change.artifacts).length > 0 || change.title) {
          changes.push(change);
        }
      }

      // Read archived changes
      const archiveDir = path.join(changesDir, 'archive');
      if (fs.existsSync(archiveDir)) {
        const archivedDirs = fs.readdirSync(archiveDir).filter(dir => {
          const fullPath = path.join(archiveDir, dir);
          return fs.statSync(fullPath).isDirectory();
        });

        for (const archivedDir of archivedDirs) {
          const changePath = path.join(archiveDir, archivedDir);
          const change = readChangeDir(changePath, archivedDir);

          // Ensure archived changes have the archived status
          if (!change.workflowStatus) {
            change.workflowStatus = 'archived';
          }

          if (Object.keys(change.artifacts).length > 0 || change.title) {
            changes.push(change);
          }
        }
      }

      // Build artifacts object for backwards compatibility
      const artifacts = {};
      for (const change of changes) {
        if (Object.keys(change.artifacts).length > 0) {
          artifacts[change.id] = change.artifacts;
        }
      }

      console.log(`[openspec-artifacts-plugin] Loaded ${changes.length} changes:`, changes.map(c => c.id).join(', '));

      setGlobalData({ changes, artifacts });
    },
  };
};
