# TDD Explorer Enhancement

## Why

The current test discovery and result viewing flow is clunky and unintuitive. Users have to navigate through multiple menus just to see their test results, and when tests fail, they must click through to console output to hunt for actual error details. This friction significantly impacts the test-driven development workflow and developer productivity.

User feedback has consistently highlighted:
- Difficulty understanding test failures without context
- Poor test organization and navigation
- Lack of quick re-run capabilities
- Need for better visual hierarchy in test suites

Additionally, our team lacks standardized TDD practices and documentation. Different engineers approach test-driven development inconsistently, and we need shared understanding of how TDD fits into our refinement and development workflow. The success of our OpenSpec demo showed how interactive documentation can effectively communicate complex processes.

## What Changes

### Framework Pivot to Pytest
After team discussion, we're pivoting from Jest to Pytest integration since our team uses Python/Pytest as our primary testing stack. This aligns the tool with our actual development practices and leverages existing institutional knowledge.

### Hierarchical Tree View
- Replace flat test list with expandable/collapsible tree structure
- Enable running individual tests or entire suites by clicking tree nodes
- Inspired by VSCode's test explorer for familiar UX patterns
- Integrate with Pytest's test collection and execution model

### Inline Test Failure Details
- Display assertion failures directly next to test names (e.g., "expected 5, got 7")
- Parse Pytest output to extract assertion details, diffs, and stack traces
- Include diff visualization for complex object comparisons
- Surface fixture setup/teardown failures clearly

### Interactive TDD Knowledge Page
- Build comprehensive documentation of our team's TDD practices using interactive components
- Structure around Matt Wynn's Example Mapping collaboration model
- Show full workflow: Story → Example Mapping → Pytest tests → Execution → Refinement
- Reuse successful component patterns from OpenSpec demo
- Include colored card system (yellow=rules, green=examples, red=questions, blue=stories)
- Demonstrate transition from workshop examples to executable Pytest tests

### Team Standardization
- Document test file structure and naming conventions
- Standardize fixture usage patterns and conftest organization
- Define mocking approaches and when to use different Pytest features
- Establish when TDD fits into refinement process and story development
- Enable new team members to understand both "what" and "how" of our TDD practices

## Capabilities

### Enhanced Test Navigation
- Tree-structured test organization matching Pytest's collection hierarchy
- Quick re-run of failed tests, individual tests, or test suites
- Search and filter capabilities across test names and descriptions

### Improved Debugging Experience
- Inline display of assertion failures with context
- Diff visualization for failed comparisons
- Stack trace navigation with source code links
- Fixture dependency visualization

### Process Documentation
- Step-through Example Mapping workshop format
- Live examples of story-to-test translation
- Interactive demonstration of red-green-refactor cycle
- Best practices for Pytest feature usage (parametrize, fixtures, marks)

## Success Metrics

- Reduced time from test failure to understanding root cause
- Increased adoption of TDD practices across team members
- Standardized test structure and organization in new features
- Positive feedback on knowledge page effectiveness (similar to OpenSpec demo)
- Faster onboarding of new team members to TDD workflow