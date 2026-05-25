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

### Design Consistency Requirement

The archive page must feel like a native view of the OpenSpec application — not a disconnected or separately styled page. Specifically:

- **Color palette**: Use the same colors defined in the existing app's design system
- **Typography**: Use the same typefaces, weights, and text sizing conventions as the rest of the app
- **Component styles**: Reuse existing UI components (buttons, links, badges, containers, etc.) wherever applicable
- **Interaction patterns**: Follow the same hover states, focus styles, navigation patterns, and spacing conventions used across the app
- **Layout**: A list or table layout is acceptable — the archive view is not required to replicate the card-based board layout. However, the chosen layout must feel native to the app and consistent with its existing design conventions.

## What Does Not Change

- The active workflow board remains unchanged
- The archiving mechanism/process itself is out of scope for this change
- The card-based board layout is not required to be replicated in the archive view
