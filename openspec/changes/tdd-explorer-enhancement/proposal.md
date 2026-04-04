# TDD Explorer Enhancement

## Why

The current test discovery and result viewing flow is clunky and unintuitive. Users have to navigate through multiple menus just to see their test results, and when tests fail, they must click through to console output to hunt for actual error details. This friction significantly impacts the test-driven development workflow and developer productivity.

User feedback has consistently highlighted:
- Difficulty understanding test failures without context
- Poor test organization and navigation
- Lack of quick re-run capabilities
- Need for better visual hierarchy in test suites

## What Changes

### Hierarchical Tree View
- Replace flat test list with expandable/collapsible tree structure
- Enable running individual tests or entire suites by clicking tree nodes
- Inspired by VSCode's test explorer for familiar UX patterns

### Inline Test Failure Details
- Display assertion failures directly next to test names (e.g., "expected 5, got 7")
- Include diff view for object comparisons
- Parse test framework output to extract meaningful failure information

### Jest Framework Support
- Initial implementation focuses on Jest output parsing
- Foundation for supporting additional frameworks (Mocha, Vitest) in future iterations

### Re-run Capabilities
- "Re-run failed tests" button for quick iteration
- "Run tests in this file" functionality for file-focused development
- Streamlined test execution without menu navigation

## Future Considerations

- Watch mode functionality (fast-follow feature)
- Support for additional test frameworks
- Integration with file system events for large monorepos