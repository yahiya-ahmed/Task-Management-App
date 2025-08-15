import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Filters from './components/Filters';

// Constants
const API_BASE = 'http://127.0.0.1:5000';

function App() {
  // State: Task data and form fields
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    due_date: '',
    category: '',
    reminder_time: '',
    priority: ''
  });
  const [customCategory, setCustomCategory] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([
    "Work", "Study", "Personal"
  ]);

  // State: Filters and editing
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('none'); // 'asc' or 'desc'
  const [editingTaskId, setEditingTaskId] = useState(null);
  
  // Load tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  ///////////////////
  // API Functions //
  ///////////////////
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
    if (
      formData.category &&
      !categoryOptions.includes(formData.category) &&
      formData.category !== "Other"
    ) {
      setCategoryOptions([...categoryOptions, formData.category]);
    }

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

    let finalCategory = formData.category;
    if (formData.category === "Other" && customCategory.trim() !== "") {
      finalCategory = customCategory.trim();
      if (!categoryOptions.includes(finalCategory)) {
        setCategoryOptions([...categoryOptions, finalCategory]);
      }
    }

    const payload = {
      ...formData,
      category: finalCategory
    };
    
    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        fetchTasks();  // refresh the task list
        setFormData({ title: '', due_date: '', category: '', reminder_time: '', priority:'' }); // clear form
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

  // //////////
  // Helpers //
  /////////////
  const getPriorityIndicator = (priority) => {
    switch (priority) {
      case 'High':
        return <p1 className="text-danger">!!!</p1>;
      case 'Medium':
        return <p1 className="text-danger">!!</p1>;
      case 'Low':
        return <p1 className="text-danger">!</p1>;
      default:
        return '';
    }
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
      reminder_time: task.reminder_time,
      priority: task.priority
    });
    setEditingTaskId(task.id);
  };

  ////////////
  // Render //
  ////////////
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Task Manager</h1>

      {/* Task Creation Form */}
      <TaskForm
        formData={formData}
        customCategory={customCategory}
        categoryOptions={categoryOptions}
        handleChange={handleChange}
        handleCustomCategoryChange={setCustomCategory}
        handleSubmit={handleSubmit}
        editingTaskId={editingTaskId}      
      />

      <h3 className="mb-3">My Tasks</h3>

      {/* Filter Dropdown */}
      <Filters
        filter={filter}
        categoryFilter={categoryFilter}
        setFilter={setFilter}
        setCategoryFilter={setCategoryFilter}
        categoryOptions={categoryOptions}
      />

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
      <TaskList
        tasks={tasks}
        filter={filter}
        categoryFilter={categoryFilter}
        sortOrder={sortOrder}
        toggleCompletion={toggleCompletion}
        editTask={editTask}
        deleteTask={deleteTask}
        getPriorityIndicator={getPriorityIndicator}
      />
    </div>
  );
}

export default App;