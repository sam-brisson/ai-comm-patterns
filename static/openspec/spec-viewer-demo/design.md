## Context

We need to build a document import feature that replaces the current manual workflow.
Today the ops team receives client documents via email, then manually enters the same
data into three systems: our internal tracker and two external platforms.

Key insight from refinement: instead of pulling from external systems and reconciling,
we flip the flow. Our app becomes the source of truth that pushes to external systems.

Constraints:
- Documents come in various formats (mostly PDFs)
- Not all fields can be reliably parsed — need human verification
- Must integrate with existing external system APIs
- Ops team is the primary user; needs to be faster than their current workflow

## Goals / Non-Goals

**Goals:**
- Reduce data entry from 3x to 1x (enter once, sync everywhere)
- Catch parsing errors before they propagate to external systems
- Create audit trail with source documents attached to records
- Handle the 95% case automatically; graceful fallback for edge cases

**Non-Goals:**
- Not replacing the external systems (they stay as-is)
- Not building a general-purpose document parser
- Not changing how clients send us documents (they keep using email)

## Decisions

### Decision 1: Parsing approach
**Choice**: PDF text extraction with field pattern matching

**Rationale**: Most client documents are text-based PDFs (not scanned images).
We can extract text and use regex/patterns to find key fields. Simpler than
full OCR and sufficient for our document types.

**Alternative considered**: OCR-based extraction
- Rejected: Overkill for text PDFs; adds complexity and cost

### Decision 2: Review flow
**Choice**: Always show review screen, pre-filled with parsed results

**Rationale**: Even 95% accuracy means 1 in 20 documents has errors. Given these
feed into financial systems, human verification is non-negotiable. Pre-filling
still saves most of the typing.

**Alternative considered**: Auto-submit if confidence > 95%
- Rejected: Risk of bad data in external systems outweighs time savings

### Decision 3: Sync architecture
**Choice**: Synchronous sync on submit, with retry queue for failures

**Rationale**: Users need immediate confirmation that data reached external systems.
Async would leave them uncertain. Retry queue handles transient API failures.

**Alternative considered**: Batch sync overnight
- Rejected: Delays visibility, harder to debug failures

### Decision 4: Source of truth
**Choice**: Our app is authoritative; external systems are downstream

**Rationale**: This was the key insight from refinement. If we pull from external
systems, we're always reconciling conflicts. If we push, we control the data flow
and eliminate drift.

## Risks / Trade-offs

**[Risk]** Parsing accuracy varies by document format
→ Mitigation: Flag low-confidence fields in yellow; require explicit confirmation

**[Risk]** External API rate limits or downtime
→ Mitigation: Retry queue with exponential backoff; alert on repeated failures

**[Risk]** Users might skip review if it feels like extra work
→ Mitigation: Make review screen fast; show diff from extraction

**[Trade-off]** Synchronous sync adds latency to submit
→ Acceptable: Users prefer knowing it worked over faster-but-uncertain
