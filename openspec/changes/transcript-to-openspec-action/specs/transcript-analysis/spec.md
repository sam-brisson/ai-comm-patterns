## ADDED Requirements

### Requirement: Extract decisions from transcript
The system SHALL identify explicit decisions made in conversation transcripts and extract them as structured information including the decision, who made it, and relevant context.

#### Scenario: Clear decision statement
- **WHEN** transcript contains "We decided to use WebSockets instead of polling"
- **THEN** system extracts decision: "Use WebSockets instead of polling" with participants and reasoning

#### Scenario: Implicit agreement
- **WHEN** transcript shows proposal followed by agreement ("Let's do X" → "Sounds good")
- **THEN** system extracts the agreed-upon decision

### Requirement: Identify requirements and features
The system SHALL extract feature requests, requirements, and specifications mentioned in transcripts.

#### Scenario: Feature request identified
- **WHEN** transcript contains "We need dark mode support"
- **THEN** system extracts as a requirement: "Dark mode support"

#### Scenario: Requirement with details
- **WHEN** transcript contains "Dark mode should default to system preference"
- **THEN** system extracts requirement with constraint: "Dark mode defaults to system preference"

### Requirement: Detect action items
The system SHALL identify action items and next steps mentioned in transcripts.

#### Scenario: Explicit action item
- **WHEN** transcript contains "Alice will handle the API design"
- **THEN** system extracts action item with assignee

#### Scenario: Open question needing resolution
- **WHEN** transcript ends with unresolved question ("Should we support IE11?")
- **THEN** system flags as open question requiring decision

### Requirement: Handle conversation noise
The system SHALL filter out off-topic messages, greetings, and tangential discussion when extracting relevant content.

#### Scenario: Mixed conversation content
- **WHEN** transcript contains both feature discussion and unrelated chatter
- **THEN** system extracts only the feature-relevant content

#### Scenario: Empty or trivial conversation
- **WHEN** transcript contains no substantive decisions or requirements
- **THEN** system indicates no actionable content found
