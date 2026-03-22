## Why

When documents come in from clients, we're currently updating three different systems
manually — our internal tracker and two external platforms. The ops team is spending
hours on repetitive data entry, and the manual process is error-prone. Data drifts
out of sync between systems, and we often don't catch it until reporting time.

We initially thought we'd pull data from the external systems and reconcile it in our
app. But in refinement, the engineer proposed flipping the flow: make our app the
single entry point that pushes to the other systems. One source of truth, synced everywhere.

## What Changes

- Add document upload capability with PDF text parsing and field extraction
- Create a review screen where users verify extracted data before saving
- Implement sync adapters for external system APIs
- Our app becomes the source of truth; external systems receive updates from us
- Manual entry fallback when parsing confidence is low

## Capabilities

### New Capabilities
- `document-upload`: Upload client documents (PDFs) and extract key fields via text parsing
- `review-and-confirm`: Human-in-the-loop review screen before data is committed
- `external-sync`: Push confirmed data to external systems

### Modified Capabilities
<!-- None - this is a new workflow -->

## Impact

- New API endpoints for upload, review, and sync
- New React components for upload UI and review screen
- Integration with PDF parsing library
- API credentials needed for external systems
- Ops workflow changes from "enter data 3 times" to "review once and submit"
