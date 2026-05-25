import { ArchivedChange } from '../types/archive';

// Sorted by archivedAt descending (most recent first).
// In production this would be populated from meta.json files at build time.
export const MOCK_ARCHIVED_CHANGES: ArchivedChange[] = [
  {
    slug: 'knowledge-graph',
    title: 'Knowledge Graph',
    archivedAt: '2024-11-10',
    artifacts: { proposal: true, design: true, tasks: true },
    links: {
      prs: [
        { number: 38, title: 'feat: add knowledge graph component', url: 'https://github.com/org/repo/pull/38' },
      ],
      issues: [
        { number: 12, title: 'Knowledge graph visualization needed', url: 'https://github.com/org/repo/issues/12' },
      ],
    },
  },
  {
    slug: 'mermaid-diagram',
    title: 'Mermaid Diagram Integration',
    archivedAt: '2024-10-22',
    artifacts: { proposal: true, design: true, tasks: false },
    links: {
      prs: [
        { number: 29, title: 'feat: mermaid diagram rendering', url: 'https://github.com/org/repo/pull/29' },
      ],
      issues: [],
    },
  },
  {
    slug: 'homepage-features',
    title: 'Homepage Features Section',
    archivedAt: '2024-09-14',
    artifacts: { proposal: true, design: false, tasks: false },
    links: { prs: [], issues: [] },
  },
];
