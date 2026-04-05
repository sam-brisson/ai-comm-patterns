# Team Discussion: TDD Knowledge Page with Pytest and Example Mapping

**Date:** April 5, 2026
**Participants:** Larry (Engineer), Curly (Engineer), Moe (Engineer)

---

**Larry:** Alright team, let's do a quick retro on the OpenSpec demo we shipped. How are we feeling about it?

**Curly:** Honestly, it turned out great. The interactive component where people can click through the stages and see the conversations — that really landed. We've had a bunch of people reach out saying it finally made the OpenSpec workflow click for them.

**Moe:** Yeah, the artifact viewer was clutch too. Being able to see the actual proposal, design, and tasks files alongside the conversations made it tangible instead of abstract.

**Curly:** I think the self-referential angle helped — the fact that we built the demo using OpenSpec, so people could see the demo AND inspect the specs that produced it. That was a nice touch.

**Larry:** That's great feedback. So here's what I'm thinking — we've been talking about standardizing our TDD practices across the team, and I wonder if we should do something similar. An interactive knowledge page that explains how we do TDD.

**Curly:** Oh, like the OpenSpec explainer but for our testing workflow?

**Larry:** Exactly. We've got the TDD Explorer Enhancement change in flight, but the bigger picture is getting everyone aligned on how we approach test-driven development. A knowledge page could help with that.

**Moe:** That makes sense. But wait — the current TDD Explorer proposal is all about Jest integration. We're a Python shop. Should we really be standardizing on Jest?

**Curly:** That's a good point. I think the Jest focus came from the original VSCode extension use case, but if we're building something to help OUR team standardize, we should use what we actually use.

**Larry:** Which is Pytest.

**Moe:** Right. Pytest is what we use for basically everything. The fixture system, the parameterized tests, the plugin ecosystem — it's all stuff we're already invested in.

**Curly:** So should we pivot the TDD Explorer Enhancement to focus on Pytest instead of Jest?

**Larry:** I think so. The core concepts are the same — hierarchical test views, inline failure details, re-run capabilities. But the framework integration should match our actual stack.

**Moe:** That actually simplifies things in some ways. Pytest's output is pretty well structured. And we've got all the institutional knowledge in-house already.

**Curly:** Plus, if we're building a knowledge page to explain our TDD process, it makes way more sense if the examples are in Pytest. We can show real patterns from our codebase.

**Larry:** Okay, so two decisions emerging here: switch from Jest to Pytest for the TDD Explorer, and build an interactive knowledge page to document our TDD practices. What should that knowledge page cover?

**Curly:** The basics — red-green-refactor, but with our specific patterns. How we structure test files, naming conventions, fixture usage.

**Moe:** And how we use Pytest specifically. Like, when to use parametrize, how we organize conftest files, our approach to mocking.

**Curly:** What about the collaboration side? Like, how does TDD fit into our refinement process? When do we write tests — before coding, during design, after?

**Larry:** That's actually a great question. We've never really formalized that. Different people probably do it differently.

**Moe:** Maybe we should workshop that. Get the team aligned on when and how TDD fits into our workflow.

**Curly:** Have you guys heard of Matt Wynn's Example Mapping workshop format?

**Larry:** I've seen it mentioned. What's the idea?

**Curly:** So it's a structured collaboration technique. You take a user story and map out examples before you write any code. You use colored cards — yellow for rules, green for examples, red for questions, blue for the story itself.

**Moe:** Oh right, it's like a discovery session but specifically designed to surface edge cases and acceptance criteria through concrete examples.

**Curly:** Exactly. And the examples you generate become your test cases. So it's like TDD but starting even earlier — at the story level, with the whole team.

**Larry:** So instead of the engineer going off and writing tests alone, the PM, engineer, and maybe QA all workshop the examples together?

**Curly:** Right. The three amigos approach. You end up with shared understanding of what the feature should do, documented as executable examples.

**Larry:** I like that. It's structured collaboration that produces test cases as an output. Very aligned with what we're trying to do with OpenSpec — making the conversation produce artifacts.

