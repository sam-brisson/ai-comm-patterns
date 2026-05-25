export interface LinkedItem {
  number: number;
  title: string;
  url: string;
}

export interface ArchivedChange {
  slug: string;
  title: string;
  archivedAt: string;
  artifacts: {
    proposal: boolean;
    design: boolean;
    tasks: boolean;
  };
  links: {
    prs: LinkedItem[];
    issues: LinkedItem[];
  };
}
