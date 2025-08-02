# Task Management Web App

A lightweight task management system built with Flask (backend) and React (frontend).
Designed for student productivity with CRUD features, filtering, sorting, and optional reminders.

## Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm (comes with Node.js)

## Features
- Add, update, delete, and toggle tasks
- Filter by status (Done / Pending)
- Sort tasks by due date
- React + Bootstrap frontend
- Flask + SQLite backend

## How to Run (Locally)
### Backend (Flask)
1. Navigate to root directory
2. Create and activate virtual environment:  
   ```bash
   python3 -m venv venv
   ```
   - **macOS/Linux:**  
   ```bash
   source venv/bin/activate
   ```
   - **Windows (PowerShell):**
   Make sure Execution Policy is not restricted
   ```powershell
   venv\Scripts\Activate.ps1
   ```
3. Install dependencies:  
   ```bash
   pip install -r requirements.txt
   ```
4. Run Flask server:  
   ```bash
   python app.py
   ```
   The backend will be available at `http://127.0.0.1:5000`

### Frontend (React)
1. Navigate to `/frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Start React development server:  
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`  

## Screenshots
See `Appendix A` of dissertation for full implementation screenshots.

## Author
Yahiya Ahmed
MSc Computer Science – Queen Mary University of London
