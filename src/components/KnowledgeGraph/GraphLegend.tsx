import React from 'react';

const SECTION_COLORS = {
  collaboration: '#0d6efd',
  trust: '#6f42c1',
  experimentation: '#fd7e14',
};

const legendStyles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    gap: '24px',
    padding: '12px 16px',
    background: 'var(--ifm-background-surface-color)',
    borderRadius: '8px',
    border: '1px solid var(--ifm-color-emphasis-200)',
    flexWrap: 'wrap',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  label: {
    fontSize: '14px',
    textTransform: 'capitalize' as const,
    color: 'var(--ifm-font-color-base)',
  },
  helpText: {
    fontSize: '12px',
    color: 'var(--ifm-color-emphasis-600)',
    marginLeft: 'auto',
  },
};

export default function GraphLegend(): React.ReactElement {
  return (
    <div style={legendStyles.container}>
      {Object.entries(SECTION_COLORS).map(([section, color]) => (
        <div key={section} style={legendStyles.item}>
          <div style={{ ...legendStyles.dot, backgroundColor: color }} />
          <span style={legendStyles.label}>{section}</span>
        </div>
      ))}
      <span style={legendStyles.helpText}>
        Click a node to view article • Drag to reposition • Scroll to zoom
      </span>
    </div>
  );
}
