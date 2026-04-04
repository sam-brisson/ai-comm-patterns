## ADDED Requirements

### Requirement: Match conversation to existing changes
The system SHALL compare conversation content against all existing OpenSpec changes and identify which change(s) the conversation relates to.

#### Scenario: Clear match to single change
- **WHEN** conversation discusses "spec viewer redesign" and `spec-viewer-v2` change exists
- **THEN** system matches to `spec-viewer-v2` with high confidence

#### Scenario: Multiple potential matches
- **WHEN** conversation touches topics relevant to both `spec-viewer-v2` and `dark-mode-support`
- **THEN** system identifies both changes with confidence scores for each

#### Scenario: No existing change matches
- **WHEN** conversation discusses a new initiative with no matching change
- **THEN** system indicates no match and suggests creating a new change

### Requirement: Provide confidence scores
The system SHALL assign confidence levels to change matches based on semantic similarity and keyword overlap.

#### Scenario: High confidence match
- **WHEN** conversation explicitly mentions change name or key proposal terms
- **THEN** system assigns high confidence (>80%)

#### Scenario: Low confidence match
- **WHEN** conversation has tangential relevance to a change
- **THEN** system assigns low confidence (<50%) with explanation

### Requirement: Suggest new change names
The system SHALL propose a kebab-case change name when conversation represents a new initiative.

#### Scenario: New feature discussion
- **WHEN** conversation discusses "adding keyboard shortcuts for power users"
- **THEN** system suggests change name: `keyboard-shortcuts`

#### Scenario: Bug fix discussion
- **WHEN** conversation discusses "fixing the login timeout issue"
- **THEN** system suggests change name: `fix-login-timeout`

### Requirement: Explain matching rationale
The system SHALL provide human-readable explanation of why each match was identified.

#### Scenario: Match explanation
- **WHEN** system matches conversation to `spec-viewer-v2`
- **THEN** explanation includes: matched keywords, relevant proposal sections, confidence reasoning
