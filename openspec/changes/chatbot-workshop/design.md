# Design: Cross-Functional Chatbot Workshop

## Overview

This design specifies the technical implementation of the workshop materials, including the interactive demo page, starter repository, and facilitation assets.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    WORKSHOP MATERIALS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │  Interactive    │    │  Starter Code   │    │ Facilitation│ │
│  │  Demo Page      │    │  Repository     │    │ Guide       │ │
│  │  (Docusaurus)   │    │  (GitHub)       │    │ (Markdown)  │ │
│  └────────┬────────┘    └────────┬────────┘    └──────┬──────┘ │
│           │                      │                     │        │
│           ▼                      ▼                     ▼        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   Workshop Experience                       ││
│  │  Phase 1: Discover → Phase 2: Specify (RED)                ││
│  │  → Phase 3: Implement (GREEN) → Phase 4: Refine            ││
│  │  → Phase 5: Demo                                           ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Component 1: Interactive Demo Page

### Location
`/docs/experimentation/chatbot-workshop.md`

### Structure

The page follows the TDD Explorer pattern with interactive elements showing the red/green/refactor cycle.

```
┌─────────────────────────────────────────────────────────────────┐
│  Chatbot Workshop: TDD for AI                                   │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  [Introduction]                                                 │
│  - Workshop objectives                                          │
│  - The discipline: specification IS the test                    │
│                                                                 │
│  [Interactive TDD Cycle]                                        │
│  ┌───────────┬───────────┬───────────┐                         │
│  │  SPECIFY  │ IMPLEMENT │  REFINE   │  ← Tab navigation       │
│  │   (RED)   │  (GREEN)  │           │                         │
│  └───────────┴───────────┴───────────┘                         │
│                                                                 │
│  [Left Panel: Test Cases]    [Right Panel: Output/Code]        │
│  ┌─────────────────────┐    ┌─────────────────────┐            │
│  │ promptfooconfig.yaml│    │ $ promptfoo eval    │            │
│  │                     │    │                     │            │
│  │ tests:              │    │ Test 1: ❌ FAIL     │            │
│  │   - vars:           │    │ Test 2: ❌ FAIL     │            │
│  │       query: "..."  │    │ Test 3: ❌ FAIL     │            │
│  │     assert:         │    │                     │            │
│  │       - type: ...   │    │                     │            │
│  └─────────────────────┘    └─────────────────────┘            │
│                                                                 │
│  [Workshop Phases Accordion]                                    │
│  ▶ Phase 1: Discover (45 min)                                  │
│  ▶ Phase 2: Specify - Write Failing Tests (30 min)             │
│  ▶ Phase 3: Implement - Make Tests Pass (45 min)               │
│  ▶ Phase 4: Refine - Add Edge Cases (45 min)                   │
│  ▶ Phase 5: Demo + Reflect (30 min)                            │
│                                                                 │
│  [Get Started Button] → Links to starter repo                  │
└─────────────────────────────────────────────────────────────────┘
```

### React Components Required

#### 1. `TDDCycleViewer`
Interactive tabbed component showing the three TDD phases.

```tsx
interface TDDCycleViewerProps {
  phases: {
    id: 'specify' | 'implement' | 'refine';
    label: string;
    leftPanel: {
      title: string;
      code: string;
      language: 'yaml' | 'text' | 'python';
    };
    rightPanel: {
      title: string;
      content: string;
      status: 'fail' | 'pass' | 'neutral';
    };
  }[];
}
```

**Behavior:**
- Clicking tabs transitions between phases
- Left panel shows editable code (syntax highlighted)
- Right panel shows simulated terminal output
- Visual indicator (red/green) matches phase

#### 2. `TerminalOutput`
Simulated CLI output for promptfoo eval results.

```tsx
interface TerminalOutputProps {
  lines: {
    text: string;
    status?: 'pass' | 'fail' | 'neutral';
  }[];
}
```

**Styling:**
- Monospace font, dark background
- ✅ green for pass, ❌ red for fail
- Typing animation on phase transition (optional)

#### 3. `WorkshopPhaseAccordion`
Expandable sections for each workshop phase.

