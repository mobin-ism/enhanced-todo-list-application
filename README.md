# Enhanced Todo List Application

An advanced Todo application built with React, Node.js (v22.11.0), and MongoDB. This app allows users to manage tasks across different categories with authentication and user-specific data management.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
  - [Docker Deployment](#docker-deployment)
  - [Local Deployment](#local-deployment)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Future Enhancements](#future-enhancements)

---

## Features

### Frontend

- Comprehensive task management: Create, update, display, and delete tasks.
- Mark tasks as completed to track progress effectively.
- Categorize tasks for better organization and prioritization.
- Advanced sorting options: Sort tasks by priority or due date.
- Searching specific task.
- Secure user authentication using JSON Web Tokens (JWT).
- Intuitive UI styling to clearly distinguish between completed and pending tasks.
- Paginated task lists for enhanced navigation and usability.
- User-defined custom categories for personalized task organization.
- Flexible pagination settings: Customize the number of tasks displayed per page.

### Backend

- RESTful APIs for efficient management of tasks, categories, and user data.
- JSON Web Token (JWT) based authentication ensuring secure user sessions.
- Comprehensive data validation to maintain application integrity and prevent errors.
- Well-defined MongoDB schemas to structure and store data effectively.
- Dockerization of the application for consistent and portable deployment.

### Database

- Schemas for tasks, categories, and users.
- User-specific tasks and categories.
- Secure storage of sensitive user data.

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Nginx
- **Backend**: Node.js, Express
- **API Documentation**: Swagger
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose

---

## Project Structure

```
enhanced-todo-list-application/
│
├── frontend/                 # React-based frontend
│   ├── public/
│   ├── src/
│   └── .envExample
│   └── .gitignore
│   └── Dockerfile
│   └── eslint.config.js
│   └── index.html
│   └── nginx.conf
│   └── package.json
│   └── postcss.config.js
│   └── README.md
│   └── tailwind.config.js
│   └── tsconfig.json
│   └── vite.config.ts
│   └── yarn.lock
│
├── backend/                  # Node.js backend
│   ├── src/
│   ├── .dockerignore
│   └── .editorconfig
│   └── .env.example
│   └── .eslintignore
│   └── .eslintrc.json
│   └── .gitattributes
│   └── .gitignore
│   └── .lintstagedrc.json
│   └── .prettierignore
│   └── .prettierrc.json
│   └── Dockerfile
│   └── ecosystem.config.json
│   └── package.json
│   └── README.md
│   └── yarn.lock
│
├── docker-compose.yml        # Compose file for running the app
└── README.md                 # Project documentation
```

---

## Setup and Installation

### Docker Deployment

1. **Docke**:
   Ensure Docker and Docker Compose are installed on your machine.

2. **Clone the repository**:

   ```bash
   git clone https://github.com/mobin-ism/enhanced-todo-list-application.git
   cd enhanced-todo-list-application
   ```

3. **Build and run the application**:

   ```bash
   sudo docker compose build --no-cache && sudo docker compose up -d
   ```

4. **Access the application**:

   - **Frontend**: [http://localhost:8080](http://localhost:8080)
   - **Backend**: [http://localhost:3000](http://localhost:3000)

5. **Authentication Options**

   - **Superadmin Access**:

     A pre-seeded superadmin account is available for immediate use. The credentials are:

     - **Email**: `superadmin@example.com`
     - **Password**: `password123`

   - **User Registration**:

     New users can create their own accounts directly from the application. Each user will have a personalized dashboard to manage tasks and categories.

The superadmin account is populated via the seeding mechanism during the initial setup, providing administrative access to oversee the application.

---

### Local Deployment

1. **Install prerequisites**:

   - Node.js (v22.11.0)
   - Yarn (v1.22.22)
   - MongoDB

2. **Clone the repository**:

   ```bash
   git clone https://github.com/mobin-ism/enhanced-todo-list-application.git
   cd enhanced-todo-list-application
   ```

3. **Set up environment variables**:
   Create `.env` files for both frontend and backend services. See the [Environment Variables](#environment-variables) section for details.

4. **Install dependencies and run services**:

   - **Backend**:
     ```bash
     cd backend
     yarn
     yarn dev
     ```
   - **Frontend**:
     ```bash
     cd frontend
     yarn
     yarn build
     yarn dev
     ```

5. **Access the application**:

   - **Frontend**: [http://localhost:8080](http://localhost:8080)
   - **Backend**: [http://localhost:3000](http://localhost:3000)

6. **Authentication Options**

   - **Superadmin Access**:

     A pre-seeded superadmin account is available for immediate use. The credentials are:

     - **Email**: `superadmin@example.com`
     - **Password**: `password123`

   - **User Registration**:

     New users can create their own accounts directly from the application. Each user will have a personalized dashboard to manage tasks and categories.

---

## Environment Variables

### Backend

Create a `.env` file in the `backend/` directory and copy all the content from `.envExample`:

```
# Port number
PORT=3000

# URL of the Mongo DB
MONGODB_USER=admin
MONGODB_PASSWORD=password
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DATABASE=todo

# JWT
# JWT secret key
JWT_SECRET=thisisasamplesecret
# Number of minutes after which an access token expires
JWT_ACCESS_EXPIRATION_MINUTES=60
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION_DAYS=60
# Number of minutes after which a reset password token expires
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=60
# Number of minutes after which a verify email token expires
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=60

# SMTP configuration options for the email service
# For testing, you can use a fake SMTP service like Ethereal: https://ethereal.email/create
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=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
EMAIL_FROM=mobin@anchorblock.vc
```

### Frontend

Create a `.env` file in the `frontend/` directory and copy all the content from `.envExample`:

```
VITE_API_BASE_URL=http://localhost:3000/v1
```

---

## API Endpoints

You can see the API documentation in Swagger, If you follow the local deployment.
Go to [http://localhost:3000/v1/docs/](http://localhost:3000/v1/docs/)

### Tasks

- `GET /tasks`: Retrieve all tasks.
- `GET /tasks/:id`: Retrieve a specific tasks.
- `POST /tasks`: Create a new task.
- `PATCH /tasks/:id`: Update a task.
- `DELETE /tasks/:id`: Delete a task.

### Categories

- `GET /categories`: Retrieve all categories.
- `GET /categories/:id`: Retrieve a specific categories.
- `POST /categories`: Create a new category.
- `PATCH /categories/:id`: Update a category.
- `DELETE /categories/:id`: Delete a category.

### Authentication

- `POST /auth/login`: User login.
- `POST /auth/register`: User registration.
- `POST /auth/refresh-token`: Access token refreshing.

### Users

- `GET /users`: Retrieve all users.
- `GET /users/:id`: Retrieve a specific users.
- `POST /users`: Create a new user.
- `PATCH /users/:id`: Update a user.
- `DELETE /users/:id`: Delete a user.

---

## Database Schema

### Task

- `title`: String (required, trimmed)
- `description`: String (optional, trimmed)
- `dueDate`: Date (optional)
- `categoryId`: ObjectId (references Category, optional)
- `isCompleted`: Boolean (default: false)
- `userId`: ObjectId (references User, required)
- `priority`: Number (enum: [1, 2, 3] for low, medium, high, default: 1)

### Category

- `name`: String (required, unique, trimmed)
- `description`: String (optional, trimmed)
- `isActive`: Boolean (default: true)
- `userId`: ObjectId (references User, optional)
- `timestamps`: CreatedAt, UpdatedAt (automatically added by mongoose)

### User

- `name`: String (required, trimmed)
- `email`: String (required, unique, trimmed, lowercase)
- `password`: String (required, trimmed, minimum length: 8) Must contain at least one letter and one number, Stored privately (excluded from JSON representation)
- `role`: String (enum: values defined in roles, default: 'user')
- `isEmailVerified`: Boolean (default: true)
- `timestamps`: CreatedAt, UpdatedAt (automatically added by mongoose)

---
