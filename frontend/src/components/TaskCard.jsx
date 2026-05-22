// Reusable TaskCard component representing an individual task item.

/**
 * TaskCard Component
 * 
 * Concept for Beginners:
 * This is a "presentational" or "stateless" component. It doesn't fetch its own data
 * or manage global state. Instead, it receives data (the `task` object) and behaviors
 * (the `onToggle` and `onDelete` functions) from its parent component via "props" (properties).
 * This makes the component highly reusable and easy to test!
 */
export default function TaskCard({ task, onToggle, onDelete }) {
  // Destructure properties from our task object to keep the code clean and readable.
  const { id, title, completed, created_at } = task;

  // Format the ISO timestamp into a beautiful, human-readable date and time.
  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    try {
      const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return 'Recent task';
    }
  };

  return (
    <div className={`task-card ${completed ? 'completed' : ''}`}>
      {/* 
        The Checkbox Container:
        Using a standard label and input allows for simple, semantic layout and 
        accessible keyboard controls (clicking the text toggles the input!).
      */}
      <label className="task-checkbox-container" htmlFor={`task-check-${id}`}>
        <input
          id={`task-check-${id}`}
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(task)}
          className="task-checkbox"
          aria-label={`Mark "${title}" as ${completed ? 'incomplete' : 'complete'}`}
        />
        {/* Custom checkmark design element for glassmorphic checkboxes */}
        <span className="custom-checkmark"></span>
      </label>

      {/* 
        Task Details Section:
        Displays the dynamic task title and its formatted creation timestamp.
      */}
      <div className="task-details">
        <span className="task-title" title={title}>
          {title}
        </span>
        <span className="task-date">
          {formatDate(created_at)}
        </span>
      </div>

      {/* 
        Delete Button:
        Fires the onDelete handler passed from parent state management.
        Utilizes a precise, lightweight SVG path for a modern garbage bin icon.
      */}
      <button
        type="button"
        className="delete-button"
        onClick={() => onDelete(id)}
        title="Delete task"
        aria-label={`Delete task "${title}"`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="delete-icon"
          width="20"
          height="20"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
