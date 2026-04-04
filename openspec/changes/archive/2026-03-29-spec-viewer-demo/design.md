## Context

We're building an interactive React component for a Docusaurus site that demonstrates
the OpenSpec workflow. The component needs to:
- Show realistic PM/Engineer conversations at each stage
- Link to actual spec artifacts (served from /static/)
- Work with Docusaurus theming (light/dark mode)
- Be self-contained with no external dependencies

The site already uses React (via Docusaurus), CSS Modules, and has an existing
component pattern we can follow.

## Goals / Non-Goals

**Goals:**
- Create a clear, interactive visualization of the 4-stage OpenSpec workflow
- Make the conversations feel authentic and relatable to small teams
- Provide direct links to real spec artifacts so readers can inspect them
- Keep the component lightweight and maintainable

**Non-Goals:**
- No animation library (simple CSS transitions only)
- No state management beyond React useState
- No dynamic loading of spec files (content is hardcoded, links go to static files)
- No mobile-specific layout (responsive via CSS, but not a separate design)

## Decisions

### Decision 1: Component structure
**Choice**: Single component file with conversation data defined inline

**Rationale**: The conversations are specific to this demo and won't be reused.
Keeping them in the component makes it self-contained and easy to update.

**Alternative considered**: External JSON/YAML file for conversations
- Rejected: Adds complexity, no clear benefit for a one-off demo

### Decision 2: Styling approach
**Choice**: CSS Modules (`.module.css`)

**Rationale**: Matches existing Docusaurus patterns, scoped styles, works with
theming via CSS variables.

**Alternative considered**: Tailwind or inline styles
- Rejected: Site doesn't use Tailwind; inline styles harder to maintain

### Decision 3: Artifact links
**Choice**: Link to static files at `/openspec/spec-viewer-demo/*.md`

**Rationale**: Simple, no build-time processing needed. Files are copied to
`static/openspec/spec-viewer-demo/` and served as-is.

**Alternative considered**: Embed artifact content in component
- Rejected: Defeats the purpose of showing "real" artifacts

### Decision 4: Conversation display format
**Choice**: Chat-bubble style with speaker labels (PM/Engineer)

**Rationale**: Familiar pattern, clearly shows back-and-forth dialogue,
visually distinct from the artifact links.

## Risks / Trade-offs

**[Risk]** Conversations may feel too scripted
→ Mitigation: Based on real transcript dynamics, kept casual tone

**[Risk]** Static file links break if artifacts move
→ Mitigation: Document the expected path; copy step is part of archive process

**[Trade-off]** Hardcoded content means no reuse
→ Acceptable: This is a specific demo, not a generic component
