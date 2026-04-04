const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Knowledge Graph Plugin for Docusaurus
 * Extracts article metadata and generates graph data for visualization
 */
module.exports = function knowledgeGraphPlugin(context, options) {
  return {
    name: 'knowledge-graph-plugin',

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      const docsDir = path.join(context.siteDir, 'docs');

      // Get baseUrl from site config (e.g., '/ai-comm-patterns/')
      const baseUrl = context.siteConfig.baseUrl || '/';

      // Sections to scan
      const sections = ['collaboration', 'trust', 'experimentation'];
      const nodes = [];
      const nodeMap = new Map();

      /**
       * Convert filename to URL slug
       * Docusaurus strips leading date patterns (YYYYMMDD_) from filenames
       */
      function getUrlSlug(filename) {
        // Remove file extension
        let slug = filename.replace(/\.(md|mdx)$/, '');
        // Strip leading date pattern (e.g., 20250810_)
        slug = slug.replace(/^\d{8}_/, '');
        return slug;
      }

      // Scan each section for articles
      for (const section of sections) {
        const sectionPath = path.join(docsDir, section);

        if (!fs.existsSync(sectionPath)) {
          continue;
        }

        const files = fs.readdirSync(sectionPath).filter(
          file => file.endsWith('.md') || file.endsWith('.mdx')
        );

        for (const file of files) {
          const filePath = path.join(sectionPath, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const { data: frontmatter } = matter(fileContent);

          // Skip files without tags
          if (!frontmatter.tags || !Array.isArray(frontmatter.tags) || frontmatter.tags.length === 0) {
            continue;
          }

          const urlSlug = getUrlSlug(file);
          const id = `${section}/${urlSlug}`;

          const node = {
            id,
            title: frontmatter.title || frontmatter.sidebar_title || urlSlug,
            description: frontmatter.description || '',
            section,
            tags: frontmatter.tags,
            date: frontmatter.date || null,
            url: `${baseUrl}docs/${section}/${urlSlug}`,
          };

          nodes.push(node);
          nodeMap.set(id, node);
        }
      }

      // Generate edges based on shared tags
      const edges = [];
      const edgeSet = new Set(); // Track unique edges

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];

          // Find shared tags
          const sharedTags = nodeA.tags.filter(tag => nodeB.tags.includes(tag));

          if (sharedTags.length > 0) {
            const edgeKey = [nodeA.id, nodeB.id].sort().join('--');

            if (!edgeSet.has(edgeKey)) {
              edgeSet.add(edgeKey);
              edges.push({
                source: nodeA.id,
                target: nodeB.id,
                sharedTags,
                weight: sharedTags.length,
              });
            }
          }
        }
      }

      // Collect all unique tags for filtering
      const allTags = [...new Set(nodes.flatMap(node => node.tags))].sort();

      // Set the graph data globally
      setGlobalData({
        nodes,
        edges,
        allTags,
        sections,
      });
    },
  };
};
