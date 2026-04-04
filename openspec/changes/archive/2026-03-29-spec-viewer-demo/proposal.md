## Why

The article about self-documenting systems needs a tangible example that shows
what team collaboration looks like at each OpenSpec stage. Text descriptions
aren't enough — readers need to see realistic PM/Engineer conversations that
demonstrate how specs evolve through refinement.

## What Changes

- Add an interactive React component (`SpecFlowDemo`) to the Docusaurus site
- Component shows four stages: Propose → Design → Tasks → Archive
- Each stage displays a realistic conversation snippet between PM and Engineer
- Uses a generalized "Document Import with Smart Sync" feature as the example
- Each stage includes a link to view the actual OpenSpec artifact (proposal.md,
  design.md, etc.) so readers can see real spec files
- The component itself is built using OpenSpec, making it self-referential —
  readers see the demo AND can inspect the specs that produced it

## Capabilities

### New Capabilities
- `spec-flow-demo`: Interactive React component that visualizes the OpenSpec
  workflow with example team conversations at each stage, linking to actual
  spec artifacts

### Modified Capabilities
<!-- None - this is a new standalone component -->

## Impact

- New component in `src/components/SpecFlowDemo/`
- Updated article at `docs/experimentation/self-documenting-systems.md`
- OpenSpec artifacts copied to `static/openspec/spec-viewer-demo/` for public access
- No external dependencies beyond existing Docusaurus setup
