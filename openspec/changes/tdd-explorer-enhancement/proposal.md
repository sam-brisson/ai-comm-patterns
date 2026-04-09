# TDD Knowledge Page with Example Mapping

## Why

Our team lacks standardized TDD practices. Different engineers approach test-driven development inconsistently, and new team members have no clear resource for understanding how TDD fits into our workflow. The success of our OpenSpec demo showed that interactive documentation effectively communicates complex processes — people finally "got it" when they could click through the stages and see realistic conversations.

We want to apply the same approach to TDD: an interactive knowledge page that explains how our team uses Example Mapping to discover test cases and Pytest to implement them.

Additionally, the original TDD Explorer Enhancement proposed Jest integration, but our team uses Python/Pytest. This change pivots to Pytest and focuses on the knowledge page as the primary deliverable. Test explorer tooling improvements are deferred to a future change.

## What Changes

### Interactive TDD Knowledge Page

Build an interactive explanation of our TDD workflow using a booking form as the example domain. The page demonstrates the full cycle from Example Mapping through test implementation.

**Example Domain**: Resource booking form (meeting room reservation)
- Familiar to all team members (technical and non-technical)
- Clear visual states that map to business rules
- Natural validation scenarios

**Demo Scenario**: Submit button validation
- Rule: Submit button should be disabled until both start and end time are filled
- Simple, visual, demonstrates full Red-Green-Refactor cycle

### Workflow Stages

1. **Example Mapping Workshop**
   - Static visualization of colored cards (story, rules, examples)
   - Two roles: Product Manager and Engineer
   - Focus on the submit button validation rule

2. **Red Stage - Failing Test**
   - Show booking form with submit button enabled (broken state)
   - Display Pytest test that captures expected behavior
   - Test fails, demonstrating the bug

3. **Green Stage - Passing Test**
   - Show booking form with submit button disabled (fixed state)
   - Same test now passes
   - Include minimal implementation code

4. **Refactor Stage**
   - Code cleanup examples
   - Maintain passing tests

### Technical Implementation

- Built in Docusaurus with React components
- Side-by-side layout: form visual + test code
- Interactive form component that renders different states
- Syntax-highlighted Pytest code examples
- Step-by-step navigation through the TDD cycle

### Target Audience

- Engineers new to TDD
- Product managers who participate in Example Mapping
- Mixed technical/non-technical team members
- Visual learners who need concrete examples

## Success Criteria

- Team members can explain Example Mapping process
- Engineers consistently follow Red-Green-Refactor cycle
- Reduced onboarding time for TDD practices
- Increased participation in Example Mapping sessions