from flask import request, jsonify
from models import db, Task
from db import create_app
from flask_cors import CORS
import json

"""
Task Manager API (Flask)

CRUD + completion toggle for tasks.
JSON in/out. SQLite via SQLAlchemy.
CORS enabled so the React client can call this during development.
"""

app = create_app()
CORS(app)
# React dev server runs on a different origin; CORS allows those browser requests.

@app.route('/tasks', methods=['GET'])
def get_tasks():
    """List all tasks as JSON (200)"""
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/tasks', methods=['POST'])
def create_task():
    """
    Create a task from JSON.
    Frontend enforces title/due_date/category.
    Backend stores and returns task (201).
    """
    # Frontend enforces required fields
    data = request.json
    task = Task(
        title=data.get('title'),
        due_date=data.get('due_date'),
        category=data.get('category'),
        reminder_time=data.get('reminder_time'),
        priority=data.get('priority'),
        notes=data.get('notes', ''),
        subtasks_json=json.dumps(data.get('subtasks', []))
    )
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Replace fields for task <id>. 404 if not found, otherwise 200 with updated task."""
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    # Frontend enforces required fields
    data = request.json

    task.title = data.get('title', task.title)
    task.due_date = data.get('due_date', task.due_date)
    task.category = data.get('category', task.category)
    task.reminder_time = data.get('reminder_time', task.reminder_time)
    task.priority = data.get('priority', task.priority)
    task.is_complete = data.get('is_complete', task.is_complete)
    task.notes = data.get('notes', task.notes)
    task.subtasks_json = json.dumps(data.get('subtasks', json.loads(task.subtasks_json or '[]')))

    db.session.commit()
    return jsonify(task.to_dict())

@app.route('/tasks/<int:task_id>/toggle', methods=['PATCH'])
def toggle_task_completion(task_id):
    """Flip is_complete for task <id>. 404 if not found, otherwise returns updated JSON (200)"""
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404

    task.is_complete = not task.is_complete
    db.session.commit()
    return jsonify(task.to_dict())

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete task <task_id>. 404 if not found, otherwise returns confirmation JSON (200)"""
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
    # Dev server on port 5001 (React typically on 3000). CORS handles cross-origin during dev.
    
    # For external access
    # app.run(host='0.0.0.0', port=5001, debug=True)