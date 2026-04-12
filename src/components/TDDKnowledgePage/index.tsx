import React, { useState } from 'react';
import styles from './styles.module.css';
import BookingForm from './BookingForm';
import CodePanel from './CodePanel';

interface Message {
  speaker: 'PM' | 'Engineer';
  text: string;
}

interface Stage {
  id: string;
  label: string;
  content: React.ReactNode;
  conversation: Message[];
}

const testCode = `def test_submit_disabled_when_times_empty():
    form = BookingForm()
    assert not form.can_submit`;

// Red stage: Buggy implementation - button is always enabled
const redImplementationCode = `class BookingForm:
    def __init__(self):
        self.start_time = ""
        self.end_time = ""

    @property
    def can_submit(self):
        return True  # Bug: always enabled!`;

// Green stage: Fixed implementation - button only enabled when both filled
const greenImplementationCode = `class BookingForm:
    def __init__(self):
        self.start_time = ""
        self.end_time = ""

    @property
    def can_submit(self):
        return bool(self.start_time and self.end_time)`;

export default function TDDKnowledgePage(): React.ReactElement {
  const [currentStage, setCurrentStage] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFormChange = (field: 'startTime' | 'endTime', value: string) => {
    if (field === 'startTime') {
      setStartTime(value);
    } else {
      setEndTime(value);
    }
    setSubmitted(false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  // Reset form state when changing stages
  const handleStageChange = (index: number) => {
    setCurrentStage(index);
    setStartTime('');
    setEndTime('');
    setSubmitted(false);
  };

  const stages: Stage[] = [
    {
      id: 'example-mapping',
      label: 'Example Mapping',
      content: (
        <div className={styles.exampleMappingLayout}>
          <div className={styles.cardHierarchy}>
            {/* Story Card */}
            <div className={styles.storyCard}>
              <span className={styles.cardLabel}>STORY</span>
              <p>"As a user, I want to book a meeting room"</p>
            </div>

            <div className={styles.cardConnector}>|</div>

            {/* Rule Card */}
            <div className={styles.ruleCard}>
              <span className={styles.cardLabel}>RULE</span>
              <p>"Can't submit without both times filled"</p>
            </div>

            <div className={styles.cardConnector}>
              <span className={styles.cardBranch}>/</span>
              <span className={styles.cardBranch}>\</span>
            </div>

            {/* Example Cards */}
            <div className={styles.exampleCards}>
              <div className={styles.exampleCard}>
                <span className={styles.cardLabel}>EXAMPLE</span>
                <p>Both empty → disabled</p>
              </div>
              <div className={styles.exampleCard}>
                <span className={styles.cardLabel}>EXAMPLE</span>
                <p>Both filled → enabled</p>
              </div>
            </div>
          </div>

          {/* Questions Area */}
          <div className={styles.questionsArea}>
            <span className={styles.questionsLabel}>Questions</span>
            <div className={styles.questionCard}>
              <span className={styles.cardLabel}>QUESTION</span>
              <p>Should the user be able to submit with just an end time?</p>
            </div>
          </div>
        </div>
      ),
      conversation: [
        {
          speaker: 'PM',
          text: "Okay, booking a meeting room. What could go wrong with this form?",
        },
        {
          speaker: 'Engineer',
          text: "Well, what if someone hits Submit before they've picked times?",
        },
        {
          speaker: 'PM',
          text: "Oh, good catch. The button should be disabled until they've filled in both start and end time.",
        },
        {
          speaker: 'Engineer',
          text: "That's a rule. Let's write it down. Now give me a specific example - what does 'disabled' look like?",
        },
        {
          speaker: 'PM',
          text: "If both fields are empty, the button is greyed out. If they've filled in both times, it lights up.",
        },
        {
          speaker: 'Engineer',
          text: "Perfect. Two examples. Each one becomes a test.",
        },
      ],
    },
    {
      id: 'red',
      label: 'Red',
      content: (
        <div className={styles.sideBySide}>
          <div className={styles.formSide}>
            <BookingForm
              startTime=""
              endTime=""
              stage="red"
              onSubmit={handleSubmit}
            />
            {submitted && (
              <div className={styles.submittedMessage}>
                Submitted! But it shouldn't have...
              </div>
            )}
          </div>
          <div className={styles.codeSide}>
            <CodePanel
              code={redImplementationCode}
              status="fail"
              comment="Bug: can_submit always returns True"
            />
          </div>
        </div>
      ),
      conversation: [
        {
          speaker: 'Engineer',
          text: "Here's your example as a test. It says: when both fields are empty, the form can't submit.",
        },
        {
          speaker: 'PM',
          text: "Okay... but the test is failing?",
        },
        {
          speaker: 'Engineer',
          text: "Right - that's the point. Try clicking Submit on that form. It works, but it shouldn't.",
        },
        {
          speaker: 'PM',
          text: "Oh! So the test catches the bug.",
        },
        {
          speaker: 'Engineer',
          text: "Exactly. We write the test first. It fails because the bug exists. Now we fix it.",
        },
      ],
    },
    {
      id: 'green',
      label: 'Green',
      content: (
        <div className={styles.sideBySide}>
          <div className={styles.formSide}>
            <BookingForm
              startTime={startTime}
              endTime={endTime}
              stage="green"
              onChange={handleFormChange}
              onSubmit={handleSubmit}
            />
            {submitted && (
              <div className={styles.submittedMessageSuccess}>
                Booking submitted!
              </div>
            )}
            <div className={styles.tryIt}>
              ↳ Try typing in both fields...
            </div>
          </div>
          <div className={styles.codeSide}>
            <CodePanel
              code={greenImplementationCode}
              status="pass"
              comment="Fixed: checks both fields are filled"
            />
          </div>
        </div>
      ),
      conversation: [
        {
          speaker: 'Engineer',
          text: "Same test, but now it passes. The button is disabled when the fields are empty.",
        },
        {
          speaker: 'PM',
          text: "And if I fill in the times...?",
        },
        {
          speaker: 'Engineer',
          text: "Try it.",
        },
        {
          speaker: 'PM',
          text: "The button lit up!",
        },
        {
          speaker: 'Engineer',
          text: "That's your rule, working in real software. And we have a test that makes sure it stays that way.",
        },
      ],
    },
  ];

  const stage = stages[currentStage];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerText}>TDD: From Example Mapping to Working Code</span>
      </div>

      {/* Stage Navigation */}
      <div className={styles.stageNav}>
        {stages.map((s, index) => (
          <React.Fragment key={s.id}>
            <button
              className={`${styles.stageButton} ${index === currentStage ? styles.stageActive : ''}`}
              onClick={() => handleStageChange(index)}
            >
              {s.label}
            </button>
            {index < stages.length - 1 && (
              <span className={styles.stageArrow}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {stage.content}
      </div>

      {/* Conversation */}
      <div className={styles.conversationArea}>
        <div className={styles.conversation}>
          {stage.conversation.map((msg, index) => (
            <div
              key={index}
              className={`${styles.message} ${msg.speaker === 'PM' ? styles.pmMessage : styles.engineerMessage}`}
            >
              <span className={styles.speaker}>{msg.speaker === 'PM' ? 'Product Manager' : 'Engineer'}</span>
              <p className={styles.messageText}>{msg.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button
          className={styles.navButton}
          onClick={() => handleStageChange(Math.max(0, currentStage - 1))}
          disabled={currentStage === 0}
        >
          ← Previous
        </button>
        <span className={styles.progress}>
          {currentStage + 1} / {stages.length}
        </span>
        <button
          className={styles.navButton}
          onClick={() => handleStageChange(Math.min(stages.length - 1, currentStage + 1))}
          disabled={currentStage === stages.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
