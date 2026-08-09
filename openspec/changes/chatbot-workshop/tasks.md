# Tasks: Cross-Functional Chatbot Workshop

## Overview

Implementation tasks for the chatbot workshop materials, organized by deliverable.

---

## Deliverable 1: Starter Repository

### Task 1.1: Create GitHub Repository
- [ ] Create `chatbot-workshop-starter` repository
- [ ] Add MIT license
- [ ] Configure .gitignore for Python

### Task 1.2: Core Files
- [ ] Create `requirements.txt`
  ```
  gradio>=4.0.0
  openai>=1.0.0
  promptfoo>=0.80.0
  python-dotenv>=1.0.0
  ```
- [ ] Create `.env.example` with Groq and OpenRouter placeholders
- [ ] Create empty `system-prompt.txt` with instructional comments
- [ ] Create `promptfooconfig.yaml` with starter test cases (llm-rubric focused)

### Task 1.3: Gradio Chat Interface
- [ ] Create `app.py` with:
  - Groq client initialization
  - System prompt file loader
  - Chat function with conversation history
  - `gr.ChatInterface` with examples
- [ ] Test locally: clone → install → run

### Task 1.4: Example Use Cases
- [ ] Create `examples/customer-support/` with working promptfoo config + system prompt
- [ ] Create `examples/onboarding-buddy/` with working promptfoo config + system prompt
- [ ] Create `examples/product-recommender/` with working promptfoo config + system prompt

### Task 1.5: Documentation
- [ ] Write `README.md` with:
  - Quick start (5 steps)
  - Workshop phases table
  - Common commands reference
  - Assertion types cheat sheet

---

## Deliverable 2: Interactive Demo Page

### Task 2.1: React Components

#### TDDCycleViewer Component
- [ ] Create `src/components/TDDCycleViewer/index.tsx`
- [ ] Implement tabbed interface (Specify / Implement / Refine)
- [ ] Add split-pane layout (code left, output right)
- [ ] Syntax highlighting for YAML and bash
- [ ] Red/green visual states matching TDD phase
- [ ] Create `src/components/TDDCycleViewer/styles.module.css`

#### TerminalOutput Component
- [ ] Create `src/components/TerminalOutput/index.tsx`
- [ ] Monospace dark theme styling
- [ ] Pass/fail icons (✅/❌) with colors
- [ ] Optional typing animation on transition

#### WorkshopPhaseAccordion Component
- [ ] Create `src/components/WorkshopPhaseAccordion/index.tsx`
- [ ] Expandable sections with phase metadata
- [ ] Role badges (Product / Design / Engineering)
- [ ] TDD stage indicator (RED / GREEN / REFACTOR)

### Task 2.2: Demo Page Content
- [ ] Create `docs/experimentation/chatbot-workshop.mdx`
- [ ] Write introduction: "TDD for AI: The Specification IS the Test"
- [ ] Embed `TDDCycleViewer` with three phases:
  - **Specify (RED)**: Empty prompt, failing tests
  - **Implement (GREEN)**: Written prompt, passing tests
  - **Refine**: Added edge case, all tests pass
- [ ] Embed `WorkshopPhaseAccordion` with all 5 phases
- [ ] Add "Get Started" button linking to GitHub repo
- [ ] Add to sidebar under Experimentation

### Task 2.3: Code Examples for Demo
- [ ] Write `promptfooconfig.yaml` example for Specify phase
- [ ] Write simulated terminal output for RED state
- [ ] Write `system-prompt.txt` example for Implement phase
- [ ] Write simulated terminal output for GREEN state
- [ ] Write expanded test suite for Refine phase

---

## Deliverable 3: Facilitation Guide

### Task 3.1: Create Facilitator Page
- [ ] Create `docs/experimentation/chatbot-workshop-facilitator.md`
- [ ] Pre-workshop checklist (1 week, day before, day of)
- [ ] Phase-by-phase facilitation notes
- [ ] Key questions and coaching tips per phase
- [ ] Warning signs and interventions

### Task 3.2: Cross-Testing Protocol
- [ ] Document Team A ↔ Team B testing swap
- [ ] Feedback format: 2 positives, 1 improvement
- [ ] New test case addition process

### Task 3.3: Troubleshooting Guide
- [ ] Rate limit solutions
- [ ] YAML syntax errors
- [ ] API timeout handling
- [ ] Tests always pass/fail debugging

### Task 3.4: Supporting Materials
- [ ] Problem framing worksheet (markdown or printable)
- [ ] Test case brainstorming template
- [ ] Demo day scoring rubric (optional)

---

## Deliverable 4: Integration & Testing

### Task 4.1: Docusaurus Integration
- [ ] Add demo page to `sidebars.ts` under Experimentation
- [ ] Add facilitator guide to sidebar
- [ ] Verify all components render correctly
- [ ] Test mobile responsiveness

### Task 4.2: End-to-End Testing
- [ ] Clone starter repo on fresh machine
- [ ] Complete full workshop flow solo (abbreviated)
- [ ] Verify: setup → RED → GREEN → REFINE cycle works
- [ ] Time each phase, note friction points

### Task 4.3: Pilot Workshop
- [ ] Schedule pilot with 2-3 teams
- [ ] Run full 3.5 hour workshop
- [ ] Collect feedback on:
  - Setup friction
  - Clarity of instructions
  - Role participation
  - Test case quality
- [ ] Document learnings

---

## Dependencies

```
Task 1.2 ──► Task 1.3 (app.py needs requirements)
Task 1.2 ──► Task 1.4 (examples need base config pattern)
Task 2.1 ──► Task 2.2 (demo page needs components)
Task 2.3 ──► Task 2.2 (demo page needs code examples)
Task 1.* ──► Task 4.2 (E2E testing needs repo complete)
Task 2.* ──► Task 4.1 (integration needs components)
Task 4.2 ──► Task 4.3 (pilot needs working materials)
```

---

## Suggested Order of Execution

### Sprint 1: Starter Repository (Foundation)
1. Task 1.1: Create GitHub repo
2. Task 1.2: Core files
3. Task 1.3: Gradio chat interface
4. Task 1.5: README documentation

### Sprint 2: Interactive Demo Page
1. Task 2.1: React components (parallel development)
2. Task 2.3: Code examples for demo
3. Task 2.2: Assemble demo page

### Sprint 3: Facilitation & Polish
1. Task 3.1-3.4: Facilitation guide
2. Task 1.4: Example use cases
3. Task 4.1: Docusaurus integration

### Sprint 4: Validation
1. Task 4.2: End-to-end testing
2. Task 4.3: Pilot workshop
3. Iterate based on feedback

---

## Acceptance Criteria

| Deliverable | Criteria |
|-------------|----------|
| **Starter Repo** | Clone → install → `promptfoo eval` shows RED in <5 min |
| **Demo Page** | Non-engineer can follow TDD cycle explanation |
| **Facilitation Guide** | New facilitator can run workshop without creator present |
| **Pilot Workshop** | All roles contribute to test suite; working chatbot produced |
