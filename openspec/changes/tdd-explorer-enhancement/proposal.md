# TDD Knowledge Page with Example Mapping

## Why

Our team lacks standardized TDD practices. Different engineers approach test-driven development inconsistently, and new team members have no clear resource for understanding how TDD fits into our workflow. The success of our OpenSpec demo showed that interactive documentation effectively communicates complex processes — people finally "got it" when they could click through the stages and see realistic conversations.

We want to apply the same approach to TDD: an interactive knowledge page that explains how our team uses Example Mapping to discover test cases and Pytest to implement them.

Additionally, the original TDD Explorer Enhancement proposed Jest integration, but our team uses Python/Pytest. This change pivots to Pytest and focuses on the knowledge page as the primary deliverable. Test explorer tooling improvements are deferred to a future change.

## What Changes

### Interactive TDD Knowledge Page

Build an interactive explanation of our TDD workflow, modeled on the OpenSpec demo:

- **Stage navigator** showing the TDD workflow: Story → Example Mapping → Pytest Tests → Red/Green/Refactor
- **Example Mapping visualization** with Matt Wynn's colored card system (yellow=rules, green=examples, red=questions, blue=story)
- **Realistic team conversations** at each stage showing how PM, Engineer, and QA collaborate
- **Pytest code examples** demonstrating how workshop outputs become executable tests
- **Artifact viewer** letting users inspect the actual test files, fixtures, and conftest patterns

### Content Focus

The knowledge page documents our team's actual practices:

- When Example Mapping fits into story refinement
- How rules and examples translate to Pytest test cases
- Our conventions for test file organization and naming
- Fixture patterns and conftest.py organization
- When to use parametrize, marks, and other Pytest features

### What's NOT in Scope

- Test explorer UI improvements (tree view, inline failures, re-run buttons) — deferred to separate change
- Drag-and-drop interactivity for Example Mapping cards — static step-through is sufficient to teach the concept
- Live test execution or workshop tooling — this is documentation, not a workshop facilitation tool

## Capabilities

### New Capability

- `tdd-knowledge-page`: Interactive React component explaining TDD workflow with Example Mapping, reusing the proven OpenSpec demo pattern

## Impact

- New component in `src/components/TDDKnowledgePage/`
- New documentation page linking to the component
- Content files (markdown/JSON) for stages, conversations, and code examples
- No changes to existing test infrastructure or tooling
