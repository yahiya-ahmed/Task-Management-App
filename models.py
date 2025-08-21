from flask_sqlalchemy import SQLAlchemy
import json

"""
SQLAlchemy data model.
Subtasks stored as JSON in a Text column (SQLite-friendly), converted to/from Python lists in (de)serialisation.
"""

db = SQLAlchemy()

class Task(db.Model):
    """
    Fields:
    - id (int, PK)
    - title (str, required; nullable=False)
    - due_date (str 'YYYY-MM-DD', optional; nullable=True)
    - category (str, optional; nullable=True)
    - reminder_time (str 'YYYY-MM-DDTHH:MM', optional)
    - priority (str, optional; stores level e.g. '1'..'3' or 'low/med/high')
    - is_complete (bool, default False)
    - notes (Text, optional)
    - subtasks_json (Text)  # JSON: [{ "name": str, "done": bool }]
    """
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
            
            # Save subtasks as text (JSON) in the database.
            # When sending back to the app, turn them into a normal Python list.
            "subtasks": json.loads(self.subtasks_json) if self.subtasks_json else []
        }