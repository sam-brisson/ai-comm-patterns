import React from 'react';
import Layout from '@theme/Layout';
import KnowledgeGraph from '@site/src/components/KnowledgeGraph';
import styles from './explore.module.css';

export default function ExplorePage(): React.ReactElement {
  return (
    <Layout
      title="Explore Knowledge Graph"
      description="Interactive visualization of article connections based on shared topics"
    >
      <main className={styles.explorePage}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Explore the Knowledge Graph</h1>
            <p className={styles.subtitle}>
              Discover connections between articles based on shared topics and themes.
              Each node represents an article, and connections show where articles share
              common tags. The closer two articles are, the more topics they have in common.
            </p>
          </header>

          <section className={styles.graphSection}>
            <KnowledgeGraph />
          </section>

          <aside className={styles.instructions}>
            <h3 className={styles.instructionsTitle}>How to use this graph</h3>
            <ul className={styles.instructionsList}>
              <li><strong>Click</strong> on any node to navigate to that article</li>
              <li><strong>Hover</strong> over a node to see its title, description, and tags</li>
              <li><strong>Drag</strong> nodes to reposition them and explore the structure</li>
              <li><strong>Scroll</strong> to zoom in and out of the graph</li>
              <li><strong>Filter</strong> by tag using the dropdown above the graph</li>
            </ul>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
