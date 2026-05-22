import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

// The agreed Django REST API endpoint base URL.
// Ensure your Django backend is running locally on port 8000!
const API_BASE_URL = 'http://localhost:8000/api/tasks/';

/**
 * App Component
 * 
 * Concept for Beginners:
 * This is the "container" or "root" component. It holds the "single source of truth"
 * for the application state (the tasks list, loading flags, and errors). It is also
 * responsible for communicating with the external backend API. We pass state down
 * to child components (`TaskList`, `TaskForm`) as "props" and handle actions flowing
 * back up via callback functions.
 */
function App() {
  // --- React State Hooks ---
  // useState stores variables that React tracks. When these change, React automatically 
  // re-renders the UI to match the new data. No manual DOM selectors needed!
  const [tasks, setTasks] = useState([]);          // Holds the array of task objects from the API
  const [loading, setLoading] = useState(true);     // Tracks the initial GET request loading state
  const [submitting, setSubmitting] = useState(false); // Tracks POST/PUT/DELETE transaction states to prevent double-submits
  const [error, setError] = useState(null);         // Holds any error messages to show in the error banner

  // --- API Integrations ---

  /**
   * 1. GET - Fetch all tasks
   * Consumed when the component first loads on the screen.
   */
  const fetchTasks = async () => {
    // Avoid synchronous state changes on mount that can cause cascading renders.
    // Since loading starts as true and error starts as null, we proceed directly to the fetch!
    try {
      // Concept: fetch() is a built-in browser tool to make HTTP requests.
      // async/await tells JavaScript to wait for the network request to finish before continuing.
      const response = await fetch(API_BASE_URL);
      
      // If the backend returns a non-200 code (like 404 or 500), throw an error.
      if (!response.ok) {
        throw new Error(`Failed to load tasks from server (Status: ${response.status})`);
      }
      
      const data = await response.json();
      
      // Update our state with the fetched tasks array. React will re-draw the list!
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(
        'Unable to connect to the QuickTasks backend. Please ensure the Django server is running at http://localhost:8000/ and CORS is enabled.'
      );
    } finally {
      // Finally blocks run no matter if the request succeeded or failed.
      setLoading(false);
    }
  };

  /**
   * 2. POST - Create a new task
   * @param {string} title The text content of the new task
   */
  const createTask = async (title) => {
    setSubmitting(true);
    setError(null);
    try {
      // Concept: POST is the standard HTTP method used to CREATE new records.
      // We must tell the server we are sending JSON data via the 'Content-Type' header.
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          completed: false, // New tasks default to active/incomplete
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create task (Status: ${response.status})`);
      }

      const newTask = await response.json();
      
      // Concept: Dynamic State Update (No Page Reload!)
      // Instead of fetching the entire list again, we prepend the new task directly 
      // into our existing array. This makes the app feel incredibly fast!
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create the task. Please check your backend connection.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 3. PUT - Update a task's completion status
   * @param {object} task The task object to modify
   */
  const handleToggleCompleted = async (task) => {
    setError(null);
    try {
      const updatedCompleted = !task.completed;
      
      // Concept: PUT is the HTTP method to UPDATE an existing record.
      // The API contract requires targeting the specific task ID: /api/tasks/{id}/
      const response = await fetch(`${API_BASE_URL}${task.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: task.title,
          completed: updatedCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update task status (Status: ${response.status})`);
      }

      const updatedTask = await response.json();

      // Update the local state in-place by replacing only the toggled task.
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
      );
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task status. Please try again.');
    }
  };

  /**
   * 4. DELETE - Remove a task
   * @param {number} id The ID of the task to delete
   */
  const handleDeleteTask = async (id) => {
    setError(null);
    try {
      // Concept: DELETE is the HTTP method to REMOVE a record.
      const response = await fetch(`${API_BASE_URL}${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete task (Status: ${response.status})`);
      }

      // Dynamic filter: remove the deleted task from our local state array.
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete the task. Please try again.');
    }
  };

  // --- React Lifecycle Hooks ---
  // Concept: useEffect allows us to run side effects (like database fetches) when
  // a component mounts onto the page. Passing an empty array `[]` at the end ensures
  // this function runs EXACTLY ONCE when the app starts.
  //
  // Note: We wrap the fetch in a setTimeout to defer state setting to the next macro-task,
  // which prevents any synchronous cascading renders during mount and satisfies ESLint.
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="app-container">
      {/* 
        The Premium Header:
        Uses gradient typography and a micro-animated SVG logo.
      */}
      <header className="app-header-card">
        <div className="app-logo-area">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="app-logo-icon"
            width="32"
            height="32"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
            />
          </svg>
          <h1 className="app-title">QuickTasks</h1>
        </div>
        <p className="app-subtitle">
          A lightning-fast, sleek task organizer. Add, toggle, and manage your daily objectives
          connected directly to a robust Django backend.
        </p>
      </header>

      {/* 
        Error Alerts Banner:
        Displays a beautiful dismissible box if an API network action fails.
      */}
      {error && (
        <section className="error-alert-banner" role="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="error-alert-icon"
            width="22"
            height="22"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="error-alert-content">
            <h4>Connection Error</h4>
            <p>{error}</p>
          </div>
          <button
            type="button"
            className="error-dismiss-btn"
            onClick={() => setError(null)}
            title="Dismiss error"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </section>
      )}

      {/* 
        Task Creation Form:
        Passes the submission callback and submits state to lock fields during transitions.
      */}
      <section aria-label="Create Task">
        <TaskForm onSubmit={createTask} submitting={submitting} />
      </section>

      {/* 
        Task Grid & Lists:
        Renders loaders, skeletons, active lists, or empty states.
      */}
      <section aria-label="Task List">
        <TaskList
          tasks={tasks}
          onToggle={handleToggleCompleted}
          onDelete={handleDeleteTask}
          loading={loading}
        />
      </section>
    </main>
  );
}

export default App;
