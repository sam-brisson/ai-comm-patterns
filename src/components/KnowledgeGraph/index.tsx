import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import { useColorMode } from '@docusaurus/theme-common';
import useGlobalData from '@docusaurus/useGlobalData';
import BrowserOnly from '@docusaurus/BrowserOnly';
import type { GraphData, GraphNode, ForceGraphNode, ForceGraphLink } from './types';
import GraphLegend from './GraphLegend';
import styles from './styles.module.css';

const SECTION_COLORS = {
  collaboration: '#0d6efd',
  trust: '#6f42c1',
  experimentation: '#fd7e14',
};

interface TooltipState {
  node: ForceGraphNode | null;
  x: number;
  y: number;
}

function KnowledgeGraphInner(): React.ReactElement {
  const globalData = useGlobalData();
  const graphData = globalData['knowledge-graph-plugin']?.default as GraphData | undefined;
  const { colorMode } = useColorMode();
  const history = useHistory();
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({ node: null, x: 0, y: 0 });
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [ForceGraph2D, setForceGraph2D] = useState<any>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Dynamically import react-force-graph-2d
  useEffect(() => {
    import('react-force-graph-2d').then((module) => {
      setForceGraph2D(() => module.default);
    });
  }, []);

  // Filter nodes based on selected tag
  const filteredData = useMemo(() => {
    if (!graphData) return { nodes: [], links: [] };

    let nodes = graphData.nodes;
    let edges = graphData.edges;

    if (selectedTag) {
      nodes = nodes.filter(node => node.tags.includes(selectedTag));
      const nodeIds = new Set(nodes.map(n => n.id));
      edges = edges.filter(
        edge => nodeIds.has(edge.source) && nodeIds.has(edge.target)
      );
    }

    // Convert edges to links format expected by react-force-graph
    const links: ForceGraphLink[] = edges.map(edge => ({
      source: edge.source,
      target: edge.target,
      sharedTags: edge.sharedTags,
      weight: edge.weight,
    }));

    return { nodes: [...nodes], links };
  }, [graphData, selectedTag]);

  // Configure force simulation for better spacing
  useEffect(() => {
    if (graphRef.current && !hasInitialized && filteredData.nodes.length > 0) {
      // Increase charge repulsion for more spacing between nodes
      graphRef.current.d3Force('charge')?.strength(-500);
      // Set link distance for better separation
      graphRef.current.d3Force('link')?.distance(140);
      // Zoom to fit after initial layout settles
      setTimeout(() => {
        graphRef.current?.zoomToFit(400, 50);
      }, 600);
      setHasInitialized(true);
    }
  }, [ForceGraph2D, filteredData, hasInitialized]);

  // Calculate node sizes based on connection count
  const nodeSizes = useMemo(() => {
    const sizes = new Map<string, number>();
    const connectionCount = new Map<string, number>();

    filteredData.links.forEach(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      connectionCount.set(sourceId, (connectionCount.get(sourceId) || 0) + 1);
      connectionCount.set(targetId, (connectionCount.get(targetId) || 0) + 1);
    });

    const maxConnections = Math.max(...connectionCount.values(), 1);

    filteredData.nodes.forEach(node => {
      const connections = connectionCount.get(node.id) || 0;
      // Node size: min 6, max 16, scaled by connection count
      const size = 6 + (connections / maxConnections) * 10;
      sizes.set(node.id, size);
    });

    return sizes;
  }, [filteredData]);

  const handleNodeClick = useCallback((node: ForceGraphNode) => {
    history.push(node.url);
  }, [history]);

  const handleNodeHover = useCallback((node: ForceGraphNode | null, event?: MouseEvent) => {
    if (node && event) {
      setTooltip({
        node,
        x: event.clientX + 10,
        y: event.clientY + 10,
      });
    } else {
      setTooltip({ node: null, x: 0, y: 0 });
    }
  }, []);

  const nodeCanvasObject = useCallback((
    node: ForceGraphNode,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) => {
    const size = nodeSizes.get(node.id) || 8;
    const color = SECTION_COLORS[node.section] || '#888';

    // Draw node circle
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, size, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    // Draw border
    ctx.strokeStyle = colorMode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw label when zoomed in enough
    if (globalScale > 1.5) {
      const label = node.title.length > 25 ? node.title.substring(0, 25) + '...' : node.title;
      const fontSize = Math.max(10, 12 / globalScale);
      ctx.font = `${fontSize}px Sans-Serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = colorMode === 'dark' ? '#fff' : '#000';
      ctx.fillText(label, node.x || 0, (node.y || 0) + size + 2);
    }
  }, [nodeSizes, colorMode]);

  const linkColor = useCallback(() => {
    return colorMode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
  }, [colorMode]);

  const linkWidth = useCallback((link: ForceGraphLink) => {
    return Math.min(link.weight * 1.5, 6);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedTag('');
  }, []);

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateTitle}>No articles found</div>
        <div className={styles.emptyStateText}>
          Articles with tags will appear here once they are added.
        </div>
      </div>
    );
  }

  if (!ForceGraph2D) {
    return (
      <div className={styles.graphContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>Loading graph...</span>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.controls}>
        <span className={styles.filterLabel}>Filter by tag:</span>
        <select
          className={styles.tagFilter}
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">All tags</option>
          {graphData.allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
        {selectedTag && (
          <button className={styles.resetButton} onClick={handleReset}>
            Reset filter
          </button>
        )}
      </div>

      <GraphLegend />

      <div ref={containerRef} className={styles.graphContainer} style={{ marginTop: '16px' }}>
        <ForceGraph2D
          ref={graphRef}
          graphData={filteredData}
          nodeId="id"
          nodeCanvasObject={nodeCanvasObject}
          nodePointerAreaPaint={(node: ForceGraphNode, color: string, ctx: CanvasRenderingContext2D) => {
            const size = nodeSizes.get(node.id) || 8;
            ctx.beginPath();
            ctx.arc(node.x || 0, node.y || 0, size + 4, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }}
          linkColor={linkColor}
          linkWidth={linkWidth}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          backgroundColor={colorMode === 'dark' ? '#1b1b1d' : '#ffffff'}
          width={containerRef.current?.clientWidth || 800}
          height={600}
          d3AlphaDecay={0.015}
          d3VelocityDecay={0.25}
          warmupTicks={100}
          cooldownTicks={300}
        />
      </div>

      {tooltip.node && (
        <div
          className={styles.tooltip}
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          <div className={`${styles.tooltipSection} ${styles[`section${tooltip.node.section.charAt(0).toUpperCase() + tooltip.node.section.slice(1)}`]}`}>
            {tooltip.node.section}
          </div>
          <div className={styles.tooltipTitle}>{tooltip.node.title}</div>
          {tooltip.node.description && (
            <div className={styles.tooltipDescription}>{tooltip.node.description}</div>
          )}
          <div className={styles.tooltipTags}>
            {tooltip.node.tags.map(tag => (
              <span key={tag} className={styles.tooltipTag}>{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function KnowledgeGraph(): React.ReactElement {
  return (
    <BrowserOnly fallback={<div className={styles.graphContainer}>Loading...</div>}>
      {() => <KnowledgeGraphInner />}
    </BrowserOnly>
  );
}
