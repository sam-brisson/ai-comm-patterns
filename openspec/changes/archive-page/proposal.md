# Archive Page

## Why

As changes move through the OpenSpec workflow, some reach an archived state. Currently there is no dedicated place in the UI to view these archived changes — users have no way to browse historical work, reference past decisions, or access artifacts from completed/archived changes without leaving the site.

A dedicated archive page would make archived changes discoverable and useful, providing a clear historical record of work that has moved through the workflow.

## What Changes

### Archive Viewing Page

Create a new page (e.g. `/archive`) that lists all archived changes. Each entry in the list must display:

- **Change title** — the name/title of the archived change
- **Archive date** — the date the change was archived
- **Link to artifacts** — a navigable link to the associated artifacts (proposal, design, tasks) for that change

## What Does Not Change

- The active workflow board remains unchanged
- The archiving mechanism/process itself is out of scope for this change
- No modifications to how changes are archived — only how they are viewed

## Success Criteria

- Users can navigate to a dedicated archive page
- All archived changes are listed with title, archive date, and artifact links
- Artifact links are functional and lead to the correct content
