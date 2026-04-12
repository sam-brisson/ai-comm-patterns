import React from 'react';
import styles from './styles.module.css';

interface BookingFormProps {
  startTime: string;
  endTime: string;
  stage: 'red' | 'green';
  onChange?: (field: 'startTime' | 'endTime', value: string) => void;
  onSubmit?: () => void;
}

export default function BookingForm({
  startTime,
  endTime,
  stage,
  onChange,
  onSubmit,
}: BookingFormProps): React.ReactElement {
  // In Red stage: button is always enabled (the bug)
  // In Green stage: button is disabled unless both fields are filled
  const canSubmit = stage === 'red' ? true : (startTime.trim() !== '' && endTime.trim() !== '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className={styles.bookingForm}>
      <div className={styles.formHeader}>Meeting Room Booking</div>
      <form onSubmit={handleSubmit}>
        <div className={styles.formField}>
          <label htmlFor="startTime">Start Time</label>
          <input
            type="text"
            id="startTime"
            value={startTime}
            onChange={(e) => onChange?.('startTime', e.target.value)}
            placeholder={stage === 'green' ? 'e.g. 2:00 PM' : ''}
            readOnly={stage === 'red'}
            className={stage === 'red' ? styles.readOnlyInput : ''}
          />
        </div>
        <div className={styles.formField}>
          <label htmlFor="endTime">End Time</label>
          <input
            type="text"
            id="endTime"
            value={endTime}
            onChange={(e) => onChange?.('endTime', e.target.value)}
            placeholder={stage === 'green' ? 'e.g. 3:00 PM' : ''}
            readOnly={stage === 'red'}
            className={stage === 'red' ? styles.readOnlyInput : ''}
          />
        </div>
        <button
          type="submit"
          className={`${styles.submitButton} ${canSubmit ? styles.submitEnabled : styles.submitDisabled}`}
          disabled={!canSubmit}
        >
          Submit Booking
        </button>
        {stage === 'red' && (
          <div className={styles.bugIndicator}>
            ^ clickable when it shouldn't be!
          </div>
        )}
        {stage === 'green' && !canSubmit && (
          <div className={styles.fixedIndicator}>
            ^ disabled until both fields are filled
          </div>
        )}
        {stage === 'green' && canSubmit && (
          <div className={styles.enabledIndicator}>
            ^ enabled - both fields filled!
          </div>
        )}
      </form>
    </div>
  );
}
