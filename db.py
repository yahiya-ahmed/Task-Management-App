from flask import Flask
from models import db

"""
Database setup and app factory.

- SQLAlchemy_DATABASE_URI -> SQLite file (tasks.db)
- db.create_all() creates tables on first run
- App factory pattern keeps config/testable startup clean
"""

def create_app():
    app = Flask(__name__)
    # SQLite is enough for a single-user, lightweight tool; swapping db only needs a URI change
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    with app.app_context():
        db.create_all()

    return app