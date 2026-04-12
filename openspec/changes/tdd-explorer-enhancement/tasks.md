# TDD Knowledge Page Tasks

## Build the Component

- [ ] **BookingForm component**
  - [ ] Create `src/components/TDDKnowledgePage/BookingForm.tsx`
  - [ ] Start time and end time text inputs
  - [ ] Submit button with enabled/disabled states
  - [ ] `stage` prop controls behavior (Red: always enabled, Green: computed)
  - [ ] Style to look like a realistic booking form

- [ ] **CodePanel component**
  - [ ] Create `src/components/TDDKnowledgePage/CodePanel.tsx`
  - [ ] Syntax highlighting for Python (use Prism or similar)
  - [ ] Pass/fail indicator (green checkmark / red X)
  - [ ] Comment at top showing the example text

- [ ] **Main page component**
  - [ ] Create `src/components/TDDKnowledgePage/index.tsx`
  - [ ] Stage navigation tabs: [Example Mapping] [Red] [Green]
  - [ ] Stage content area with conversation panel
  - [ ] "Next" button to advance stages
  - [ ] Style matching site theme (gray-900 header, etc.)

## Write the Content

- [ ] **Stage 1: Example Mapping**
  - [ ] Card hierarchy visual (story → rule → examples)
  - [ ] PM/Engineer conversation about discovering the rule

- [ ] **Stage 2: Red**
  - [ ] Test code with "FAILS" indicator
  - [ ] PM/Engineer conversation about why test fails first

- [ ] **Stage 3: Green**
  - [ ] Same test code with "PASSES" indicator
  - [ ] PM/Engineer conversation with interactive prompt

## Ship It

- [ ] Add component to a docs page
- [ ] Test the interactive form behavior
- [ ] Show to a product person and get feedback

## Definition of Done

- [ ] All 3 stages navigable
- [ ] Form is interactive in Red (clickable) and Green (typeable)
- [ ] At least 1 product person has walked through and confirmed it's clear
