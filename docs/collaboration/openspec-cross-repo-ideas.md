---
sidebar_position: 15
title: OpenSpec - Cross Repo Ideas
---

# OpenSpec - Cross Repo Ideas

Ideas for connecting OpenSpec workflows to implementation in separate product repositories.

## The Vision

OpenSpec manages **what** and **why** in a knowledge repo, while the actual implementation happens in product repos with full codebase context.

```
OpenSpec Repo (knowledge-site)          Product Repo (the-actual-app)
┌─────────────────────────────┐         ┌─────────────────────────────┐
│ Change: add-user-auth       │         │                             │
│ Status: designed            │         │                             │
│ design.md, tasks.md         │────────▶│ Agent receives trigger      │
│                             │         │ Reads design/tasks          │
│ [Apply Design clicked]      │         │ Implements with full context│
│                             │         │ Creates PR                  │
└─────────────────────────────┘         └─────────────────────────────┘
```

## Approach 1: Repository Dispatch Trigger

When "Apply Design" is clicked on the board, send a `repository_dispatch` event to the product repo.

```yaml
# In OpenSpec repo workflow
- name: Trigger implementation in product repo
  uses: peter-evans/repository-dispatch@v2
  with:
    token: ${{ secrets.PRODUCT_REPO_PAT }}
    repository: org/the-actual-app
    event-type: openspec-apply
    client-payload: |
      {
        "change": "add-user-auth",
        "design_url": "https://raw.githubusercontent.com/.../design.md",
        "tasks_url": "https://raw.githubusercontent.com/.../tasks.md"
      }
```

The product repo receives this and can:
- Fetch the design artifacts
- Run an agent (Claude Code) with full local context
- Create a PR with the implementation

## Approach 2: Agent in Product Repo

A workflow in the product repo that:
1. Receives the dispatch event
2. Fetches design/tasks from OpenSpec repo
3. Runs Claude Code with full codebase context
4. Creates a PR for review

```yaml
# In product repo
on:
  repository_dispatch:
    types: [openspec-apply]

jobs:
  implement:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Fetch design artifacts
        run: |
          curl -o design.md ${{ github.event.client_payload.design_url }}
          curl -o tasks.md ${{ github.event.client_payload.tasks_url }}

      - name: Run Claude Code agent
        run: |
          # Claude Code with full repo context
          claude-code --prompt "Implement this design: $(cat design.md)"
```

### Why This Works Better

The agent in the product repo has:
- Full codebase access
- Understanding of existing patterns and conventions
- Ability to run tests/builds to verify
- Creates a proper PR for human review

## Approach 3: Manual Handoff with Tracking

Simpler version without automation:

1. "Apply Design" creates an issue in the product repo with design/tasks content
2. Developer picks it up and implements using Claude Code locally (full context)
3. When PR is merged, they update the OpenSpec change to "applied"
4. Link to the PR is stored in the manifest

This preserves the human-in-the-loop while still tracking everything.

## Requirements for Cross-Repo

- **Authentication**: PAT or GitHub App with access to both repos
- **Claude Code in CI**: Running agents in GitHub Actions (possible with SDK)
- **Feedback loop**: Agent reports back to OpenSpec when done (updates status, links PR)

## Open Questions

- How to handle changes that span multiple product repos?
- Should the agent create draft PRs or ready-for-review PRs?
- How to sync task completion back to OpenSpec?
- What happens if implementation diverges from design?

---

*These are early ideas - to be explored as the workflow matures.*