```tsx
interface WorkshopPhaseProps {
  phases: {
    number: number;
    title: string;
    duration: string;
    tddStage?: 'red' | 'green' | 'refactor';
    activities: string[];
    artifact: string;
    roleNotes: {
      product: string;
      design: string;
      engineering: string;
    };
  }[];
}
```

### Content Sections

#### Introduction
```markdown
## TDD for AI: The Specification IS the Test

Traditional software testing verifies code behavior.
AI testing verifies *conversation* behavior.

In this workshop, you'll learn to:
1. **Specify** expected chatbot behavior as testable assertions
2. **Implement** system prompts that satisfy those assertions
3. **Refine** by adding edge cases and confirming no regressions

The tool: **promptfoo** - a CLI that runs your tests and shows red/green results.
```

#### Phase Details (Accordion Content)

**Phase 2: Specify (RED)**
```markdown
### Write Failing Tests First

Before writing any system prompt, define what success looks like.

**Activities:**
- Convert plain-English scenarios to YAML test cases
- Use `llm-rubric` assertions for behavior expectations
- Run `promptfoo eval` with empty system prompt
- Celebrate the red failures - they prove your tests work

**Example Test Case:**
​```yaml
tests:
  - vars:
      query: "I'm frustrated with this product"
    assert:
      - type: llm-rubric
        value: "Response acknowledges the user's frustration empathetically"
​```

**Role Focus:**
- **Product**: Define the "what" - acceptance criteria
- **Design**: Define the "how" - tone and personality
- **Engineering**: Define the "boundaries" - guardrails and constraints
```

## Component 2: Starter Repository

### Repository Structure

```
chatbot-workshop-starter/
├── README.md                    # Setup + workshop instructions
├── requirements.txt             # Python dependencies
├── .env.example                 # API key template
├── promptfooconfig.yaml         # Test configuration (starter)
├── system-prompt.txt            # Empty file (teams fill this)
├── app.py                       # Gradio chat interface
└── examples/
    ├── customer-support/
    │   ├── promptfooconfig.yaml
    │   └── system-prompt.txt
    ├── onboarding-buddy/
    │   ├── promptfooconfig.yaml
    │   └── system-prompt.txt
    └── product-recommender/
        ├── promptfooconfig.yaml
        └── system-prompt.txt
```

### File Contents

#### `requirements.txt`
```
gradio>=4.0.0
openai>=1.0.0
promptfoo>=0.80.0
python-dotenv>=1.0.0
```

#### `.env.example`
```bash
# Get your free API key at https://console.groq.com
GROQ_API_KEY=your_key_here

# Backup: https://openrouter.ai/keys
OPENROUTER_API_KEY=your_key_here
```

#### `promptfooconfig.yaml` (Starter)
```yaml
# Chatbot Workshop - Test Configuration
# =====================================
# Your team's test cases go here!
#
# TDD Cycle:
#   1. Write tests below (RED - they will fail)
#   2. Edit system-prompt.txt (GREEN - make them pass)
#   3. Add more tests (REFACTOR - expand coverage)

description: "My chatbot tests"

prompts:
  - file://system-prompt.txt

providers:
  - id: groq:llama-3.3-70b-versatile
    config:
      apiKey: ${GROQ_API_KEY}

defaultTest:
  vars:
    # The prompt template - {{query}} gets replaced by test input
    prompt: "{{query}}"

tests:
  # ===================
  # HAPPY PATH TESTS
  # ===================

  # Test 1: Basic greeting
  - vars:
      query: "Hello!"
    assert:
      - type: llm-rubric
        value: "Response is a friendly greeting"

  # Test 2: [YOUR TEAM] Add your first real test case here
  # - vars:
  #     query: "..."
  #   assert:
  #     - type: llm-rubric
  #       value: "..."

  # ===================
  # GUARDRAIL TESTS
  # ===================

  # Test 3: Should stay on topic
  - vars:
      query: "What's your opinion on politics?"
    assert:
      - type: llm-rubric
        value: "Politely declines to discuss off-topic subjects"

  # ===================
  # TONE TESTS
  # ===================

  # Test 4: Should be empathetic to frustration
  - vars:
      query: "This is so frustrating!"
    assert:
      - type: llm-rubric
        value: "Acknowledges frustration with empathy"
```

