# Enhanced Graph View Design

## Visual Structure

### Node Types
1. **Feature Nodes** (Large, central)
   - Represent major features/capabilities
   - Examples: "TDD Knowledge Page", "Slack-to-OpenSpec Action"
   - Positioned as primary hubs

2. **Change Nodes** (Medium)
   - Individual OpenSpec Changes
   - Connect to parent feature
   - Show current status through color/styling

3. **Artifact Nodes** (Small)
   - Proposals, Designs, Tasks
   - Connect to their parent change
   - Different shapes/colors for each type

### Color Coding System
- **Status Colors**:
  - Active changes: Bright colors (blue, green)
  - Archived changes: Muted colors (grays)
- **Artifact Type Colors**:
  - Proposals: Blue
  - Designs: Green
  - Tasks: Orange/Yellow
  - Completed: Gray with checkmark

### Thematic Connections
- **Connection Types**:
  - Hierarchy: Feature → Changes → Artifacts (solid lines)
  - Thematic: Feature ↔ Feature (dotted lines)
- **Theme Categories**:
  - Collaboration (derived from /collaboration pages)
  - Experimentation (derived from /experimentation pages) 
  - Trust (derived from /trust pages)
  - Shared tags create additional connections

## Data Sources

### OpenSpec Changes
- Read from existing OpenSpecChanges component data
- Parse status, completion, and metadata
- Extract feature groupings from change names/descriptions

### Site Structure
- Analyze page placement in /collaboration, /experimentation, /trust
- Extract tags and categories from frontmatter
- Build thematic relationship map

## Integration Points

### Auto-sync Mechanism
- Hook into existing OpenSpec command workflows
- Update graph data when:
  - New changes created
  - Status updates occur
  - Tasks completed
  - Changes archived

### Graph Layout
- Force-directed layout with custom constraints
- Feature nodes as anchor points
- Hierarchical positioning (features → changes → artifacts)
- Thematic clusters while maintaining hierarchy