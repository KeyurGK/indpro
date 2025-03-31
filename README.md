# Flow Task

## Overview
The **Flow Task** is a web-based task management system that allows users to efficiently create, manage, and categorize tasks. The application features user authentication, task organization, and category management.

## Features
- **User Authentication**: Users can sign up, log in, and access their tasks. The concept of Refresh and access token is used.
- **Dashboard**: A user-friendly interface where users can navigate to different sections.
- **Task Management**: Create, update, delete, and mark tasks as completed.
- **Category Management**: Users can organize their different categories.
- **SQL Database**: Ensures data integrity and efficient data storage.

## Tech Stack
### Backend:
- **Node.js** (JavaScript runtime for backend development)
- **Express.js** (Backend framework for handling API requests)
- **SQL Database** ( PostgreSQL)

### Frontend:
- **React.js** (Component-based frontend framework)
- **Vite** (Fast build tool for frontend development)
- **Tailwind CSS** (For styling the user interface)

## Installation
### Prerequisites
Ensure you have the following installed on your system:
- Node.js (v16+ recommended)
- Neon DB (MySQL/PostgreSQL/SQLite)

### Backend Setup
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables in a `.env` file:
   ```sh
DATABASE_URL=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
NODE_ENV=
   ```
4. Run database migrations (if applicable):
   ```sh
   npm run migrate
   ```
5. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open the application in your browser:
   ```
   http://localhost:5173
   ```

## Usage
1. **Sign Up**: Create a new account.
2. **Login**: Enter credentials to access the dashboard.
3. **Dashboard**: Navigate to different sections.
4. **Manage Tasks**: Add, edit, delete, or mark tasks as completed.
5. **Manage Categories**: Create and manage task categories in master screen

## API Endpoints
### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Categories
- `GET /api/master/categories` - Get all categories
- `POST /api/master/categories` - Create a new category




