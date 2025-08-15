import React from 'react';

const getDueDateStyle = (dueDate) => {
  if (!dueDate) return 'text-muted';

  const today = new Date().toISOString().split('T')[0]; // e.g. "2025-08-01"
  const due = new Date(dueDate).toISOString().split('T')[0];

  if (due < today) return 'text-danger';    // Overdue
  if (due === today) return 'text-warning'; // Due today
  return 'text-muted';                      // Upcoming
};

export default function TaskItem({ task, toggleCompletion, editTask, deleteTask, getPriorityIndicator }) {
  return (
    <li className={"list-group-item d-flex justify-content-between align-items-center"}>
      <div className={task.is_complete ? 'opacity-50' : ''}>
        <strong
          className={`d-block ${task.is_complete ? 'text-decoration-line-through text-muted' : ''}`}
        >
          {task.title}{' '} 
          <span className="text-danger">
            {getPriorityIndicator(task.priority)}
          </span>
        </strong><br />
        <small className="text-muted">
          {task.category && `${task.category} | `}
          Due:{' '}
          <span className={getDueDateStyle(task.due_date)}>
            {task.due_date || '-'}
          </span>
        </small>
      </div>
      <div>
        <button
          onClick={() => toggleCompletion(task.id)}
          className="btn btn-sm btn-outline-secondary me-2"
          title="Toggle complete"
        >
          <i className={`bi ${task.is_complete ? 'bi-check-square-fill' : 'bi-square'}`}></i>
        </button>
        <button
          onClick={() => editTask(task)}
          className="btn btn-sm btn-outline-warning me-2"
          title="Edit"
        >
          <i className="bi bi-pencil"></i>
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className="btn btn-sm btn-outline-danger"
          title="Delete"
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </li>
  );
}