import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

let mermaidId = 0;

export default function MermaidDiagram({ chart, className }: MermaidDiagramProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef<string>(`mermaid-${++mermaidId}`);

  useEffect(() => {
    const renderChart = async () => {
      if (containerRef.current) {
        try {
          const { svg } = await mermaid.render(idRef.current, chart);
          containerRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          containerRef.current.innerHTML = `<pre>${chart}</pre>`;
        }
      }
    };

    renderChart();
  }, [chart]);

  return <div ref={containerRef} className={className} />;
}
