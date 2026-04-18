# Archived Changes Exploration for OpenSpec Landing Page

## Why

As teams mature in their OpenSpec adoption, they accumulate archived changes that represent valuable institutional knowledge. Currently, once a change is archived, it becomes effectively invisible - disappearing from the active changes table with no browsing mechanism. This creates several problems:

1. Engineers working on related features can't easily discover how similar problems were solved previously
2. Understanding the evolution of a feature requires manual folder navigation
3. New team members lose access to the change history that could accelerate their onboarding
4. Archived changes become a "graveyard" rather than a living knowledge base

Teams will naturally develop rhythms around archiving decisions and enhancement patterns, but they need infrastructure to support discovery and exploration of their accumulated knowledge.

## What Changes

### Landing Page Archive Integration

- Add "Explore Archives" section to existing OpenSpec changes landing page
- Provide multiple entry points: search with filters, browse by domain/tag, recent archives
- Include visualization options like domain heatmaps or timeline views
- Keep archives separate from active changes to avoid search noise

### Individual Archive Enhancement

- Add "Related Changes" sections to archived change pages
- Show evolution timeline for changes that are part of a series
- Provide "Propose Follow-up" action to connect archives back to active work
- Support both manual and auto-suggested relatedness

### Discovery Patterns

- **Related Work Discovery**: Search and tag-based filtering for engineers solving similar problems
- **Evolution Understanding**: Timeline and lineage views for feature history
- **Onboarding Support**: Curated collections and guided exploration paths
- **Serendipitous Discovery**: Related changes recommendations and browsable visualizations

### Progressive Implementation

- Start with basic expandable "Archived Changes" section with search/filter
- Iterate based on actual usage patterns
- Add visualization and recommendation features as teams establish archive browsing habits

## Success Metrics

- Teams reference archived changes when proposing new work
- Reduced time for engineers to discover relevant prior art
- Archived changes receive engagement rather than being forgotten
- Follow-up changes demonstrate connection to archived work