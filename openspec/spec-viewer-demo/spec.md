## ADDED Requirements

### Requirement: Document upload with text extraction
The system SHALL allow users to upload client documents (PDF format) and automatically
extract key fields using text parsing and pattern matching.

#### Scenario: Successful document upload
- **WHEN** user uploads a valid PDF document
- **THEN** document is stored and text extraction begins

#### Scenario: Parser extracts standard fields
- **WHEN** parsing completes on a standard document
- **THEN** system extracts: client name, project ID, amount, effective date

#### Scenario: Low confidence fields are flagged
- **WHEN** extraction confidence for a field is below 80%
- **THEN** that field is highlighted for manual review

---

### Requirement: Human review before commit
The system SHALL require human verification of extracted data before syncing to
external systems. Pre-filled fields reduce data entry while maintaining accuracy.

#### Scenario: Review screen shows pre-filled data
- **WHEN** user navigates to review screen after upload
- **THEN** form fields are pre-populated with extracted values

#### Scenario: User corrects extraction errors
- **WHEN** user modifies a pre-filled field value
- **THEN** the corrected value is used for sync (not the parsed value)

#### Scenario: Manual entry fallback
- **WHEN** parsing fails completely on a document
- **THEN** user can manually enter all fields

---

### Requirement: Sync to external systems
The system SHALL push confirmed data to external systems upon user submission.
Our application is the source of truth; external systems are downstream.

#### Scenario: Successful sync to both systems
- **WHEN** user clicks "Confirm & Submit"
- **THEN** data is sent to System A AND System B
- **AND** user sees confirmation of successful sync

#### Scenario: Partial sync failure
- **WHEN** System A sync succeeds but System B fails
- **THEN** user is notified of partial failure
- **AND** failed sync is queued for retry

#### Scenario: Retry on transient failure
- **WHEN** sync fails due to network/API timeout
- **THEN** system retries with exponential backoff
- **AND** alerts user if retry limit exceeded

---

### Requirement: Audit trail
The system SHALL maintain complete audit history linking source documents to
synced records for compliance and debugging.

#### Scenario: Document attached to record
- **WHEN** submission is complete
- **THEN** original PDF is stored and linked to the database record

#### Scenario: Sync history logged
- **WHEN** any sync operation occurs
- **THEN** timestamp, target system, and result are logged
