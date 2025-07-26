import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    due_date: '',
    category: '',
    reminder_time: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch('http://127.0.0.1:5000/tasks')
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(() => {
        fetchTasks();  // refresh the task list
        setFormData({ title: '', due_date: '', category: '', reminder_time: '' }); // clear form
      });
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Task Manager</h1>

      {/* Task Creation Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <input
            type="text"
            name="title"
            className="form-control"
            placeholder="Task title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="date"
            name="due_date"
            className="form-control"
            value={formData.due_date}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            name="category"
            className="form-control"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <input
            type="datetime-local"
            name="reminder_time"
            className="form-control"
            value={formData.reminder_time}
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-primary" type="submit">Add Task</button>
      </form>

      {/* Task List */}
      <ul className="list-group">
        {tasks.map(task => (
          <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
            {task.title}
            <span className={task.is_complete ? "badge bg-success" : "badge bg-secondary"}>
              {task.is_complete ? "Done" : "Pending"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;