import React from 'react';
import ArchivePage from '../components/ArchivePage';
import { getArchivedChanges } from '../lib/archiveLoader';
import type { ArchivedChange } from '../types/archive';

interface Props {
  changes: ArchivedChange[];
}

export default function Archive({ changes }: Props) {
  return <ArchivePage changes={changes} />;
}

// In a non-SSG Docusaurus context, data is imported at module load time.
// Replace with getStaticProps / loader if using a custom SSG setup.
export { getArchivedChanges };
