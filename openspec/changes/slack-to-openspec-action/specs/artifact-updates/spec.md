## ADDED Requirements

### Requirement: Update proposal.md with new requirements
The system SHALL append newly discovered requirements to the "What Changes" section of proposal.md without removing existing content.

#### Scenario: Add new requirement
- **WHEN** transcript reveals requirement not in existing proposal
- **THEN** system adds bullet point to "What Changes" section

#### Scenario: Preserve existing content
- **WHEN** updating proposal with new information
- **THEN** all existing proposal content remains intact

### Requirement: Update design.md with decisions
The system SHALL add new design decisions from transcripts to the "Decisions" section of design.md.

#### Scenario: Add design decision
- **WHEN** transcript contains "We'll use Redis for caching"
- **THEN** system adds decision entry with rationale to design.md

#### Scenario: Add to existing decisions
- **WHEN** design.md already has decisions and transcript adds more
- **THEN** new decisions are appended, existing remain unchanged

### Requirement: Update tasks.md with action items
The system SHALL add identified action items to tasks.md in appropriate format.

#### Scenario: Add new task
- **WHEN** transcript identifies work item "Implement the caching layer"
- **THEN** system adds task to tasks.md

### Requirement: Create new change when needed
The system SHALL create a new change directory with initial artifacts when transcript represents a new initiative.

#### Scenario: Create new change
- **WHEN** no existing change matches and transcript has substantive content
- **THEN** system creates `openspec/changes/<suggested-name>/` with proposal.md populated from transcript

#### Scenario: Register in component
- **WHEN** creating new change
- **THEN** system adds entry to OpenSpecChanges component for site display

### Requirement: Generate PR description with analysis
The system SHALL create a PR description that explains what was updated and why.

#### Scenario: PR description content
- **WHEN** creating PR for artifact updates
- **THEN** PR body includes: matched change(s), confidence level, list of changes made, suggestions for reviewer

#### Scenario: Multiple changes updated
- **WHEN** transcript touches multiple changes
- **THEN** PR description lists each change updated with per-change reasoning

### Requirement: Support iterative updates via comments
The system SHALL re-process a conversation when `/update` command is posted as issue comment.

#### Scenario: Comment-triggered update
- **WHEN** user posts `/update` followed by additional context
- **THEN** system re-analyzes full conversation including new comment

#### Scenario: Update existing PR
- **WHEN** PR already exists for the issue
- **THEN** system updates existing PR branch rather than creating new one
