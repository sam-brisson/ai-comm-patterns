# Split-Pane Refinement View — Tasks

## Phase 1: Foundation & Layout

- [ ] **Create `RefinementSplitLayout` component skeleton**
  - New component file with a flex-row container.
  - Accepts `change: Change` and `onSubmitRefinement: (feedback: string) => Promise<void>` props.
  - Renders placeholder left/right pane divs.
  - _Acceptance: Component renders without errors; left and right areas visible._

- [ ] **Implement modal body height constraint**
  - Set modal body to `min(700px, 80vh)` or equivalent.
  - Ensure the constraint only applies when in split-pane mode (does not regress other modal modes).
  - _Acceptance: Modal body does not overflow the viewport in refinement mode._

- [ ] **Apply independent scroll to each pane**
  - Left pane: `flex: 1 1 0; overflow-y: auto`.
  - Right pane: `flex: 0 0 360px; overflow-y: auto`.
  - _Acceptance: Each pane scrolls independently; scrolling one does not affect the other._

- [ ] **Add responsive stacked layout for narrow viewports**
  - Below `800px`, stack panes vertically with `max-height: 40vh` each.
  - _Acceptance: Layout is usable on a 375px-wide viewport without horizontal scroll._

---

## Phase 2: Artifact Scroll Pane

- [ ] **Create `ArtifactScrollPane` component**
  - Accepts `artifacts: { proposal, design, tasks }` prop.
  - Renders three labeled sections in order: Proposal, Design, Tasks.
  - _Acceptance: All three sections appear in the correct order._

- [ ] **Integrate existing artifact/markdown renderer**
  - Reuse the current `ArtifactSection` (or equivalent) component for each artifact.
  - Pass the artifact string as content.
  - _Acceptance: Artifact markdown renders correctly (headings, lists, code blocks)._

- [ ] **Handle null/missing artifacts**
  - When an artifact string is `null` or empty, show a dimmed placeholder: "No [artifact type] yet".
  - _Acceptance: Placeholder displays for any missing artifact; no crash or blank space._

---

## Phase 3: Refinement Input Pane

- [ ] **Create `RefinementInputPane` component**
  - Right pane with title "Refinement Feedback".
  - `<textarea>` with local state for feedback value.
  - Submit button.
  - _Acceptance: Textarea accepts input; component renders title and button._

- [ ] **Implement submit button disabled state**
  - Disable the submit button when the textarea is empty or contains only whitespace.
  - _Acceptance: Button is disabled on empty input; enabled after typing at least one non-whitespace character._

- [ ] **Implement inline validation message**
  - Show "Feedback cannot be empty" message when user attempts to submit with no input (edge case for programmatic submit).
  - _Acceptance: Validation message visible in the appropriate scenario; disappears when user types._

- [ ] **Wire submit callback**
  - On submit button click, call `onSubmitRefinement(feedback)` with the current textarea value.
  - Show a loading state on the button while the promise is pending.
  - _Acceptance: Callback is invoked with the correct string; button shows loading indicator during async operation._

- [ ] **Preserve textarea content on API error**
  - If `onSubmitRefinement` rejects, keep the textarea value intact so the user does not lose their input.
  - _Acceptance: After a simulated API error, the textarea still contains the typed feedback._

---

## Phase 4: Modal Integration

- [ ] **Add `isRefinementMode` detection to `ChangeModal`**
  - Derive a boolean from the existing mode/status prop.
  - _Acceptance: Boolean is `true` only when the modal is opened in refinement mode._

- [ ] **Conditionally render `RefinementSplitLayout` in `ChangeModal`**
  - When `isRefinementMode` is true, render `RefinementSplitLayout` instead of the current single-column content.
  - Pass `change` and the existing refinement submit handler as props.
  - _Acceptance: Split-pane layout appears in refinement mode; existing layout unchanged in all other modes._

- [ ] **Verify existing submit handler wires correctly**
  - Confirm the `onSubmitRefinement` prop maps to the existing API call + toast + modal-close behavior.
  - No new API work required — just plumbing.
  - _Acceptance: Submitting feedback from the new pane triggers the same API call and UX flow as before._

---

## Phase 5: Tests

- [ ] **Unit test `RefinementInputPane`**
  - Renders textarea and submit button.
  - Submit button disabled when empty.
  - `onSubmitRefinement` called with correct value on submit.
  - Textarea preserved after rejected promise.
  - _Acceptance: All four cases pass._

- [ ] **Unit test `ArtifactScrollPane`**
  - Renders all three artifact sections when content is provided.
  - Renders placeholder for each null artifact.
  - _Acceptance: All cases pass._

- [ ] **Unit test `RefinementSplitLayout`**
  - Both child panes rendered.
  - Correct props forwarded to each child.
  - _Acceptance: All cases pass._

- [ ] **Integration test `ChangeModal` mode switching**
  - Refinement mode → `RefinementSplitLayout` rendered.
  - Non-refinement mode → `RefinementSplitLayout` NOT rendered.
  - _Acceptance: Both cases pass._

- [ ] **Integration test full submit flow**
  - Type feedback in textarea → click submit → `onSubmitRefinement` called with typed value.
  - _Acceptance: Test passes end-to-end._

- [ ] **Add snapshot tests**
  - Snapshot: `RefinementSplitLayout` with all artifacts populated.
  - Snapshot: `RefinementSplitLayout` with all artifacts null.
  - _Acceptance: Snapshots committed; future regressions caught._

---

## Phase 6: Polish & QA

- [ ] **Manual QA on the workflow board**
  - Open a change in refinement mode; scroll the artifact pane; verify refinement input stays visible.
  - Submit feedback; confirm existing success behavior (toast, modal close, board update).
  - _Acceptance: No regressions; UX matches the wireframe in the proposal._

- [ ] **Cross-browser check**
  - Verify independent scroll behavior in Chrome, Firefox, and Safari.
  - _Acceptance: No scroll bleed or layout breakage in any target browser._

- [ ] **Accessibility review**
  - Ensure panes have appropriate ARIA labels (`aria-label="Artifacts"`, `aria-label="Refinement feedback"`).
  - Tab order moves logically: artifact pane → textarea → submit button.
  - _Acceptance: No critical a11y violations; keyboard-only navigation works._
