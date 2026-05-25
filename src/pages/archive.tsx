import React from 'react';
import ArchivePage from '../components/ArchivePage';
import { MOCK_ARCHIVED_CHANGES } from '../data/archivedChanges';

export default function Archive() {
  return <ArchivePage changes={MOCK_ARCHIVED_CHANGES} />;
}
