from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    due_date = db.Column(db.String(50), nullable=True)
    is_complete = db.Column(db.Boolean, default=False)
    category = db.Column(db.String(100), nullable=True)
    reminder_time = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "due_date": self.due_date,
            "is_complete": self.is_complete,
            "category": self.category,
            "reminder_time": self.reminder_time
        }