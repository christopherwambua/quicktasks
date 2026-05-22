import { useState } from 'react';

/**
 * TaskForm Component
 * 
 * Concept for Beginners:
 * This component utilizes "local state" (`useState`) to manage the current text
 * in the input box. Because this text only matters to the form while typing, we keep
 * it localized. Once the user submits, we pass this value to the parent's handler
 * (via the `onSubmit` prop) to communicate with the Django API backend and update
 * the global tasks state.
 */
export default function TaskForm({ onSubmit, submitting }) {
  const [title, setTitle] = useState('');

  // Handle the form submit event
  const handleSubmit = (e) => {
    // Concept: preventDefault() stops the browser's default behavior of reloading the page
    // when a form is submitted. In modern Single Page Apps (SPAs), we handle submission with JS!
    e.preventDefault();

    // Basic Validation: Ensure the task title is not just whitespace.
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    // Call the parent component's submit handler
    onSubmit(trimmedTitle);

    // Clear the input field for the next task
    setTitle('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          className="task-input"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
          maxLength={100}
          required
          aria-label="New task title"
        />
        
        <button 
          type="submit" 
          className="task-submit-button"
          disabled={submitting || !title.trim()}
          title="Add task"
        >
          {submitting ? (
            // Animated loader indicator during POST requests
            <span className="button-loader" aria-hidden="true"></span>
          ) : (
            // Beautiful Plus Icon SVG inside the CTA button
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="plus-icon"
              width="20"
              height="20"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          )}
          <span>{submitting ? 'Adding...' : 'Add Task'}</span>
        </button>
      </div>
      
      {/* Dynamic input character counter for premium accessibility */}
      {title.length > 80 && (
        <span className="character-counter">
          {100 - title.length} characters left
        </span>
      )}
    </form>
  );
}
