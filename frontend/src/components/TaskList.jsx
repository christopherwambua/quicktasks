import TaskCard from './TaskCard';

/**
 * TaskList Component
 * 
 * Concept for Beginners:
 * This component acts as a layout container. It takes a list of task objects
 * (via the `tasks` prop) and renders a `TaskCard` for each one.
 * In React, we use the `.map()` array method to dynamically generate elements.
 * 
 * Note on Keys: Whenever we render lists in React, we MUST assign a unique `key` prop
 * (like `task.id`) to the outermost element in our map. This helps React's virtual DOM
 * track which items have changed, been added, or been removed, making UI updates blazing fast!
 */
export default function TaskList({ tasks, onToggle, onDelete, loading }) {
  // If we are currently loading the initial payload, show beautiful shimmer skeletons!
  if (loading) {
    return (
      <div className="task-list-container">
        <div className="list-header-skeleton"></div>
        <div className="task-list">
          {/* Render 3 modern skeleton rows to represent upcoming tasks loading */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="task-card-skeleton">
              <div className="checkbox-skeleton"></div>
              <div className="details-skeleton">
                <div className="title-skeleton"></div>
                <div className="date-skeleton"></div>
              </div>
              <div className="action-skeleton"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate completion metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Empty State: rendered when there are no tasks in the database
  if (totalTasks === 0) {
    return (
      <div className="task-list-container">
        <div className="empty-state">
          <div className="empty-icon-wrapper">
            {/* Elegant clipboard check icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="empty-state-icon"
              width="64"
              height="64"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.3 8.39a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 3a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 3a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9 5.25h.008v.008H9V5.25z"
              />
            </svg>
          </div>
          <h3>All Caught Up!</h3>
          <p>Your task list is empty. Add a task above to stay productive and organized!</p>
        </div>
      </div>
    );
  }

  // Sorting: Let's group active tasks at the top, and completed tasks at the bottom
  const activeTasksList = tasks.filter((t) => !t.completed);
  const completedTasksList = tasks.filter((t) => t.completed);
  const sortedTasks = [...activeTasksList, ...completedTasksList];

  return (
    <div className="task-list-container">
      {/* 
        Task Completion Metric Banner:
        Displays total counts and an animated progress bar to gamify productivity!
      */}
      <div className="task-metrics">
        <div className="metric-text-row">
          <span className="metric-title">Progress Tracker</span>
          <span className="metric-stats">
            {completedTasks} of {totalTasks} tasks completed ({completionPercentage}%)
          </span>
        </div>
        <div className="progress-bar-bg" aria-hidden="true">
          <div
            className="progress-bar-fill"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* The actual list layout */}
      <div className="task-list">
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
