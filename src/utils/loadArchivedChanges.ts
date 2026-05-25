/**
 * Build-time utility to load archived changes from the filesystem.
 * Used by SSG pipelines (e.g. getStaticProps or Docusaurus plugin).
 * Falls back gracefully when running in browser context.
 */

import { ArchivedChange } from '../types/archive';

interface MetaJson {
  title: string;
  status: string;
  archivedAt: string;
  artifacts?: {
    proposal?: boolean;
    design?: boolean;
    tasks?: boolean;
  };
  links?: {
    prs?: Array<{ number: number; title: string; url: string }>;
    issues?: Array<{ number: number; title: string; url: string }>;
  };
}

export async function loadArchivedChanges(changesDir: string): Promise<ArchivedChange[]> {
  if (typeof window !== 'undefined') return [];

  const fs = await import('fs/promises');
  const path = await import('path');

  let entries: string[];
  try {
    entries = await fs.readdir(changesDir);
  } catch {
    console.warn(`[archive] Could not read changes directory: ${changesDir}`);
    return [];
  }

  const results: ArchivedChange[] = [];

  for (const entry of entries) {
    const metaPath = path.join(changesDir, entry, 'meta.json');
    let raw: string;
    try {
      raw = await fs.readFile(metaPath, 'utf-8');
    } catch {
      console.warn(`[archive] Missing meta.json for change: ${entry}`);
      continue;
    }

    let meta: MetaJson;
    try {
      meta = JSON.parse(raw) as MetaJson;
    } catch {
      console.warn(`[archive] Malformed meta.json for change: ${entry}`);
      continue;
    }

    if (meta.status !== 'archived') continue;

    results.push({
      slug: entry,
      title: meta.title,
      archivedAt: meta.archivedAt,
      artifacts: {
        proposal: meta.artifacts?.proposal ?? false,
        design: meta.artifacts?.design ?? false,
        tasks: meta.artifacts?.tasks ?? false,
      },
      links: {
        prs: (meta.links?.prs ?? []).filter(
          (p) => p.url && p.url.startsWith('http')
        ),
        issues: (meta.links?.issues ?? []).filter(
          (i) => i.url && i.url.startsWith('http')
        ),
      },
    });
  }

  return results.sort(
    (a, b) => new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime()
  );
}
