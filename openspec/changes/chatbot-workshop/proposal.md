# Proposal: Cross-Functional Chatbot Workshop

## Why

Organizations adopting AI tools often struggle with the gap between understanding AI capabilities conceptually and actually building with them. Product managers, engineers, and designers each bring valuable perspectives to AI product development, but rarely get hands-on experience collaborating on AI implementations together.

This workshop addresses several patterns from the AI Collab Playbook:

1. **Friction in exploration-to-artifact transition** - Teams discuss chatbot ideas but rarely prototype them
2. **Cross-functional AI literacy gap** - Engineers understand APIs while PM/Design understand user needs, but they don't build together
3. **Rapid iteration as a learning tool** - Short feedback loops accelerate understanding of LLM capabilities and constraints
4. **Test-first discipline for AI** - The specification IS the test; we write expectations before implementations

The success of interactive documentation (like the OpenSpec demo and TDD Explorer) demonstrates that learning-by-doing is more effective than passive consumption. This workshop extends that principle to AI product development, with a strong emphasis on **TDD for LLMs**: write the test (expected behavior), see it fail, implement the solution (system prompt), see it pass.

## What Changes

### Workshop: "From Concept to Conversation"

A half-day (3-4 hour) hands-on workshop where cross-functional teams go from problem statement to working chatbot prototype using free APIs and rapid iteration cycles.

### Free API Selection Rationale

After evaluating available options, these providers offer the best combination of accessibility, quality, and workshop-friendliness:

| Provider | Free Tier | Why Selected |
|----------|-----------|--------------|
| **[Groq](https://groq.com/)** | 30 req/min, Llama 3.3/4, Qwen3 | **Primary choice.** Sub-second responses enable rapid iteration. OpenAI SDK-compatible. No credit card required. |
| **[OpenRouter](https://openrouter.ai/)** | 50 req/day, 25+ models | **Backup option.** Access to multiple model families through single API. Good for comparing model behaviors. |
| **[Google Gemini](https://ai.google.dev/)** | 1,500 req/day, 1M context | **Alternative.** Most generous daily limits. Best for teams doing sustained testing. |

**Sources consulted:**
- [TokenMix: 15 Best Free LLM APIs 2026](https://tokenmix.ai/blog/free-llm-api) - Comprehensive comparison of free tiers
- [Codecademy: What is OpenRouter?](https://www.codecademy.com/article/what-is-openrouter) - Beginner-friendly explanation
- [Buldrr: OpenRouter Free API Guide](https://buldrr.com/openrouter-free-api-keys-free-models-simple-guide/) - Practical limits and tips

**Why not others:**
- OpenAI/Anthropic require credit card after trial credits
- Cohere trial keys prohibit commercial/production use
- Mistral free tier is restricted to prototyping only (which works, but has unclear terms)

### TDD Testing Framework: promptfoo

The core discipline of this workshop is **test-first AI development**. We use **[promptfoo](https://www.promptfoo.dev/)** - an open-source CLI tool for evaluating LLM outputs.

**Why promptfoo:**
- **CLI-first** - Everyone sees the same terminal output, regardless of role
- **YAML-based tests** - Non-engineers can read and write test cases
- **Instant feedback** - Red/green pass/fail visible to entire team
- **No cloud dependencies** - Runs locally, works with any LLM provider
- **23k+ GitHub stars** - Battle-tested by 350,000+ developers

**Sources:**
- [Promptfoo: Getting Started](https://www.promptfoo.dev/docs/getting-started/)
- [DataCamp: Promptfoo Tutorial](https://www.datacamp.com/tutorial/promptfoo-tutorial)
- [QASkills: LLM Prompt Testing Guide 2026](https://qaskills.sh/blog/promptfoo-llm-testing-guide)

### The TDD Cycle for AI

```
┌─────────────────────────────────────────────────────────────────┐
│  1. SPECIFY (Red)                                               │
│     Write test cases in YAML that define expected behavior      │
│     Run: promptfoo eval → See failures (no implementation yet)  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. IMPLEMENT (Green)                                           │
│     Write/refine system prompt to satisfy test cases            │
│     Run: promptfoo eval → See tests pass                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. REFINE (Refactor)                                           │
│     Add edge cases, improve prompt clarity                      │
│     Run: promptfoo eval → Confirm no regressions                │
└─────────────────────────────────────────────────────────────────┘
```

### Example: Test-First Chatbot Development

**Step 1: Define the spec as tests** (`promptfooconfig.yaml`)

```yaml
description: "Customer support bot for returns"

prompts:
  - file://system-prompt.txt

providers:
  - id: groq:llama-3.3-70b-versatile
    config:
      apiKey: ${GROQ_API_KEY}

tests:
  # Happy path - should help with returns
  - vars:
      query: "I want to return my order"
    assert:
      - type: contains
        value: "return"
      - type: llm-rubric
        value: "Response offers to help with the return process"

  # Guardrail - should not discuss competitors
  - vars:
      query: "Is Amazon's return policy better?"
    assert:
      - type: not-contains
        value: "Amazon"
      - type: llm-rubric
        value: "Politely redirects to our own policies"

  # Tone check - should be empathetic
  - vars:
      query: "This product broke after one day!"
    assert:
      - type: llm-rubric
        value: "Response acknowledges frustration and apologizes"
```

**Step 2: Run the test (RED - fails with empty prompt)**

```bash
$ promptfoo eval

┌─────────────────────────────────────────────────────────────┐
│ Evaluation Results                                          │
├─────────────────────────────────────────────────────────────┤
│ Test 1: "I want to return my order"          ❌ FAIL        │
│ Test 2: "Is Amazon's return policy better?"  ❌ FAIL        │
│ Test 3: "This product broke after one day!"  ❌ FAIL        │
└─────────────────────────────────────────────────────────────┘
```

**Step 3: Write the system prompt** (`system-prompt.txt`)

```
You are a helpful customer support agent for Acme Co.

Your role:
- Help customers with returns, exchanges, and order issues
- Be empathetic and acknowledge customer frustrations
- Never discuss competitor policies or products

Tone: Friendly, professional, solution-oriented
```

**Step 4: Run again (GREEN - tests pass)**

```bash
$ promptfoo eval

┌─────────────────────────────────────────────────────────────┐
│ Evaluation Results                                          │
├─────────────────────────────────────────────────────────────┤
│ Test 1: "I want to return my order"          ✅ PASS        │
│ Test 2: "Is Amazon's return policy better?"  ✅ PASS        │
│ Test 3: "This product broke after one day!"  ✅ PASS        │
└─────────────────────────────────────────────────────────────┘
```

### Prototyping UI Framework

Use **[Gradio](https://gradio.app/)** for the interactive chat UI:

- `gr.ChatInterface` provides a complete chat UI in <20 lines of code
- No HTML/CSS/JS knowledge required
- Built-in features: chat history, clear button, retry
- Runs locally in browser

**Sources:**
- [Gradio: Creating a Chatbot Fast](https://gradio.app/guides/creating-a-chatbot-fast)
- [Streamlit: Build Conversational Apps](https://docs.streamlit.io/develop/tutorials/chat-and-llm-apps/build-conversational-apps)

### Workshop Structure

```
Phase 1: DISCOVER (45 min)
├── Team formation (PM + Eng + Designer)
├── Problem framing: Who needs help? What conversations?
├── Define 3-5 test scenarios (happy paths + edge cases)
└── Artifact: Test case outline (plain English)

Phase 2: SPECIFY - Write the Tests (30 min)  ← TDD RED
├── Convert scenarios to promptfoo YAML assertions
├── Define guardrails and tone expectations
├── Run: promptfoo eval → See all tests FAIL
└── Artifact: promptfooconfig.yaml with failing tests

Phase 3: IMPLEMENT - Make Tests Pass (45 min)  ← TDD GREEN
├── Write system prompt to satisfy tests
├── Run: promptfoo eval → Iterate until GREEN
├── Wire up Gradio UI for interactive testing
└── Artifact: Passing tests + working chatbot v0.1

Phase 4: REFINE - Add Edge Cases (45 min)  ← TDD REFACTOR
├── Cross-team user testing reveals gaps
├── Add new test cases for discovered issues
├── Refine prompt, run eval, confirm no regressions
└── Artifact: Expanded test suite + improved v0.2

Phase 5: DEMO + REFLECT (30 min)
├── 3-min demo: Show tests + live chatbot
├── Share patterns: What assertions worked best?
└── Artifact: Learnings captured for knowledge base
```

### Role Responsibilities in TDD Cycle

| Role | Phase 2: Specify | Phase 3: Implement | Phase 4: Refine |
|------|------------------|--------------------|--------------------|
| **Product** | Define acceptance criteria as test cases | Validate outputs match intent | Add business edge cases |
| **Design** | Define tone/personality assertions | Review conversation feel | Test user experience gaps |
| **Engineering** | Write YAML syntax, configure providers | Write system prompt, run evals | Add technical guardrails |

**Key insight:** Everyone owns the tests. The YAML is readable by all roles.

**Design thinking influences:**
- [SuperDupr: Design Thinking Workshop Playbook 2026](https://superdupr.com/blog/design-thinking-workshops) - 30-45 min artifact cycles
- [Six Paths: Design Thinking Workshop Guide](https://www.sixpathsconsulting.com/design-thinking-workshop/) - Empathy-first approach

### Deliverables

1. **Interactive Demo Page** - Workshop template with embedded code examples (like TDD Explorer)
   - Step-by-step walkthrough of the TDD cycle
   - Copyable YAML and Python snippets
   - Visual representation of red/green/refactor states
2. **Starter Code Repository** - Complete project structure ready to clone:
   ```
   chatbot-workshop/
   ├── promptfooconfig.yaml    # Test configuration
   ├── system-prompt.txt       # LLM instructions (starts empty)
   ├── app.py                  # Gradio chat interface
   ├── requirements.txt        # Dependencies
   └── README.md               # Setup instructions
   ```
3. **Workshop Facilitation Guide** - Timing, materials, facilitator notes
4. **Test Case Templates** - Example assertions for common chatbot patterns

### Target Audience

- Cross-functional product teams new to building with LLMs
- Organizations exploring AI adoption
- Hackathon organizers seeking structured AI activities
- Teams wanting to reduce concept-to-prototype friction

## Success Criteria

### For All Roles
- [ ] Can explain the TDD cycle for AI: Specify → Implement → Refine
- [ ] Can read and understand promptfoo YAML test cases
- [ ] Can interpret promptfoo eval output (red/green pass/fail)
- [ ] Understands that **the specification IS the test**

### For Product
- [ ] Can translate user requirements into testable assertions
- [ ] Can define acceptance criteria in YAML format

### For Design
- [ ] Can specify tone and personality as testable criteria
- [ ] Can use `llm-rubric` assertions for subjective quality

### For Engineering
- [ ] Can configure promptfoo with different LLM providers
- [ ] Can wire up Gradio UI to the tested system prompt
- [ ] Can run the full eval cycle from command line

### Workshop Outcomes
- Teams with no prior LLM API experience produce working, tested chatbot in <4 hours
- All three roles contribute to the test suite
- At least 5 test cases per team covering happy paths, edge cases, and guardrails

## Decisions Made

| Question | Decision | Rationale |
|----------|----------|-----------|
| **Environment** | Local Python | Fewer dependencies, real-world setup experience |
| **API keys** | Shared keys (trial) | Faster start; will monitor rate limits and adjust |
| **Knowledge page** | Interactive demo | Matches TDD Explorer pattern; serves as workshop template |
| **Team size** | 3-4 people | One per role; larger groups can pair within roles |
| **Assertions** | Start with `llm-rubric` | Teaches AI-native testing; more intuitive for non-engineers than regex |

## Open Questions

1. **Rate limit contingency**: If shared Groq keys hit limits, fallback to OpenRouter or rotate keys?

2. **Pre-workshop setup**: How much local setup can we expect? Python + pip, or provide Docker container?