#### `system-prompt.txt` (Empty Starter)
```
# Your system prompt goes here
#
# This file starts empty intentionally!
#
# TDD Process:
# 1. Run: promptfoo eval
# 2. See tests FAIL (red)
# 3. Write your prompt below
# 4. Run: promptfoo eval
# 5. See tests PASS (green)
#
# Delete these comments and write your prompt:

```

#### `app.py` (Gradio Interface)
```python
"""
Chatbot Workshop - Interactive Chat Interface
=============================================
This provides a live chat UI to test your system prompt interactively.

Usage:
    python app.py

Then open http://localhost:7860 in your browser.
"""

import os
import gradio as gr
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq client (OpenAI-compatible)
client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.getenv("GROQ_API_KEY")
)

# Load system prompt from file
def load_system_prompt():
    with open("system-prompt.txt", "r") as f:
        content = f.read().strip()
        # Filter out comments
        lines = [l for l in content.split('\n') if not l.strip().startswith('#')]
        return '\n'.join(lines).strip()

def chat(message: str, history: list) -> str:
    """Process a chat message and return the response."""

    system_prompt = load_system_prompt()

    if not system_prompt:
        return "⚠️ System prompt is empty! Edit system-prompt.txt first."

    # Build conversation history
    messages = [{"role": "system", "content": system_prompt}]

    for user_msg, assistant_msg in history:
        messages.append({"role": "user", "content": user_msg})
        messages.append({"role": "assistant", "content": assistant_msg})

    messages.append({"role": "user", "content": message})

    # Call the LLM
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.7,
        max_tokens=1024
    )

    return response.choices[0].message.content

# Create and launch the interface
demo = gr.ChatInterface(
    fn=chat,
    title="🤖 Chatbot Workshop",
    description="Test your chatbot interactively. Edit system-prompt.txt to change behavior.",
    examples=[
        "Hello!",
        "I need help with something",
        "This is frustrating!",
    ],
    theme="soft"
)

if __name__ == "__main__":
    demo.launch()
```

#### `README.md`
```markdown
# Chatbot Workshop Starter

Build a tested chatbot in under 4 hours using TDD principles.

## Quick Start

### 1. Setup Environment

```bash
# Clone this repo
git clone <repo-url>
cd chatbot-workshop-starter

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure API Key

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your Groq API key
# Get a free key at: https://console.groq.com
```

### 3. Run Your First Test (RED)

```bash
promptfoo eval
```

You should see **failing tests** - this is correct! The system prompt is empty.

### 4. Write Your System Prompt (GREEN)

Edit `system-prompt.txt` with your chatbot's instructions, then:

```bash
promptfoo eval
```

Keep iterating until all tests pass.

### 5. Test Interactively

```bash
python app.py
```

Open http://localhost:7860 to chat with your bot.

## Workshop Phases

| Phase | Duration | Focus |
|-------|----------|-------|
| 1. Discover | 45 min | Problem framing, test scenarios |
| 2. Specify | 30 min | Write failing tests (RED) |
| 3. Implement | 45 min | Make tests pass (GREEN) |
| 4. Refine | 45 min | Add edge cases, no regressions |
| 5. Demo | 30 min | Show tests + live chatbot |

## Common Commands

```bash
# Run all tests
promptfoo eval

# Run tests and open web UI for detailed results
promptfoo eval --view

# Run specific test by index
promptfoo eval --filter-pattern "greeting"

# Clear cache and re-run
promptfoo eval --no-cache
```

## Assertion Types

| Type | Use For | Example |
|------|---------|---------|
| `llm-rubric` | Behavioral expectations | "Response is empathetic" |
| `contains` | Must include text | "return policy" |
| `not-contains` | Must not include | Competitor names |
| `is-json` | Structured output | API responses |

## Need Help?

- [promptfoo docs](https://www.promptfoo.dev/docs/)
- [Groq API docs](https://console.groq.com/docs)
- [Gradio docs](https://gradio.app/docs/)
```

## Component 3: Facilitation Guide

### Location
`/docs/experimentation/chatbot-workshop-facilitator.md`

### Content Outline

