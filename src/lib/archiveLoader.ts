import type { ArchivedChange } from '../types/archive';

// In a real Docusaurus build, this would use `fs` to scan the filesystem.
// This module exports a loader function and a mock fallback for the browser.

let _fs: typeof import('fs') | null = null;
let _path: typeof import('path') | null = null;

if (typeof window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  _fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  _path = require('path');
}

export function getArchivedChanges(changesDir?: string): ArchivedChange[] {
  if (typeof window !== 'undefined' || !_fs || !_path) {
    return [];
  }

  const fs = _fs;
  const path = _path;
  const dir = changesDir ?? path.resolve(process.cwd(), 'changes');

  if (!fs.existsSync(dir)) return [];

  const results: ArchivedChange[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const metaPath = path.join(dir, entry.name, 'meta.json');

    if (!fs.existsSync(metaPath)) {
      console.warn(`[archiveLoader] No meta.json found for change: ${entry.name}`);
      continue;
    }

    let meta: Record<string, unknown>;
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    } catch (e) {
      console.warn(`[archiveLoader] Failed to parse meta.json for change: ${entry.name}`, e);
      continue;
    }

    if (meta.status !== 'archived') continue;

    const changeDir = path.join(dir, entry.name);
    const artifacts = {
      proposal: fs.existsSync(path.join(changeDir, 'proposal.md')),
      design: fs.existsSync(path.join(changeDir, 'design.md')),
      tasks: fs.existsSync(path.join(changeDir, 'tasks.md')),
    };

    const links = (meta.links as { prs?: unknown[]; issues?: unknown[] }) ?? {};

    results.push({
      slug: entry.name,
      title: String(meta.title ?? entry.name),
      archivedAt: String(meta.archivedAt ?? ''),
      artifacts,
      links: {
        prs: sanitizeLinkedItems(links.prs),
        issues: sanitizeLinkedItems(links.issues),
      },
    });
  }

  return results.sort(
    (a, b) => new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime()
  );
}

function sanitizeLinkedItems(items: unknown): import('../types/archive').LinkedItem[] {
  if (!Array.isArray(items)) return [];
  return items.filter(
    (item): item is import('../types/archive').LinkedItem =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Record<string, unknown>).number === 'number' &&
      typeof (item as Record<string, unknown>).title === 'string' &&
      typeof (item as Record<string, unknown>).url === 'string' &&
      String((item as Record<string, unknown>).url).startsWith('http')
  );
}
