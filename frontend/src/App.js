import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const API_BASE = 'http://127.0.0.1:5000';
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    due_date: '',
    category: '',
    reminder_time: '',
    urgency: ''
  });
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('none'); // 'asc' or 'desc'
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch(`${API_BASE}/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const due = new Date(formData.due_date);
    const reminder = new Date(formData.reminder_time);

    if (formData.reminder_time && reminder >= due) {
      alert("Reminder time must be before the due date.");
      return;
    }
    const url = editingTaskId
      ? `${API_BASE}/tasks/${editingTaskId}`
      : `${API_BASE}/tasks`;

    const method = editingTaskId ? 'PUT' : 'POST';
    
    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(() => {
        fetchTasks();  // refresh the task list
        setFormData({ title: '', due_date: '', category: '', reminder_time: '', urgency:'' }); // clear form
        setEditingTaskId(null); // reset editing state
      });
  };

  const toggleCompletion = (id) => {
    fetch(`${API_BASE}/tasks/${id}/toggle`, {
      method: 'PATCH'
    })
      .then(res => res.json())
      .then(() => fetchTasks()); // Refresh the task list
  };

  const deleteTask = (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => fetchTasks()); // Refresh list
  };

  const editTask = (task) => {
    setFormData({
      title: task.title,
      due_date: task.due_date,
      category: task.category,
      reminder_time: task.reminder_time
    });
    setEditingTaskId(task.id);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Task Manager</h1>

      {/* Task Creation Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label htmlFor="title" className="form-label">
            Task Title <span className="text-danger">*</span>
          </label>
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
          <label htmlFor="due_date" className="form-label">Due Date (Optional)</label>
          <input
            type="date"
            name="due_date"
            className="form-control"
            value={formData.due_date}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="category" className="form-label">Category (Optional)</label>
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
          <label htmlFor="reminder_time" className="form-label">Reminder Time (Optional)</label>
          <input
            type="datetime-local"
            name="reminder_time"
            className="form-control"
            value={formData.reminder_time}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="urgency" className="form-label">Urgency (Optional)</label>
          <select
            id="urgency"
            name="urgency"
            className="form-select"
            value={formData.urgency || ''}
            onChange={handleChange}
          >
            <option value="">Select urgency</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <button className="btn btn-primary" type="submit">Add Task</button>
      </form>
      
      <h3 className="mb-3">My Tasks</h3>
      {/* Filter Dropdown */}
      <div className="mb-3">
        <label>Filter:</label>
        <select
          className="form-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="done">Done</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Sort Dropdown */}
      <div className="mb-3">
        <label>Sort by Due Date:</label>
        <select
          className="form-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="none">None</option>
          <option value="asc">Earliest First</option>
          <option value="desc">Latest First</option>
        </select>
      </div>


      {/* Task List */}
      <ul className="list-group">
        {tasks
          .filter(task => {
            if (filter === 'done') return task.is_complete;
            if (filter === 'pending') return !task.is_complete;
            return true;
          })
          .sort((a, b) => {
            if (sortOrder === 'asc') return new Date(a.due_date) - new Date(b.due_date);
            if (sortOrder === 'desc') return new Date(b.due_date) - new Date(a.due_date);
            return 0;
          })
          .map(task => (
            <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{task.title}</strong><br />
                <small className="text-muted">
                  {task.category ? `${task.category} | ` : ''}Due: {task.due_date || '—'}
                </small>
              </div>
              <div>
                <button onClick={() => toggleCompletion(task.id)} className="btn btn-sm btn-outline-secondary me-2" title="Toggle complete">
                  <i className={`bi ${task.is_complete ? 'bi-check-square-fill' : 'bi-square'}`}></i>
                </button>
                <button onClick={() => editTask(task)} className="btn btn-sm btn-outline-warning me-2" title="Edit">
                  <i className="bi bi-pencil"></i>
                </button>
                <button onClick={() => deleteTask(task.id)} className="btn btn-sm btn-outline-danger" title="Delete">
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </li>
          ))}
      </ul>

    </div>
  );
}

export default App;