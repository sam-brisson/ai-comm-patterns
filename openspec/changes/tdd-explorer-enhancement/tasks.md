# TDD Knowledge Page - Tasks

## Slice 1: Component Skeleton + First Stage (Ship & Learn)

Goal: Get something live that team members can click through, even if incomplete.

### Component Setup
- [ ] Create `src/components/TDDKnowledgePage/` directory structure
- [ ] Copy and adapt stage navigator from OpenSpec demo
- [ ] Set up content loading from external JSON file
- [ ] Implement basic styling (reuse OpenSpec demo CSS as starting point)

### First Stage: Story Definition
- [ ] Write Stage 1 content: user story, conversation, artifact
- [ ] Implement conversation panel with PM/Engineer/QA speaker support
- [ ] Implement artifact modal (reuse from OpenSpec demo)
- [ ] Add component to a documentation page for testing

### Checkpoint
- [ ] Team member walks through Stage 1 and provides feedback
- [ ] Identify any usability issues before building more stages

---

## Slice 2: Example Mapping Stage (Core Value)

Goal: The Example Mapping stage is the key differentiator — this is what teaches the new concept.

### Stage 2: Example Mapping Content
- [ ] Write realistic three-amigos conversation discovering rules and examples
- [ ] Create example map artifact showing colored card structure
- [ ] Design static card visualization (colored borders, hierarchy)

### Card Display Component
- [ ] Build card display component (static, not drag-and-drop)
- [ ] Style cards with appropriate colors (blue/yellow/green/red)
- [ ] Show cards grouped under parent rules

### Checkpoint
- [ ] Team member unfamiliar with Example Mapping reviews Stage 2
- [ ] Verify the concept is clear without prior knowledge

---

## Slice 3: Pytest Tests Stage (The Payoff)

Goal: Show the direct connection from Example Mapping outputs to executable tests.

### Stage 3: Pytest Tests Content
- [ ] Write conversation explaining card-to-test translation
- [ ] Create test file artifact with real Pytest patterns
- [ ] Demonstrate class grouping matching rules, methods matching examples

### Code Display Enhancement
- [ ] Add syntax highlighting for Python code in artifact viewer
- [ ] Add copy-to-clipboard button for code examples

### Checkpoint
- [ ] Engineer reviews test examples for accuracy to team conventions
- [ ] Verify fixture usage and patterns match what we actually do

---

## Slice 4: Red-Green-Refactor + Integration Stages

Goal: Complete the workflow with TDD cycle demonstration and test suite organization.

### Stage 4: Red-Green-Refactor Content
- [ ] Write conversation walking through the TDD cycle
- [ ] Create before/after code artifacts showing refactor step
- [ ] Show test output (red → green)

### Stage 5: Integration Content
- [ ] Write conversation about test organization and CI
- [ ] Create conftest.py artifact demonstrating fixture patterns
- [ ] Show how tests fit into larger suite structure

### Final Polish
- [ ] Add navigation between all 5 stages
- [ ] Verify stage progression feels natural
- [ ] Test responsive layout on different screen sizes

---

## Slice 5: Content Maintenance & Documentation

Goal: Ensure the knowledge page can be maintained over time.

### Content Infrastructure
- [ ] Document content file format and how to update
- [ ] Add lastUpdated metadata to content file
- [ ] Assign initial content ownership

### Documentation
- [ ] Link knowledge page from relevant docs (onboarding, testing guide)
- [ ] Add brief README in component directory explaining structure

---

## Definition of Done

- [ ] All 5 stages have content and are navigable
- [ ] At least 2 team members have walked through and confirmed it's clear
- [ ] Content is in external files, not hardcoded in TSX
- [ ] Component is linked from documentation site
- [ ] Content ownership is assigned

---

## Deferred (Future Changes)

These items are explicitly out of scope. Captured here for future reference:

### Test Explorer Tooling (Separate Change)
- Hierarchical tree view for Pytest tests
- Inline failure details with assertion info
- Re-run buttons for failed tests
- Search and filter across test names

### Workshop Facilitation Mode
- Drag-and-drop card interface for live Example Mapping sessions
- Real-time collaboration features
- Export workshop results to markdown

### Extended Content
- Multiple example scenarios (API, data migration, bug fix)
- Advanced Pytest patterns (parametrize, marks, plugins)
- Quiz/assessment after walkthrough
