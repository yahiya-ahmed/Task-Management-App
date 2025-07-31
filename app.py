from flask import request, jsonify
from models import db, Task
from db import create_app
from flask_cors import CORS

app = create_app()
CORS(app)

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    task = Task(
        title=data.get('title'),
        due_date=data.get('due_date'),
        category=data.get('category'),
        reminder_time=data.get('reminder_time'),
        urgency=data.get('urgency')
    )
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    data = request.json
    task.title = data.get('title', task.title)
    task.due_date = data.get('due_date', task.due_date)
    task.category = data.get('category', task.category)
    task.reminder_time = data.get('reminder_time', task.reminder_time)
    task.urgency = data.get('urgency', task.urgency)
    task.is_complete = data.get('is_complete', task.is_complete)
    db.session.commit()
    return jsonify(task.to_dict())

@app.route('/tasks/<int:task_id>/toggle', methods=['PATCH'])
def toggle_task_completion(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404

    task.is_complete = not task.is_complete
    db.session.commit()
    return jsonify(task.to_dict())

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'})

if __name__ == '__main__':
    app.run(debug=True)