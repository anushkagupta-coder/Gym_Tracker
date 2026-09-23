# 🏋️ Gym Tracker

A full-stack workout tracking application designed to help users manage exercises, record workout sessions, monitor progress, and maintain workout streaks.

## ✨ Features

* 🔐 **User Authentication** — Secure registration and login using JWT and bcryptjs.
* 🏋️ **Exercise Management** — Add, view, edit, and delete exercises.
* 🎯 **Exercise Library** — Choose exercises based on muscle groups such as Chest, Legs, Arms, Back, Shoulders, Core, and more.
* ✍️ **Custom Exercises** — Add exercises that are not available in the predefined library.
* 📝 **Workout Logging** — Create workout sessions and record multiple exercises, sets, reps, and weights.
* 📊 **Dashboard Analytics** — Track total workouts, exercises performed, workout volume, and weekly activity.
* 📈 **Progress Tracking** — Compare previous and current performance with best weight, reps, estimated 1RM, and performance trends.
* 🔥 **Workout Streaks** — Calculate current and longest streaks using actual workout dates.
* 👤 **User-specific Data** — Each user can only access and modify their own exercises and workout records.
* 📱 **Responsive Interface** — Clean dark-themed UI with animations and interactive charts.

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* Axios
* React Router
* Recharts
* Framer Motion
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* bcryptjs

### DevOps & Deployment

* Docker
* Docker Compose
* Docker Hub
* GitHub Actions
* Vercel
* Render
* Nginx

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      React.js       │
                    │      Vite App       │
                    └──────────┬──────────┘
                               │
                            Axios
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Express.js API   │
                    │   JWT Middleware    │
                    └──────────┬──────────┘
                               │
                           Mongoose
                               │
                               ▼
                    ┌─────────────────────┐
                    │    MongoDB Atlas    │
                    └─────────────────────┘

          Docker → Containerization
          GitHub Actions → CI/CD
          Vercel → Frontend Deployment
          Render → Backend Deployment
```

## 🔐 Authentication & Authorization

The application uses JWT-based authentication. User passwords are hashed using bcryptjs before being stored in MongoDB.

After login, the server generates a JWT token. The token is sent with protected API requests using the `Authorization: Bearer <token>` header.

The backend verifies the token and uses the authenticated user's ID when accessing workout and exercise data. This ensures that users can only access and modify their own records.

## 🔥 Workout Streak Logic

Workout streaks are calculated from the workout records stored in MongoDB.

Multiple workouts on the same day count as one active day. The unique workout dates are normalized, sorted, and compared to consecutive dates to calculate the current streak. The same date-based approach is used to determine the user's longest streak.

## 📊 Progress Tracking

The progress module compares workout performance over time for a selected exercise.

It tracks:

* Previous and current performance
* Best weight
* Best repetitions
* Estimated 1RM
* Improvement, maintenance, or decrease in performance

Estimated 1RM is calculated using:

```text
Estimated 1RM = Weight × (1 + Reps / 30)
```

## 🐳 Docker

The project uses separate Docker containers for the frontend and backend.

```text
gym-tracker-frontend
gym-tracker-api
```

The frontend is built with Vite and served using Nginx, while the backend runs as a Node.js/Express container.

Docker Compose is provided for running both services locally.

## ⚙️ CI/CD

GitHub Actions is used to automate the development workflow.

On pushes to the `main` branch, the workflow:

1. Installs backend dependencies.
2. Checks the backend.
3. Installs frontend dependencies.
4. Builds the frontend.
5. Builds the backend Docker image.
6. Builds the frontend Docker image.
7. Authenticates with Docker Hub using GitHub Secrets.
8. Pushes both Docker images to Docker Hub.

## 🚀 Deployment

| Component     | Platform       |
| ------------- | -------------- |
| Frontend      | Vercel         |
| Backend       | Render         |
| Database      | MongoDB Atlas  |
| Docker Images | Docker Hub     |
| CI/CD         | GitHub Actions |

## 📁 Project Structure

```text
Gym_Tracker/
│
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── lib/
│   │   └── pages/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
├── docker-compose.yml
└── README.md
```

## 🌐 Live Application

**Frontend:**
`https://gym-tracker-melq-two.vercel.app`

**Backend:**
`https://gym-tracker-52tf.onrender.com`

## 🐳 Docker Hub

**Backend Image:**
`YOUR_DOCKERHUB_USERNAME/gym-tracker-api`

**Frontend Image:**
`YOUR_DOCKERHUB_USERNAME/gym-tracker-frontend`

## 💡 Project Objective

Gym Tracker was built as a full-stack application to combine workout management with practical software engineering concepts such as REST APIs, authentication, database design, containerization, CI/CD, and cloud deployment.

The goal was to create a system that is not only useful for tracking workouts but also demonstrates an end-to-end development and deployment workflow.
