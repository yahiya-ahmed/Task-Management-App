import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/tasks')
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  return (
    <div className="container mt-4">
      <h1>My Tasks</h1>
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