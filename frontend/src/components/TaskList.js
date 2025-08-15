import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({
  tasks,
  filter,
  categoryFilter,
  sortOrder,
  toggleCompletion,
  editTask,
  deleteTask,
  getPriorityIndicator
}) {
  const filteredTasks = tasks
    .filter(task => {
      const statusMatch =
        filter === 'all' ||
        (filter === 'done' && task.is_complete) ||
        (filter === 'pending' && !task.is_complete);

      const categoryMatch =
        categoryFilter === 'all' || task.category === categoryFilter;

      return statusMatch && categoryMatch;
    })
    .sort((a, b) => {
      // Incomplete tasks come first
      if (a.is_complete !== b.is_complete) {
        return a.is_complete ? 1 : -1;
      }

      // Then sort by due date
      if (sortOrder === 'asc') return new Date(a.due_date) - new Date(b.due_date);
      if (sortOrder === 'desc') return new Date(b.due_date) - new Date(a.due_date);
      return 0;
    });
    
  return (
    <ul className="list-group">
      {filteredTasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          toggleCompletion={toggleCompletion}
          editTask={editTask}
          deleteTask={deleteTask}
          getPriorityIndicator={getPriorityIndicator}
        />
      ))}
    </ul>
  );
}
