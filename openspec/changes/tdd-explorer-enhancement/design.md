# TDD Knowledge Page Design

## Overview

An interactive documentation page that teaches TDD through a realistic booking form example. The design emphasizes visual connection between test code and user experience, with conversations that help product people see themselves in the process.

## Target User

Product person who has participated in refinement sessions but doesn't know what happens after handoff to engineering. They should leave understanding:

- "The examples I write become tests"
- "The test fails first ON PURPOSE"
- "Then they write just enough code to pass it"
- "I can see how my rule becomes real software"

## Three Stages

| Stage | PM learns... | Interactive moment |
|-------|--------------|-------------------|
| Example Mapping | "My examples become tests" | Static - read the conversation |
| Red | "The test fails because the bug exists" | Click submit (it works when it shouldn't) |
| Green | "Now it works, and the test proves it" | Fill in fields, watch button enable |

## Stage 1: Example Mapping

Cards displayed in hierarchy showing story → rule → examples. All visible at once (no animation needed), with visual hierarchy (arrows, indentation, colors) showing the relationships.

```
┌─────────────────────────────────────────────────────────────────┐
│  [Example Mapping]   [Red]   [Green]                            │
│        ↑ active                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ 📘 "As a user, I want to book a meeting room"          │  │
│   └─────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│   ┌─────────────────────────────────────────────┐              │
│   │ 📙 "Can't submit without both times filled" │              │
│   └─────────────────────────────────────────────┘              │
│                    │                   │                        │
│                    ▼                   ▼                        │
│   ┌──────────────────────┐   ┌──────────────────────┐          │
│   │ 📗 Both empty →      │   │ 📗 Both filled →     │          │
│   │    disabled          │   │    enabled           │          │
│   └──────────────────────┘   └──────────────────────┘          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   PM: "Okay, booking a meeting room. What could go wrong       │
│        with this form?"                                         │
│                                                                 │
│   Engineer: "Well, what if someone hits Submit before they've  │
│        picked times?"                                           │
│                                                                 │
│   PM: "Oh, good catch. The button should be disabled until     │
│        they've filled in both start and end time."              │
│                                                                 │
│   Engineer: "That's a rule. Let's write it down. Now give me   │
│        a specific example - what does 'disabled' look like?"    │
│                                                                 │
│   PM: "If both fields are empty, the button is greyed out.     │
│        If they've filled in both times, it lights up."          │
│                                                                 │
│   Engineer: "Perfect. Two examples. Each one becomes a test."  │
│                                                                 │
│                                          [See the First Test →] │
└─────────────────────────────────────────────────────────────────┘
```

## Stage 2: Red (The Bug Exists)

Side-by-side layout: interactive form on left, test code on right. The form has empty fields but the submit button is ENABLED (the bug). User can click it to see it works when it shouldn't.

```
┌─────────────────────────────────────────────────────────────────┐
│  [Example Mapping]   [Red]   [Green]                            │
│                        ↑ active                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────┐   ┌────────────────────────────────┐│
│  │                       │   │                                ││
│  │  Meeting Room Booking │   │  # Both empty → disabled       ││
│  │  ━━━━━━━━━━━━━━━━━━━ │   │                                ││
│  │                       │   │  def test_submit_disabled():   ││
│  │  Start: [          ]  │   │      form = BookingForm()      ││
│  │  End:   [          ]  │   │      assert not form.can_submit││
│  │                       │   │                                ││
│  │  [ Submit Booking ]   │   │  ❌ FAILS                      ││
│  │         ↑             │   │                                ││
│  │    clickable (bug!)   │   │                                ││
│  │                       │   │                                ││
│  └───────────────────────┘   └────────────────────────────────┘│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Engineer: "Here's your example as a test. It says: when      │
│        both fields are empty, the form can't submit."           │
│                                                                 │
│   PM: "Okay... but the test is failing?"                        │
│                                                                 │
│   Engineer: "Right - that's the point. Try clicking Submit     │
│        on that form. It works, but it shouldn't."               │
│                                                                 │
│   PM: "Oh! So the test catches the bug."                        │
│                                                                 │
│   Engineer: "Exactly. We write the test first. It fails        │
│        because the bug exists. Now we fix it."                  │
│                                                                 │
│                                              [See the Fix →]    │
└─────────────────────────────────────────────────────────────────┘
```

## Stage 3: Green (The Fix)

Same layout, but now the submit button is DISABLED when fields are empty. User can type in both fields and watch the button become enabled. This is the "aha" moment.

```
┌─────────────────────────────────────────────────────────────────┐
│  [Example Mapping]   [Red]   [Green]                            │
│                               ↑ active                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────┐   ┌────────────────────────────────┐│
│  │                       │   │                                ││
│  │  Meeting Room Booking │   │  # Both empty → disabled       ││
│  │  ━━━━━━━━━━━━━━━━━━━ │   │                                ││
│  │                       │   │  def test_submit_disabled():   ││
│  │  Start: [          ]  │   │      form = BookingForm()      ││
│  │  End:   [          ]  │   │      assert not form.can_submit││
│  │                       │   │                                ││
│  │  [ Submit Booking ]   │   │  ✅ PASSES                     ││
│  │         ↑             │   │                                ││
│  │    disabled (fixed!)  │   │                                ││
│  │                       │   │                                ││
│  └───────────────────────┘   └────────────────────────────────┘│
│                                                                 │
│       ↳ Try typing in both fields...                           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Engineer: "Same test, but now it passes. The button is       │
│        disabled when the fields are empty."                     │
│                                                                 │
│   PM: "And if I fill in the times...?"                          │
│                                                                 │
│   Engineer: "Try it."                                           │
│                                                                 │
│   PM: [types in start and end time]                             │
│                                                                 │
│   PM: "The button lit up!"                                      │
│                                                                 │
│   Engineer: "That's your rule, working in real software.       │
│        And we have a test that makes sure it stays that way."  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Structure

```
TDDKnowledgePage/
├── index.tsx              # Main component, stage navigation
├── styles.module.css      # Styling
├── BookingForm.tsx        # Interactive form component
│   props: {
│     startTime: string
│     endTime: string
│     canSubmit: boolean      # false in Red, computed in Green
│     onChange: (field, value) => void
│     stage: 'red' | 'green'  # controls validation behavior
│   }
└── CodePanel.tsx          # Syntax-highlighted code
    props: {
      code: string
      status: 'pass' | 'fail'
    }
```

## BookingForm Behavior

| Stage | Start | End | Button | On Click |
|-------|-------|-----|--------|----------|
| Red | empty | empty | enabled (bug) | Shows "submitted" feedback |
| Green | empty | empty | disabled | Nothing (can't click) |
| Green | filled | empty | disabled | Nothing |
| Green | empty | filled | disabled | Nothing |
| Green | filled | filled | enabled | Shows "submitted" feedback |

The form in Green stage has real React state - user types, button reacts.

## Visual Design

### Card Colors (Example Mapping)
- Story: Blue background (#3B82F6)
- Rule: Orange/amber background (#F59E0B)
- Example: Green background (#10B981)

### Form Styling
- Clean, minimal booking form aesthetic
- Clear disabled state (greyed out button, reduced opacity)
- Clear enabled state (primary color button)
- Subtle focus states on inputs

### Code Panel
- Syntax highlighting for Python
- Pass/fail indicator (green checkmark / red X)
- Comment at top linking back to the example card text

### Stage Navigation
- Horizontal tabs: [Example Mapping] [Red] [Green]
- Active state clearly indicated
- "Next" button at bottom of each stage

## Content Hardcoded

Following the OpenSpecDemo pattern, all stage content (conversations, code examples) is hardcoded in the component. This keeps it simple and self-contained.

## Not In Scope (v1)

- URL routing for deep links to stages
- Refactor stage (Red → Green is the core lesson)
- Multiple rules/examples (one rule is enough to teach)
- Animation on card hierarchy (static is fine)
- Copy code button (nice-to-have for later)
