# TDD Knowledge Page Design

## Overview

An interactive documentation page that teaches TDD through a realistic booking form example. The design emphasizes visual connection between test code and user experience.

## Example Domain: Booking Form

### Why This Domain
- Universal familiarity (everyone has used booking forms)
- Clear visual states (enabled/disabled buttons, filled/empty fields)
- Natural business rules that map to test cases
- Bridges technical and non-technical understanding

### Form Structure
```
[ Meeting Room Booking ]

Start Time: [_____________]
End Time:   [_____________]

[Submit Booking] <- Focus of demo
```

### Demo Rule
**Submit button should be disabled until both start and end time are filled**

- Simple validation rule
- Visually obvious
- Clear pass/fail criteria
- Demonstrates full TDD cycle

## Page Layout

### Stage Navigation
```
[1. Example Mapping] [2. Red] [3. Green] [4. Refactor]
```

### Content Layout
```
+------------------+------------------+
|                  |                  |
|   Visual Demo    |   Code Example   |
|                  |                  |
|  [Booking Form]  |  ```python       |
|                  |  def test_...     |
|                  |  ```             |
+------------------+------------------+
|            Explanation               |
+--------------------------------------+
```

## Stage Details

### Stage 1: Example Mapping

**Visual**: Static card layout
```
[User Story Card]
"As a user, I want to book a meeting room"

[Rule Cards]
"Submit disabled without times"
"Can't book past dates"
"No overlapping bookings"

[Example Cards]
"Both fields empty -> disabled"
"Only start time -> disabled"
"Both filled -> enabled"
```

**Participants**: Product Manager + Engineer

**Content**: 
- Brief explanation of Example Mapping
- How to identify rules and examples
- Focus on the submit validation rule for the demo

### Stage 2: Red - Failing Test

**Form Visual**: 
- Empty start/end time fields
- Submit button ENABLED (bug state)
- Visual indicator that this is wrong

**Code Panel**:
```python
def test_submit_disabled_when_times_empty():
    form = BookingForm()
    assert form.submit_button.disabled == True
```

**Status**: ❌ Test Fails

**Explanation**: 
- Write test first to capture expected behavior
- Test fails because button is currently enabled
- This failure shows us what to fix

### Stage 3: Green - Passing Test

**Form Visual**:
- Same empty fields
- Submit button DISABLED (fixed state)
- Visual indicator that this is correct

**Code Panel**:
```python
# Test (same as before)
def test_submit_disabled_when_times_empty():
    form = BookingForm()
    assert form.submit_button.disabled == True

# Implementation
class BookingForm:
    @property
    def submit_button_disabled(self):
        return not (self.start_time and self.end_time)
```

**Status**: ✅ Test Passes

**Explanation**:
- Minimal code to make test pass
- Visual shows the fixed behavior
- Connection between test and user experience

### Stage 4: Refactor

**Form Visual**: Same as Stage 3 (behavior unchanged)

**Code Panel**:
```python
# Refactored implementation
class BookingForm:
    def _has_required_times(self):
        return bool(self.start_time and self.end_time)
    
    @property
    def submit_button_disabled(self):
        return not self._has_required_times()
```

**Status**: ✅ Tests Still Pass

**Explanation**:
- Improve code structure
- Tests ensure behavior unchanged
- Safe to refactor with test coverage

## Technical Implementation

### React Components

**BookingFormDemo**
```jsx
<BookingFormDemo 
  startTime=""
  endTime=""
  submitEnabled={stage === 'red'}
  highlightSubmit={true}
/>
```

**CodePanel**
```jsx
<CodePanel 
  language="python"
  code={stageCode[currentStage]}
  testStatus={testStatus[currentStage]}
/>
```

### Styling
- Form looks realistic (similar to actual booking forms)
- Clear visual states (enabled/disabled button styling)
- Syntax highlighting for code
- Responsive layout for mobile

### Interactions
- Stage navigation
- No form interaction (static demo)
- Hover states for UI elements
- Copy code functionality

## Content Strategy

### Language
- Beginner-friendly explanations
- Avoid TDD jargon without context
- Connect technical concepts to user value
- Emphasize "why" not just "how"

### Progressive Disclosure
- Start with familiar concepts (booking forms)
- Introduce TDD concepts gradually
- Build complexity through stages
- Reinforce key principles

### Accessibility
- Alt text for visual elements
- Keyboard navigation
- Screen reader friendly
- High contrast for code examples