## ADDED Requirements

### Requirement: Update proposal.md with new requirements
The system SHALL append newly discovered requirements to the "What Changes" section of proposal.md without removing existing content.

#### Scenario: Add new requirement
- **WHEN** conversation reveals requirement not in existing proposal
- **THEN** system adds bullet point to "What Changes" section

#### Scenario: Preserve existing content
- **WHEN** updating proposal with new information
- **THEN** all existing proposal content remains intact

### Requirement: Update design.md with decisions
The system SHALL add new design decisions from conversations to the "Decisions" section of design.md.

#### Scenario: Add design decision
- **WHEN** conversation contains "We'll use Redis for caching"
- **THEN** system adds decision entry with rationale to design.md

#### Scenario: Add to existing decisions
- **WHEN** design.md already has decisions and conversation adds more
- **THEN** new decisions are appended, existing remain unchanged

### Requirement: Update tasks.md with action items
The system SHALL add identified action items to tasks.md in appropriate format.

#### Scenario: Add new task
- **WHEN** conversation identifies work item "Implement the caching layer"
- **THEN** system adds task to tasks.md

### Requirement: Create new change when needed
The system SHALL create a new change directory with initial artifacts when conversation represents a new initiative.

#### Scenario: Create new change
- **WHEN** no existing change matches and conversation has substantive content
- **THEN** system creates `openspec/changes/<suggested-name>/` with proposal.md populated from conversation

#### Scenario: Use openspec CLI
- **WHEN** creating new change
- **THEN** system uses `openspec new change` to ensure proper scaffolding

### Requirement: Generate PR description with analysis
The system SHALL create a PR description that explains what was updated and why.

#### Scenario: PR description content
- **WHEN** creating PR for artifact updates
- **THEN** PR body includes: matched change(s), confidence level, list of changes made, suggestions for reviewer

#### Scenario: Multiple changes updated
- **WHEN** conversation touches multiple changes
- **THEN** PR description lists each change updated with per-change reasoning

### Requirement: Post explore analysis as comment
The system SHALL post structured analysis as an issue comment when in explore mode.

#### Scenario: Explore mode output
- **WHEN** issue has "explore" label
- **THEN** system posts comment with: key decisions identified, potential change matches, open questions, suggested next steps

#### Scenario: No PR in explore mode
- **WHEN** issue has "explore" label
- **THEN** system does NOT create a PR or modify any files
