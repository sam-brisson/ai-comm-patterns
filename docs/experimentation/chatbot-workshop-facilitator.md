---
title: "Facilitator Guide: Chatbot Workshop"
description: "Run the TDD for AI workshop for your team"
sidebar_label: Facilitator Guide
tags: [workshop, facilitator, guide]
---

# Facilitator Guide: Chatbot Workshop

This guide helps you run the [Chatbot Workshop](/docs/experimentation/chatbot-workshop) for your team. No deep AI expertise required — the materials guide participants through the process.

---

## Pre-Workshop Checklist

### 1 Week Before

- [ ] Test API keys and verify rate limits work for your team size
- [ ] Clone starter repo and complete the full workflow yourself
- [ ] Prepare 2-3 example use cases relevant to your organization
- [ ] Schedule room with projector/screen sharing capability
- [ ] Send calendar invite with pre-requisites (Python, API key signup)

### Day Before

- [ ] Confirm participant laptops have Python 3.8+
- [ ] Pre-install dependencies on shared machines (if applicable)
- [ ] Test network connectivity to Groq API
- [ ] Prepare timer or stopwatch for phase transitions

### Day Of

- [ ] Distribute API keys OR have signup instructions ready
- [ ] Share starter repo URL prominently (whiteboard, chat, slides)
- [ ] Open this facilitation guide for reference
- [ ] Test projector/screen sharing one more time

---

## Team Formation

**Ideal team size: 3-4 people**

| Role | Primary Focus |
|------|---------------|
| **Product** | User needs, acceptance criteria, business edge cases |
| **Design** | Tone, personality, conversation flow, UX |
| **Engineering** | YAML syntax, provider config, system prompt, debugging |

**For larger groups:**
- Pair within roles (2 PMs, 2 Engineers, etc.)
- One person "drives" (types), others "navigate" (advise)

**For smaller groups (2 people):**
- One person covers PM + Design perspective
- One person covers Engineering
- Both contribute to all phases

---

## Phase-by-Phase Facilitation

### Phase 1: Discover (45 min)

**Your Role:** Help teams narrow scope and identify testable behaviors.

**Facilitator Actions:**
1. Form teams (mix roles)
2. Share example use cases if teams are stuck:
   - Customer support bot
   - New employee onboarding buddy
   - Product recommendation assistant
3. Circulate and ask probing questions

**Key Questions to Ask Teams:**
- "Who is the user? What problem are they facing?"
- "What are 3 things this chatbot MUST do well?"
- "What should it NEVER do? What guardrails?"
- "How should it sound? Formal? Casual? Empathetic?"

**Warning Signs:**
| Sign | Intervention |
|------|--------------|
| Scope creep ("It should also do X, Y, Z...") | "Pick ONE use case. You can expand later." |
| No designer input | "What tone should this have? How should it feel?" |
| Only happy paths | "What if the user is frustrated? Confused? Off-topic?" |
| Abstract descriptions | "Give me a specific example. What does the user say?" |

**Artifact Check:** Each team should have 3-5 test scenarios in plain English.

---

### Phase 2: Specify (30 min) — RED

**Your Role:** Guide YAML syntax and celebrate failures.

**Facilitator Actions:**
1. Walk through YAML syntax on projector (use starter config)
2. Show `llm-rubric` examples — describe behavior in plain English
3. Have everyone run `promptfoo eval` with empty system prompt
4. **Celebrate the red!** "Failing tests prove your specification works!"

**Live Demo Script:**
```bash
# Show the starter config
cat promptfooconfig.yaml

# Run with empty prompt
promptfoo eval

# Point out: "See? All red. That's CORRECT at this stage."
```

**Common Issues:**

| Issue | Solution |
|-------|----------|
| "What do I write for the rubric?" | "Describe what a good response looks like to a human reviewer." |
| YAML syntax errors | "Check indentation — 2 spaces, no tabs. Use a YAML validator." |
| Assertions too vague | "Be more specific. Not 'helpful' but 'offers to help with returns'." |
| Tests don't fail | "Your rubric might be too loose. Tighten it up." |

**Artifact Check:** Each team has `promptfooconfig.yaml` with 3+ failing tests.

---

### Phase 3: Implement (45 min) — GREEN

**Your Role:** Encourage rapid iteration and minimal prompts.

**Facilitator Actions:**
1. Remind teams: "Start simple. You can always add detail."
2. Encourage the iteration loop: edit prompt → eval → repeat
3. 15-minute check-in: "How many tests passing?"
4. 30-minute check-in: "Anyone stuck? Need a hint?"

