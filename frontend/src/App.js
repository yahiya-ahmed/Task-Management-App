import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Filters from './components/Filters';
import { API_BASE } from './config';

// Constants

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

  // Fetch tasks from the server
  const fetchTasks = async () => {
    // Fetch tasks from the API
    const res = await fetch(`${API_BASE}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  const createTask = async () => {
    const finalCategory = formData.category === 'Other' ? customCategory.trim() : formData.category;
    const payload = { ...formData, category: finalCategory };

    if (formData.category === 'Other' && !categoryOptions.includes(finalCategory)) {
      setCategoryOptions([...categoryOptions, finalCategory]);
    }

    await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    resetForm();
    fetchTasks();
  };

  const updateTask = async () => {
    const finalCategory = formData.category === 'Other' ? customCategory.trim() : formData.category;
    const payload = { ...formData, category: finalCategory };

    if (formData.category === 'Other' && !categoryOptions.includes(finalCategory)) {
      setCategoryOptions([...categoryOptions, finalCategory]);
    }

    await fetch(`${API_BASE}/tasks/${editingTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    resetForm();
    fetchTasks();
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const toggleCompletion = async (id) => {
    await fetch(`${API_BASE}/tasks/${id}/toggle`, { method: 'PATCH' });
    fetchTasks();
  };

  // //////////
  // Helpers //
  /////////////

  // Returns visual indicators based on priority level
  const getPriorityIndicator = (priority) => {
    if (priority === 'High') return <span className="text-danger">!!!</span>;
    if (priority === 'Medium') return <span className="text-danger">!!</span>;
    if (priority === 'Low') return <span className="text-danger">!</span>;
    return '';
  };

  const resetForm = () => {
    setFormData({ title: '', due_date: '', category: '', reminder_time: '', priority: '' });
    setCustomCategory('');
    setEditingTaskId(null);
  };

  const editTask = (task) => {
    setFormData({
      title: task.title,
      due_date: task.due_date,
      category: task.category,
      reminder_time: task.reminder_time || '',
      priority: task.priority || ''
    });
    setEditingTaskId(task.id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.category === 'Other' && customCategory.trim() === '') {
      alert('Please enter a custom category.');
      return;
    }
    editingTaskId ? updateTask() : createTask();
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  ////////////
  // Render //
  ////////////
  return (
    <div className="container my-4">
      <h2 className="mb-4">Task Manager</h2>

      {/* Task Creation Form */}
      <TaskForm
        formData={formData}
        customCategory={customCategory}
        categoryOptions={categoryOptions}
        handleChange={handleChange}
        handleCustomCategoryChange={setCustomCategory}
        handleSubmit={handleSubmit}
        editingTaskId={editingTaskId}
        handleCancelEdit={handleCancelEdit}
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