# Enhanced Graph View for OpenSpec Changes and Artifacts

## Why

The current Explore page graph view provides a nice visual but doesn't reflect our actual work and the Spec Driven Development approach we've adopted. As we focus more on OpenSpec Changes as the core unit of work, the graph should visualize our actual features, changes, and their relationships rather than abstract concepts.

Additionally, the graph should help team members understand how different initiatives relate to each other thematically (Collaboration, Experimentation, Trust) and show the current state of our work (active vs archived, proposal vs design vs implementation).

## What Changes

### Transform Graph to Show Real Work
- Replace abstract graph with nodes representing actual OpenSpec Changes we're working on
- Each change node connects to its related artifacts: Proposals, Designs, Tasks
- Features group related changes (e.g., "TDD Knowledge Page" connects to multiple related changes)
- Color coding distinguishes artifact types (proposal, design, tasks) and status (active vs archived)

### Thematic Relationships
- Connect features based on shared themes derived from:
  - Site placement (collaboration, experimentation, trust sections)
  - Shared tags on pages
  - Example: TDD and OpenSpec Workflow both show "Collaboration" connection

### Auto-sync with OpenSpec Commands
- Integrate graph updates into standard OpenSpec workflows
- Graph view stays current with actual work without manual updates
- Reflects real-time status of changes and their progression

## Success Metrics
- Graph accurately reflects current OpenSpec Changes and their status
- Team can quickly understand feature relationships and themes
- Visual stays synchronized with actual work without manual intervention