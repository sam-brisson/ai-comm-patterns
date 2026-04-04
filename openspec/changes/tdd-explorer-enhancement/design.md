# TDD Explorer Enhancement Design

## Architecture Overview

The TDD Explorer enhancement introduces a hierarchical test management system with inline result display and smart re-run capabilities.

## Component Structure

### TreeViewTestExplorer
- Renders hierarchical test structure
- Handles expand/collapse state management
- Supports click-to-run for individual tests and suites
- Integrates with existing test discovery mechanisms

### InlineResultDisplay
- Parses test framework output for failure details
- Renders assertion information next to test names
- Provides diff view for object comparisons
- Supports Jest output format initially

### TestRunController
- Manages test execution for selective re-runs
- Handles "re-run failed tests" functionality
- Supports file-level test execution
- Coordinates with existing test runner integrations

## Test Framework Integration

### Jest Output Parsing
- Extract assertion failures from Jest error output
- Parse expected vs actual values
- Handle object diff scenarios
- Maintain backward compatibility with existing Jest integrations

### Error Display Format
```
✗ should calculate total correctly
  Expected: 5, Got: 7
  
✗ should match user object
  [View Diff]
```

## User Interaction Flow

1. **Test Discovery**: Automatically build tree structure from test files
2. **Test Execution**: Click on tree nodes to run specific tests/suites
3. **Result Display**: Show pass/fail status with inline failure details
4. **Re-run Options**: Quick access to re-run failed tests or current file

## Performance Considerations

- Lazy loading of test tree nodes for large test suites
- Efficient diff calculation for object comparisons
- Debounced re-run execution to prevent rapid-fire clicks