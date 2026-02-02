export interface GraphNode {
  id: string;
  title: string;
  description: string;
  section: 'collaboration' | 'trust' | 'experimentation';
  tags: string[];
  date: string | null;
  url: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  sharedTags: string[];
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  allTags: string[];
  sections: string[];
}

export interface ForceGraphNode extends GraphNode {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface ForceGraphLink {
  source: string | ForceGraphNode;
  target: string | ForceGraphNode;
  sharedTags: string[];
  weight: number;
}
