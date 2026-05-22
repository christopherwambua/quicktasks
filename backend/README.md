# QuickTasks Backend

A simple Django REST API for the QuickTasks fullstack mini project. It exposes task CRUD endpoints for a React frontend.

## Tech stack

- Django
- Django REST Framework
- django-cors-headers
- SQLite

## Prerequisites

- Python 3.10+ installed
- Terminal (PowerShell, Command Prompt, or bash)

## Setup (first time)

### 1. Open the backend folder

```bash
cd backend
```

### 2. Create and activate a virtual environment

**Windows (PowerShell):**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux:**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run database migrations

Migrations create the SQLite database and the `tasks` table.

```bash
python manage.py migrate
```

To create migration files after model changes (already included in this repo):

```bash
python manage.py makemigrations tasks
python manage.py migrate
```

### 5. (Optional) Create a superuser for Django admin

```bash
python manage.py createsuperuser
```

Admin panel: http://127.0.0.1:8000/admin/

## Run the development server

```bash
python manage.py runserver
```

API base URL: **http://127.0.0.1:8000/api/tasks/**

## API endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/tasks/` | List all tasks |
| GET | `/api/tasks/{id}/` | Get one task |
| POST | `/api/tasks/` | Create a task |
| PUT | `/api/tasks/{id}/` | Update a task |
| DELETE | `/api/tasks/{id}/` | Delete a task |

### Task JSON shape

```json
{
  "id": 1,
  "title": "Learn React",
  "completed": false,
  "created_at": "2026-05-22T10:30:00Z"
}
```

### Create task (POST body)

```json
{
  "title": "Build frontend UI",
  "completed": false
}
```

`completed` is optional; it defaults to `false`. `created_at` and `id` are set by the server.

## Test the API

### Browser

Open: http://127.0.0.1:8000/api/tasks/

You should see a JSON list (empty `[]` until you add tasks).

### Postman / curl

**List tasks:**

```bash
curl http://127.0.0.1:8000/api/tasks/
```

**Create a task:**

```bash
curl -X POST http://127.0.0.1:8000/api/tasks/ ^
  -H "Content-Type: application/json" ^
  -d "{\"title\": \"Learn React\", \"completed\": false}"
```

On macOS/Linux, use `\` instead of `^` for line continuation, or put the command on one line.

**Get one task:**

```bash
curl http://127.0.0.1:8000/api/tasks/1/
```

**Update a task:**

```bash
curl -X PUT http://127.0.0.1:8000/api/tasks/1/ ^
  -H "Content-Type: application/json" ^
  -d "{\"title\": \"Learn React\", \"completed\": true}"
```

**Delete a task:**

```bash
curl -X DELETE http://127.0.0.1:8000/api/tasks/1/
```

## CORS (React frontend)

The backend allows requests from common local React dev URLs:

- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite)
- Same hosts with `127.0.0.1`

Point your frontend API client at `http://127.0.0.1:8000/api/tasks/`.

## Project layout

```
backend/
  manage.py
  requirements.txt
  quicktasks/          # Django project settings & root URLs
  tasks/               # Tasks app
    models.py          # Task database model
    serializers.py     # JSON conversion
    views.py           # API viewset
    urls.py            # /api/tasks/ routes
```
