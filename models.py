from flask_sqlalchemy import SQLAlchemy
import json

db = SQLAlchemy()

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    due_date = db.Column(db.String(10), nullable=True)
    category = db.Column(db.String(100), nullable=True)
    reminder_time = db.Column(db.String(20), nullable=True)
    priority = db.Column(db.String(10), nullable=True)
    is_complete = db.Column(db.Boolean, default=False)

    notes = db.Column(db.Text) # Notes for the task
    subtasks_json = db.Column(db.Text) # Subtasks as JSON string

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "due_date": self.due_date,
            "category": self.category,
            "reminder_time": self.reminder_time,
            "priority": self.priority,
            "is_complete": self.is_complete,
            "notes": self.notes or "",
            "subtasks": json.loads(self.subtasks_json) if self.subtasks_json else []
        }