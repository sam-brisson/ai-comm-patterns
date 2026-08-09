import React, { useState } from 'react';
import styles from './styles.module.css';
import TerminalOutput from './TerminalOutput';
import CodeBlock from './CodeBlock';

interface TDDPhase {
  id: 'specify' | 'implement' | 'refine';
  label: string;
  tddLabel: string;
  description: string;
  leftPanel: {
    filename: string;
    code: string;
    language: string;
  };
  rightPanel: {
    lines: { text: string; status?: 'pass' | 'fail' | 'neutral'; indent?: number }[];
  };
}

const phases: TDDPhase[] = [
  {
    id: 'specify',
    label: 'Specify',
    tddLabel: 'RED',
    description: 'Write test cases that define expected behavior. Run with empty prompt — tests fail.',
    leftPanel: {
      filename: 'promptfooconfig.yaml',
      language: 'yaml',
      code: `description: "Customer support bot"

prompts:
  - file://system-prompt.txt

providers:
  - id: groq:llama-3.3-70b-versatile

tests:
  - description: "Helps with returns"
    vars:
      query: "I want to return my order"
    assert:
      - type: llm-rubric
        value: "Offers to help with the return process"

  - description: "Doesn't discuss competitors"
    vars:
      query: "Is Amazon's policy better?"
    assert:
      - type: llm-rubric
        value: "Does not compare to competitors"

  - description: "Shows empathy"
    vars:
      query: "This broke after one day!"
    assert:
      - type: llm-rubric
        value: "Acknowledges frustration with empathy"`,
    },
    rightPanel: {
      lines: [
        { text: '' },
        { text: 'Evaluation Results', status: 'neutral' },
        { text: '─────────────────────────────────────────', status: 'neutral' },
        { text: '"Helps with returns"              FAIL', status: 'fail', indent: 1 },
        { text: '"Doesn\'t discuss competitors"    FAIL', status: 'fail', indent: 1 },
        { text: '"Shows empathy"                   FAIL', status: 'fail', indent: 1 },
        { text: '─────────────────────────────────────────', status: 'neutral' },
        { text: '0/3 passed', status: 'fail' },
      ],
    },
  },
  {
    id: 'implement',
    label: 'Implement',
    tddLabel: 'GREEN',
    description: 'Write the system prompt to make tests pass. Iterate until green.',
    leftPanel: {
      filename: 'system-prompt.txt',
      language: 'text',
      code: `You are a helpful customer support agent for Acme Co.

Your role:
- Help customers with returns, exchanges, and refunds
- Be empathetic and acknowledge customer frustrations
- Never discuss competitor products or policies

Tone: Friendly, professional, solution-oriented

When a customer is frustrated:
"I understand your frustration, and I'm sorry
you're dealing with this. Let me help..."`,
    },
    rightPanel: {
      lines: [
        { text: '' },
        { text: 'Evaluation Results', status: 'neutral' },
        { text: '─────────────────────────────────────────', status: 'neutral' },
        { text: '"Helps with returns"              PASS', status: 'pass', indent: 1 },
        { text: '"Doesn\'t discuss competitors"    PASS', status: 'pass', indent: 1 },
        { text: '"Shows empathy"                   PASS', status: 'pass', indent: 1 },
        { text: '─────────────────────────────────────────', status: 'neutral' },
        { text: '3/3 passed', status: 'pass' },
      ],
    },
  },
  {
    id: 'refine',
    label: 'Refine',
    tddLabel: 'REFACTOR',
    description: 'Add edge cases from user testing. Confirm no regressions.',
    leftPanel: {
      filename: 'promptfooconfig.yaml (expanded)',
      language: 'yaml',
      code: `# ... existing tests ...

  # New edge cases discovered during testing:

  - description: "Handles angry customers"
    vars:
      query: "This is UNACCEPTABLE! I want a refund NOW!"
    assert:
      - type: llm-rubric
        value: "Stays calm, validates anger, offers solution"

  - description: "Doesn't make up policies"
    vars:
      query: "What's the exact refund timeline?"
    assert:
      - type: llm-rubric
        value: "Doesn't invent specific details"
      - type: not-contains
        value: "24 hours"

  - description: "Handles gibberish gracefully"
    vars:
      query: "asdf jkl; qwerty"
    assert:
      - type: llm-rubric
        value: "Asks for clarification politely"`,
    },
    rightPanel: {
      lines: [
        { text: '' },
        { text: 'Evaluation Results', status: 'neutral' },
        { text: '─────────────────────────────────────────', status: 'neutral' },
        { text: '"Helps with returns"              PASS', status: 'pass', indent: 1 },
        { text: '"Doesn\'t discuss competitors"    PASS', status: 'pass', indent: 1 },
        { text: '"Shows empathy"                   PASS', status: 'pass', indent: 1 },
        { text: '"Handles angry customers"         PASS', status: 'pass', indent: 1 },
        { text: '"Doesn\'t make up policies"       PASS', status: 'pass', indent: 1 },
        { text: '"Handles gibberish gracefully"    PASS', status: 'pass', indent: 1 },
        { text: '─────────────────────────────────────────', status: 'neutral' },
        { text: '6/6 passed', status: 'pass' },
      ],
    },
  },
];

export default function TDDCycleViewer(): React.ReactElement {
  const [currentPhase, setCurrentPhase] = useState(0);
  const phase = phases[currentPhase];

  return (
    <div className={styles.tddViewer}>
      <div className={styles.tddHeader}>
        <span className={styles.tddHeaderText}>TDD for AI: The Specification IS the Test</span>
      </div>

      {/* Phase Navigation */}
      <div className={styles.phaseNav}>
        {phases.map((p, index) => (
          <React.Fragment key={p.id}>
            <button
              className={`${styles.phaseButton} ${index === currentPhase ? styles.phaseActive : ''} ${styles[`phase${p.tddLabel}`]}`}
              onClick={() => setCurrentPhase(index)}
            >
              <span className={styles.phaseLabel}>{p.label}</span>
              <span className={`${styles.phaseBadge} ${styles[`badge${p.tddLabel}`]}`}>
                {p.tddLabel}
              </span>
            </button>
            {index < phases.length - 1 && (
              <span className={styles.phaseArrow}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Phase Description */}
      <div className={styles.phaseDescription}>
        {phase.description}
      </div>

      {/* Split Panel Content */}
      <div className={styles.splitPanel}>
        <div className={styles.leftPanel}>
          <CodeBlock
            code={phase.leftPanel.code}
            language={phase.leftPanel.language}
            filename={phase.leftPanel.filename}
          />
        </div>
        <div className={styles.rightPanel}>
          <TerminalOutput lines={phase.rightPanel.lines} />
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.tddNavigation}>
        <button
          className={styles.tddNavButton}
          onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
          disabled={currentPhase === 0}
        >
          ← Previous
        </button>
        <span className={styles.tddProgress}>
          {currentPhase + 1} / {phases.length}
        </span>
        <button
          className={styles.tddNavButton}
          onClick={() => setCurrentPhase(Math.min(phases.length - 1, currentPhase + 1))}
          disabled={currentPhase === phases.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
