## ADDED Requirements

### Requirement: Display four workflow stages
The component SHALL display four navigable stages: Propose, Design, Tasks, and Archive.
Each stage SHALL be visually distinct and show the user's current position in the workflow.

#### Scenario: User sees all stages on load
- **WHEN** user views the component
- **THEN** all four stages (Propose, Design, Tasks, Archive) are visible as navigation elements

#### Scenario: Current stage is highlighted
- **WHEN** user is viewing a specific stage
- **THEN** that stage indicator shows as active/selected

---

### Requirement: Show team conversation at each stage
Each stage SHALL display a realistic conversation snippet between a PM and Engineer
discussing the "Document Import with Smart Sync" feature.

#### Scenario: Propose stage conversation
- **WHEN** user views the Propose stage
- **THEN** they see this exchange:
  - **PM**: "Right now when we get documents, we're updating three different systems manually. It's error-prone and MJ is spending hours on data entry."
  - **Engineer**: "Wait — are we pulling from those systems and reconciling, or should we flip it? Make our app the source of truth and push to them?"
  - **PM**: "Oh. That's... actually way better. One entry point, syncs everywhere."

#### Scenario: Design stage conversation
- **WHEN** user views the Design stage
- **THEN** they see this exchange:
  - **Engineer**: "So when they upload the document, I'm thinking we OCR it, pre-fill the fields, but require a human review before save."
  - **PM**: "What if the document format varies? Like different clients send different layouts?"
  - **Engineer**: "We handle the common case with OCR, but always show a review screen. If OCR confidence is low, we flag those fields. She just verifies and hits submit."
  - **PM**: "So it's not fully automated, but it's way less typing. I like that."

#### Scenario: Tasks stage conversation
- **WHEN** user views the Tasks stage
- **THEN** they see the breakdown:
  - **Engineer**: "Alright, breaking this down: upload endpoint, OCR service, review screen UI, sync to System A, sync to System B. I'd say the review screen is the riskiest — we should spike that first."
  - **PM**: "What's the dependency order?"
  - **Engineer**: "Upload and OCR can be parallel. Review screen needs OCR output. Syncs need the review to be done. So: upload + OCR first, then review UI, then syncs."

#### Scenario: Archive stage conversation
- **WHEN** user views the Archive stage
- **THEN** they see captured learnings:
  - **PM**: "So what actually shipped vs what we planned?"
  - **Engineer**: "We reversed the data flow — app is now source of truth. OCR works about 95% of the time, so we added a manual entry fallback. The review screen caught two edge cases we didn't anticipate."
  - **PM**: "And the sync reliability?"
  - **Engineer**: "Rock solid. Having one entry point eliminated the drift we had before."

---

### Requirement: Link to actual spec artifacts
Each stage SHALL include a clickable link to view the corresponding OpenSpec artifact
file (proposal.md, design.md, tasks.md, or archived summary).

#### Scenario: User clicks artifact link
- **WHEN** user clicks "View proposal.md" link in Propose stage
- **THEN** they are navigated to `/openspec/spec-viewer-demo/proposal.md`

---

### Requirement: Navigate between stages
Users SHALL be able to navigate between stages using both stage indicators and
Previous/Next buttons.

#### Scenario: Click stage indicator
- **WHEN** user clicks on the "Design" stage indicator
- **THEN** the Design stage content is displayed

#### Scenario: Use next button
- **WHEN** user clicks "Next" from Propose stage
- **THEN** the Design stage content is displayed

#### Scenario: Previous button disabled on first stage
- **WHEN** user is on Propose stage
- **THEN** the Previous button is disabled

---

### Requirement: Respect Docusaurus theming
The component SHALL adapt to Docusaurus light and dark modes using CSS variables.

#### Scenario: Dark mode styling
- **WHEN** user has dark mode enabled
- **THEN** component colors use dark theme variables