```markdown
# Facilitator Guide: Chatbot Workshop

## Pre-Workshop Checklist

### 1 Week Before
- [ ] Test API keys and rate limits
- [ ] Clone starter repo and verify setup works
- [ ] Prepare example use cases for teams
- [ ] Set up shared screen for demos

### Day Before
- [ ] Confirm participant laptops have Python 3.8+
- [ ] Pre-install dependencies on shared machines (if applicable)
- [ ] Print problem framing worksheets
- [ ] Test projector/screen sharing

### Day Of
- [ ] Distribute API keys (or have signup instructions ready)
- [ ] Open starter repo URL for easy access
- [ ] Prepare timer for phase transitions

## Phase-by-Phase Facilitation

### Phase 1: Discover (45 min)

**Facilitator Actions:**
- Form teams (3-4 people, mix of PM/Eng/Design)
- Distribute problem framing worksheet
- Share example use cases if teams are stuck

**Key Questions to Prompt:**
- "Who is the user? What problem are they facing?"
- "What are 3 things this chatbot MUST do well?"
- "What should it NEVER do?"

**Warning Signs:**
- Teams trying to boil the ocean → Focus on ONE use case
- No designer input → Ask "What tone should this have?"

### Phase 2: Specify (30 min)

**Facilitator Actions:**
- Walk through YAML syntax on projector
- Show `llm-rubric` examples
- Have teams run `promptfoo eval` with empty prompt

**Key Moment:**
Celebrate the RED failures! "These failing tests prove your specification works."

**Common Issues:**
- "What do I write for the rubric?" → "Describe what a good response looks like"
- YAML syntax errors → Check indentation (2 spaces, no tabs)

### Phase 3: Implement (45 min)

**Facilitator Actions:**
- Encourage rapid iteration: edit prompt → eval → repeat
- Suggest starting with minimal prompt, then adding detail
- 15-min check-in: "How many tests passing?"

**Coaching Tips:**
- If stuck: "What would you tell a human to do this job?"
- If over-engineering: "Start simpler. You can always add."

### Phase 4: Refine (45 min)

**Facilitator Actions:**
- Pair teams for cross-testing
- Prompt: "Try to break their bot. What edge cases fail?"
- Have teams add new tests for discovered issues

**Cross-Testing Protocol:**
1. Team A tests Team B's chatbot (3 min)
2. Team A shares 2 things that worked, 1 thing that broke
3. Swap roles
4. Both teams add new test cases based on feedback

### Phase 5: Demo (30 min)

**Demo Format (3 min per team):**
1. Show test suite running (30 sec)
2. Highlight one clever test case (30 sec)
3. Live chat demo (1 min)
4. One learning to share (1 min)

**Wrap-Up Discussion:**
- "What assertion types were most useful?"
- "What was harder than expected?"
- "How would you apply this to your real work?"

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Rate limit hit | Switch to OpenRouter backup key |
| API timeout | Check network; retry with smaller model |
| YAML parse error | Validate at yamlchecker.com |
| Tests always pass | Make rubric more specific |
| Tests always fail | Check system prompt isn't empty |

## Materials Checklist

- [ ] Starter repo URL
- [ ] API keys (Groq primary, OpenRouter backup)
- [ ] Problem framing worksheets
- [ ] This facilitation guide
- [ ] Timer/stopwatch
- [ ] Projector for demos
```

## Implementation Plan

### Phase 1: Core Components
1. Create `TDDCycleViewer` React component
2. Create `TerminalOutput` component
3. Create `WorkshopPhaseAccordion` component
4. Build demo page with static content

### Phase 2: Starter Repository
1. Create GitHub repository
2. Add all starter files
3. Test complete workflow locally
4. Write README with clear instructions

### Phase 3: Documentation
1. Write facilitator guide
2. Add to Docusaurus sidebar
3. Cross-link from demo page

### Phase 4: Testing
1. Run mock workshop with small group
2. Gather feedback on materials
3. Iterate based on learnings

## Success Metrics

- [ ] Demo page loads with working interactive components
- [ ] Starter repo can go from clone to passing tests in <10 minutes
- [ ] Non-engineers can read and understand test YAML
- [ ] All roles report contributing to test suite in pilot workshop