**Moe:** So for our TDD knowledge page, we could structure it around Example Mapping as the collaboration model. Show how a team takes a story, runs an Example Mapping session, and those examples become Pytest tests.

**Curly:** That's actually brilliant. Instead of just showing "here's how to write a Pytest test," we show "here's how the team collaborates to discover what tests to write."

**Larry:** And we can use the same interactive component pattern from the OpenSpec demo. Step through the stages — story definition, example mapping session, translating to Pytest, running and refining.

**Moe:** We should include the Example Mapping artifacts too. Show what the cards look like, how rules and examples get organized, how questions get resolved.

**Curly:** And then the transition to code. Here's the rule, here's the example from the mapping session, here's the Pytest test that expresses it.

**Larry:** This is coming together. Let me summarize what we're proposing:

1. Pivot the TDD Explorer Enhancement from Jest to Pytest, since that's what our team actually uses
2. Build an interactive knowledge page — similar to the OpenSpec demo — focused on our TDD practices
3. Structure the knowledge page around Matt Wynn's Example Mapping as the collaboration model for discovering test cases
4. Show the full workflow: Story → Example Mapping → Pytest tests → Execution → Refinement

**Curly:** That's it. And the knowledge page itself becomes the documentation for how we expect TDD to work on our team.

**Moe:** New team members can go through it, see the examples, understand not just the "what" but the "how" and "why."

**Larry:** Should we update the TDD Explorer Enhancement change to reflect this? The current proposal and design are all Jest-focused.

**Curly:** Yes. Let's update the proposal to explain the pivot to Pytest and the reasoning. The design should change to Pytest output parsing. And the tasks need to reflect the new scope — including the knowledge page build.

**Moe:** What about the tree view and re-run stuff? That still applies, right?

**Larry:** Absolutely. The UX concepts are the same — hierarchical test views, inline failure details, re-run capabilities. We're just changing the framework integration from Jest to Pytest.

**Curly:** And adding the knowledge page as a new deliverable.

**Moe:** Should the knowledge page be a separate change or part of this one?

**Larry:** I think part of this one. The TDD Explorer Enhancement is really about improving how our team does TDD. The tool improvements and the knowledge page are both serving that goal.

**Curly:** Makes sense. One change, two outputs: better tooling and documented process.

**Larry:** Alright, let's get this documented. We'll update the existing TDD Explorer Enhancement artifacts to reflect:

- Framework switch: Jest → Pytest
- New capability: Interactive TDD knowledge page
- Collaboration model: Example Mapping workshop structure
- Goal: Standardize TDD practices across the team using Pytest

**Moe:** I'll take a first pass at the design updates. The Pytest output parsing is going to be different from Jest — need to research the exact formats.

**Curly:** I can draft the knowledge page component structure. We can reuse a lot of the OpenSpec demo patterns.

**Larry:** I'll update the tasks breakdown. Some of the Jest-specific stuff goes away, but we're adding the knowledge page work.

**Moe:** Perfect. Let's reconvene tomorrow to review the updated artifacts. Good session everyone.

---

## Key Decisions

1. **Framework Switch:** Pivot from Jest to Pytest for the TDD Explorer, reflecting the team's actual Python-focused stack
2. **Knowledge Page:** Build an interactive explanation page for TDD practices, modeled after the successful OpenSpec demo
3. **Collaboration Model:** Use Matt Wynn's Example Mapping as the structured workshop format for discovering test cases
4. **Unified Change:** Keep the tooling improvements and knowledge page as part of the same TDD Explorer Enhancement change

## Action Items

- [ ] Update proposal.md with Pytest focus and knowledge page scope
- [ ] Update design.md with Pytest output parsing and knowledge page architecture
- [ ] Update tasks.md to remove Jest tasks and add Pytest/knowledge page tasks
- [ ] Research Pytest output formats for assertion failure extraction
- [ ] Design knowledge page component reusing OpenSpec demo patterns
