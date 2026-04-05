# TDD Knowledge Page - Design

## Overview

The TDD Knowledge Page is an interactive documentation component that teaches our team's TDD workflow using Example Mapping. It follows the same proven pattern as the OpenSpec demo: a stage navigator with conversations, artifacts, and step-through navigation.

## Architecture

### Component Structure

```
src/components/TDDKnowledgePage/
├── index.tsx           # Main component with stage navigation
├── styles.module.css   # Styling (based on OpenSpec demo)
└── content/
    └── stages.json     # Stage definitions, conversations, artifacts
```

### Why External Content Files

The OpenSpec demo hardcodes ~250 lines of content in the TSX file. For maintainability, the TDD Knowledge Page will load content from external JSON/markdown files:

- **Easier updates**: Team members can update conventions without touching React code
- **Clear ownership**: Content changes are visible in PRs as documentation changes
- **Version tracking**: Content files can include last-updated dates

### Reusing OpenSpec Demo Patterns

The OpenSpec demo component (`src/components/OpenSpecDemo/index.tsx`) provides a working pattern:

| OpenSpec Demo | TDD Knowledge Page |
|---------------|-------------------|
| 4 stages (Propose → Design → Tasks → Archive) | 5 stages (Story → Example Mapping → Tests → Red-Green-Refactor → Integration) |
| PM/Engineer conversations | PM/Engineer/QA conversations (three amigos) |
| Artifact modal (proposal.md, design.md, etc.) | Artifact modal (example_map.md, test_user_login.py, conftest.py) |
| ~400 lines of React | ~400 lines of React + external content |

## Stage Definitions

### Stage 1: Story Definition

**Intent**: Present the user story and acceptance criteria that will drive the Example Mapping session.

**Conversation**: PM introduces the story, team asks clarifying questions about scope and constraints.

**Artifact**: `story.md` — The user story with acceptance criteria.

### Stage 2: Example Mapping

**Intent**: Show how the team collaboratively discovers rules and examples using Matt Wynn's colored card technique.

**Conversation**: Three amigos (PM, Engineer, QA) workshop the story. They identify rules (yellow), concrete examples (green), and surface questions (red).

**Artifact**: `example_map.md` — Visual representation of the cards:

```
┌─────────────────────────────────────────────────┐
│ 🔵 STORY: User can log in with email/password   │
├─────────────────────────────────────────────────┤
│ 🟡 RULE: Valid credentials grant access         │
│   🟢 Example: correct email + password → success│
│   🟢 Example: correct email, wrong pw → failure │
│   🔴 Question: What about case sensitivity?     │
├─────────────────────────────────────────────────┤
│ 🟡 RULE: Account must be active                 │
│   🟢 Example: suspended account → denied        │
│   🟢 Example: unverified email → denied         │
└─────────────────────────────────────────────────┘
```

### Stage 3: Pytest Tests

**Intent**: Show how Example Mapping outputs translate directly to Pytest test cases.

**Conversation**: Engineer explains how each green card becomes a test case, how rules become test groupings or parametrization.

**Artifact**: `test_user_login.py` — The actual Pytest tests:

```python
import pytest
from auth import authenticate

class TestValidCredentials:
    """Rule: Valid credentials grant access"""

    def test_correct_credentials_succeed(self, active_user):
        result = authenticate(active_user.email, "correct_password")
        assert result.success is True

    def test_wrong_password_fails(self, active_user):
        result = authenticate(active_user.email, "wrong_password")
        assert result.success is False
        assert result.error == "invalid_credentials"

class TestAccountStatus:
    """Rule: Account must be active"""

    def test_suspended_account_denied(self, suspended_user):
        result = authenticate(suspended_user.email, "correct_password")
        assert result.success is False
        assert result.error == "account_suspended"
```

### Stage 4: Red-Green-Refactor

**Intent**: Demonstrate the TDD cycle in action — write failing test, make it pass, clean up.

**Conversation**: Engineer walks through running the tests (red), implementing the minimal code (green), and improving the implementation (refactor).

**Artifact**: `implementation.py` — The production code that makes tests pass, with before/after showing the refactor step.

### Stage 5: Integration

**Intent**: Show how individual tests fit into the larger test suite and CI pipeline.

**Conversation**: Team discusses test organization, fixture sharing via conftest.py, and how these tests run in CI.

**Artifact**: `conftest.py` — Shared fixtures demonstrating our team's patterns:

```python
import pytest
from models import User

@pytest.fixture
def active_user(db_session):
    """An active, verified user for testing happy paths."""
    user = User(email="test@example.com", status="active", verified=True)
    db_session.add(user)
    db_session.commit()
    yield user
    db_session.delete(user)

@pytest.fixture
def suspended_user(db_session):
    """A suspended user for testing access denial."""
    user = User(email="suspended@example.com", status="suspended")
    db_session.add(user)
    db_session.commit()
    yield user
    db_session.delete(user)
```

## UI Components

### Stage Navigator

Identical to OpenSpec demo:
- Horizontal button row with icons and labels
- Arrow connectors between stages
- Active/completed state styling
- Click to jump to any stage

### Conversation Panel

Identical to OpenSpec demo:
- Speaker labels (PM, Engineer, QA)
- Message bubbles with role-based styling
- Static content, no typing animations

### Artifact Viewer

Modal overlay (like OpenSpec demo) with enhancements:
- Syntax highlighting for Python code blocks
- Tab interface if stage has multiple artifacts
- Copy-to-clipboard button for code examples

### Example Mapping Card Display

**Not drag-and-drop.** Static visualization of cards appearing in sequence:
- Colored card styling (blue/yellow/green/red borders)
- Cards grouped under their parent rule
- Clean visual hierarchy showing the mapping structure

## Content Schema

```typescript
interface Stage {
  id: string;
  label: string;
  icon: string;
  intent: string;           // "Intent:" line shown above conversation
  scenario: string;         // "In this example:" line
  conversation: Message[];
  artifacts: Artifact[];    // Multiple artifacts per stage supported
}

interface Message {
  speaker: 'PM' | 'Engineer' | 'QA';
  text: string;
}

interface Artifact {
  name: string;             // e.g., "test_user_login.py"
  language?: string;        // For syntax highlighting
  content: string;
}
```

## Content Maintenance

### Ownership

Content updates should be reviewed by someone familiar with the team's Pytest conventions. Suggested: rotate ownership quarterly or assign to whoever last updated the testing guidelines.

### Staleness Indicators

Each content file includes metadata:

```json
{
  "lastUpdated": "2026-04-05",
  "maintainer": "larry",
  "stages": [...]
}
```

The component can optionally display "Last updated X months ago" if content is aging.

## Future Considerations

These are explicitly **not** in scope for this change but noted for potential follow-up:

- **Test Explorer tooling**: Tree view, inline failures, re-run buttons (separate change)
- **Workshop facilitation mode**: Actual drag-and-drop for running Example Mapping sessions
- **Multiple examples**: Different story types (API endpoint, data migration, bug fix)
- **Quiz/assessment**: Knowledge check after completing the walkthrough
