import React, { useState } from 'react';
import styles from './styles.module.css';

interface RoleNotes {
  product: string;
  design: string;
  engineering: string;
}

interface WorkshopPhase {
  number: number;
  title: string;
  duration: string;
  tddStage?: 'RED' | 'GREEN' | 'REFACTOR';
  activities: string[];
  artifact: string;
  roleNotes: RoleNotes;
}

const workshopPhases: WorkshopPhase[] = [
  {
    number: 1,
    title: 'Discover',
    duration: '45 min',
    activities: [
      'Form teams (PM + Engineer + Designer)',
      'Problem framing: Who needs help? What conversations?',
      'Define 3-5 test scenarios (happy paths + edge cases)',
      'Identify guardrails: What should the bot NEVER do?',
    ],
    artifact: 'Test case outline (plain English)',
    roleNotes: {
      product: 'Define the "what" — user needs and acceptance criteria',
      design: 'Define the "feel" — tone, personality, conversation flow',
      engineering: 'Identify constraints — rate limits, context length, guardrails',
    },
  },
  {
    number: 2,
    title: 'Specify',
    duration: '30 min',
    tddStage: 'RED',
    activities: [
      'Convert plain-English scenarios to YAML test cases',
      'Write llm-rubric assertions for each behavior',
      'Run: promptfoo eval with empty system prompt',
      'Celebrate the failures — they prove your tests work!',
    ],
    artifact: 'promptfooconfig.yaml with failing tests',
    roleNotes: {
      product: 'Translate requirements into testable assertions',
      design: 'Specify tone expectations as rubrics',
      engineering: 'Write YAML syntax, configure providers',
    },
  },
  {
    number: 3,
    title: 'Implement',
    duration: '45 min',
    tddStage: 'GREEN',
    activities: [
      'Write system prompt to satisfy tests',
      'Run: promptfoo eval — iterate until green',
      'Start simple, add detail incrementally',
      'Wire up Gradio UI for interactive testing',
    ],
    artifact: 'Passing tests + working chatbot v0.1',
    roleNotes: {
      product: 'Validate outputs match user intent',
      design: 'Review conversation feel and flow',
      engineering: 'Write system prompt, run evals, debug failures',
    },
  },
  {
    number: 4,
    title: 'Refine',
    duration: '45 min',
    tddStage: 'REFACTOR',
    activities: [
      'Cross-team user testing: try to break each other\'s bots',
      'Collect feedback: What worked? What confused users?',
      'Add new test cases for discovered issues',
      'Refine prompt, run eval, confirm no regressions',
    ],
    artifact: 'Expanded test suite + improved v0.2',
    roleNotes: {
      product: 'Add business edge cases',
      design: 'Test user experience gaps',
      engineering: 'Add technical guardrails',
    },
  },
  {
    number: 5,
    title: 'Demo + Reflect',
    duration: '30 min',
    activities: [
      '3-min demo per team: Show tests + live chatbot',
      'Share one clever test case',
      'Share one learning or surprise',
      'Group discussion: patterns, insights, next steps',
    ],
    artifact: 'Learnings captured for knowledge base',
    roleNotes: {
      product: 'Share what assertions worked best',
      design: 'Share tone/personality insights',
      engineering: 'Share technical patterns discovered',
    },
  },
];

export default function WorkshopPhaseAccordion(): React.ReactElement {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  const togglePhase = (index: number) => {
    setExpandedPhase(expandedPhase === index ? null : index);
  };

  return (
    <div className={styles.accordion}>
      {workshopPhases.map((phase, index) => (
        <div
          key={phase.number}
          className={`${styles.accordionItem} ${expandedPhase === index ? styles.expanded : ''}`}
        >
          <button
            className={styles.accordionHeader}
            onClick={() => togglePhase(index)}
          >
            <div className={styles.accordionTitle}>
              <span className={styles.phaseNumber}>{phase.number}</span>
              <span className={styles.phaseName}>{phase.title}</span>
              {phase.tddStage && (
                <span className={`${styles.tddBadge} ${styles[`tdd${phase.tddStage}`]}`}>
                  {phase.tddStage}
                </span>
              )}
            </div>
            <div className={styles.accordionMeta}>
              <span className={styles.phaseDuration}>{phase.duration}</span>
              <span className={styles.accordionChevron}>
                {expandedPhase === index ? '▼' : '▶'}
              </span>
            </div>
          </button>

          {expandedPhase === index && (
            <div className={styles.accordionContent}>
              <div className={styles.activitiesSection}>
                <h4>Activities</h4>
                <ul>
                  {phase.activities.map((activity, i) => (
                    <li key={i}>{activity}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.artifactSection}>
                <h4>Artifact</h4>
                <p className={styles.artifactText}>{phase.artifact}</p>
              </div>

              <div className={styles.rolesSection}>
                <h4>Role Focus</h4>
                <div className={styles.roleCards}>
                  <div className={styles.roleCard}>
                    <span className={styles.roleLabel}>Product</span>
                    <p>{phase.roleNotes.product}</p>
                  </div>
                  <div className={styles.roleCard}>
                    <span className={styles.roleLabel}>Design</span>
                    <p>{phase.roleNotes.design}</p>
                  </div>
                  <div className={styles.roleCard}>
                    <span className={styles.roleLabel}>Engineering</span>
                    <p>{phase.roleNotes.engineering}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