**Coaching Tips:**

| Situation | Coaching |
|-----------|----------|
| Stuck on what to write | "What would you tell a human to do this job? Write that." |
| Over-engineering | "Start with 3 sentences. Add more only if tests fail." |
| One test won't pass | "Read the rubric again. Is the prompt missing that behavior?" |
| All tests pass immediately | "Your rubrics might be too loose. Add specificity." |

**Sample Prompt Structure to Suggest:**
```
You are a [role] for [company/context].

Your role:
- [Primary responsibility]
- [Secondary responsibility]
- [What NOT to do]

Tone: [Personality descriptors]
```

**Artifact Check:** Each team has passing tests + can run `python app.py`.

---

### Phase 4: Refine (45 min) — REFACTOR

**Your Role:** Facilitate cross-team testing and feedback.

**Cross-Testing Protocol:**

1. **Pair teams** (Team A ↔ Team B)
2. **Test each other's bots (5 min each):**
   - Try to break it — edge cases, weird inputs, off-topic requests
   - Note what worked well and what felt wrong
3. **Share feedback (3 min each):**
   - "2 things that worked well"
   - "1 thing that broke or felt off"
4. **Add new tests (10 min):**
   - Convert feedback into new test cases
   - Run eval, confirm new tests are covered
5. **Confirm no regressions:**
   - Original tests still pass

**Facilitation Notes:**
- Remind teams: "The goal isn't to embarrass — it's to find gaps."
- Encourage adding guardrails: "What if someone asks about competitors?"
- Watch for test suite growth: aim for 5+ tests per team

**Artifact Check:** Each team has expanded test suite + improved prompt.

---

### Phase 5: Demo + Reflect (30 min)

**Demo Format (3 min per team):**

1. **Show test suite running** (30 sec) — Terminal output, all green
2. **Highlight one clever test** (30 sec) — What edge case did you catch?
3. **Live chat demo** (1 min) — Interactive conversation
4. **Share one learning** (1 min) — What surprised you?

**Wrap-Up Discussion Questions:**
- "What assertion types were most useful?"
- "What was harder than expected about AI testing?"
- "How would you apply this to your real product work?"
- "What would you add with more time?"

**Capture Learnings:**
- Take notes on patterns that emerged
- Screenshot interesting test cases
- Document for your knowledge base

---

## Troubleshooting Guide

| Issue | Solution |
|-------|----------|
| **Rate limit hit** | Switch to OpenRouter backup key, or rotate between teams |
| **API timeout** | Check network; try smaller model; retry |
| **YAML parse error** | Validate at [yamlchecker.com](https://yamlchecker.com); check indentation |
| **Tests always pass** | Rubric too vague — make it more specific |
| **Tests always fail** | System prompt empty or all comments |
| **Gradio won't start** | Check `pip install -r requirements.txt` completed; check port 7860 free |
| **"Module not found"** | Activate virtual environment: `source venv/bin/activate` |

---

## Materials Checklist

**Digital:**
- [ ] Starter repo URL
- [ ] This facilitation guide
- [ ] API keys (Groq primary, OpenRouter backup)

**Physical (optional):**
- [ ] Printed test case brainstorm worksheets
- [ ] Sticky notes for team formation
- [ ] Timer/stopwatch

---

## Adapting the Workshop

### Shorter Version (2 hours)
- Combine Discover + Specify (30 min total)
- Skip cross-team testing in Refine
- Shorter demos (2 min each)

### Longer Version (Full day)
- Extended Discover with user research
- Multiple iteration cycles in Implement
- Add "Deploy" phase (Hugging Face Spaces)
- Include retrospective exercise

### Remote/Hybrid
- Use breakout rooms for team work
- Screen share for demos
- Shared document for test case brainstorming
- Slack/chat channel for troubleshooting

---

## After the Workshop

1. **Share the recording/notes** with participants
2. **Collect feedback** — What worked? What to improve?
3. **Document patterns** — Add to your organization's knowledge base
4. **Plan follow-up** — How will teams continue using TDD for AI?

---

## Resources

- [Workshop Demo Page](/docs/experimentation/chatbot-workshop) — Participant-facing materials
- [Starter Repository](https://github.com/your-org/chatbot-workshop-starter) — Code templates
- [promptfoo Documentation](https://www.promptfoo.dev/docs/) — Deep dive on testing
