import React from 'react';

export default function TaskItem({ task, toggleCompletion, editTask, deleteTask, getPriorityIndicator }) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <strong>{task.title} {getPriorityIndicator(task.priority)}</strong><br />
        <small className="text-muted">
          {task.category ? `${task.category} | ` : ''}Due: {task.due_date || '-'}
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