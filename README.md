# Smart Leads Dashboard (MERN + TypeScript)

A professional, full-stack Lead Management Dashboard built with the MERN stack (MongoDB, Express, React, Node.js) and strictly typed with TypeScript. This project features a clean architecture, secure authentication, role-based access control, and advanced filtering capabilities.

## 🚀 Features

- **Authentication System:**
  - Secure JWT-based authentication.
  - User registration with role selection (Admin/Sales).
  - Secure password hashing using `bcryptjs`.
  - Protected routes and persistent auth state.
- **Leads Management (CRUD):**
  - Full CRUD operations for leads.
  - Fields: Name, Email, Status (New, Contacted, Qualified, Lost), Source (Website, Instagram, Referral).
- **Advanced Filtering & Search:**
  - Multi-filter system (Status + Source + Search).
  - Debounced real-time search by name or email.
  - Sorting by Latest or Oldest records.
- **Performance & Scalability:**
  - Mandatory backend pagination (10 records per page).
  - Centralized error handling and API response standardization.
  - Type-safe implementation on both frontend and backend.
- **Mandatory Additional Features:**
  - **CSV Export:** Download lead data directly from the dashboard.
  - **Role-Based Access Control (RBAC):** Restrict sensitive actions (like deletion) to Admins only.
  - **Dark Mode Support:** Fully functional dark mode with a theme toggle.
  - **Dockerized Setup:** Ready to run anywhere with a single command.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS, React Router, Axios.
- **Backend:** Node.js, Express, TypeScript, Mongoose (MongoDB).
- **Tooling:** Docker, Docker Compose, Zod (Validation), JWT.

## 📂 Project Structure

```text
.
├── client/                 # React + TypeScript + Tailwind (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth and Theme providers
│   │   ├── hooks/          # Custom React hooks (debounce, etc.)
│   │   ├── pages/          # Full page components
│   │   ├── services/       # API abstraction layer
│   │   └── types/          # Shared TypeScript interfaces
├── server/                 # Express + TypeScript API
│   ├── src/
│   │   ├── config/         # Env and database configuration
│   │   ├── middleware/     # Auth and RBAC middlewares
│   │   ├── modules/        # Domain-driven modules (auth, leads, users)
│   │   └── utils/          # Helpers (error handling, API responses)
├── docker-compose.yml      # Orchestration for MongoDB, API, and Client
├── .env.example            # Template for environment variables
└── README.md               # You are here
```

## ⚙️ Setup & Installation

### Option 1: Using Docker (Recommended)

Ensure you have Docker and Docker Compose installed.

1.  Clone the repository.
2.  Create a `.env` file in the root directory based on `.env.example`.
3.  Run the following command from the root directory:
    ```bash
    docker compose up --build
    ```
4.  Access the applications:
    - **Frontend:** `http://localhost:5173`
    - **API:** `http://localhost:5000`

### Option 2: Local Manual Setup

#### Prerequisites:
- Node.js (v18+)
- MongoDB (running locally at `mongodb://localhost:27017`)

#### 1. Backend Setup
```bash
cd server
npm install
# Configure server/.env (see server/.env.example)
npm run dev
```

#### 2. Frontend Setup
```bash
cd client
npm install
# Configure client/.env (see client/.env.example)
npm run dev
```

## 🔐 Environment Variables

The project uses separate environment files for the root (Docker), server, and client.

### Root `.env` (Docker Orchestration)
- `MONGO_PORT`: Port for MongoDB.
- `SERVER_PORT`: Port for the Express API.
- `CLIENT_PORT`: Port for the React app.
- `ADMIN_REGISTRATION_KEY`: Secure key required to register as an Admin.

### Server `.env` (`server/.env`)
- `MONGODB_URI`: Connection string for MongoDB.
- `JWT_SECRET`: Secret key for signing tokens.
- `ADMIN_REGISTRATION_KEY`: Must match the key used during registration.

## 📡 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user (requires Admin Key for admin role). |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT. |
| `GET` | `/api/auth/me` | Get current user profile (Protected). |

### Leads Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/leads` | Create a new lead. |
| `GET` | `/api/leads` | List leads (supports pagination, filter, search, sort). |
| `GET` | `/api/leads/:id` | Get details of a single lead. |
| `PATCH` | `/api/leads/:id` | Update an existing lead. |
| `DELETE` | `/api/leads/:id` | Delete a lead (Admin only). |
| `GET` | `/api/leads/export/csv` | Download all filtered leads as CSV. |

## 🧪 Evaluation Compliance

This project strictly adheres to the following assignment criteria:
- [x] **No Plain JS:** 100% TypeScript.
- [x] **Backend Pagination:** Implemented via MongoDB skip/limit.
- [x] **RBAC:** Secured endpoints for Admin vs Sales roles.
- [x] **Debounced Search:** Efficient client-side filtering.
- [x] **Modern UI:** Responsive design with Loading/Empty/Error states.
- [x] **Validation:** Robust Zod schemas on both ends.

## 📧 Contact & Submission

**Candidate:** Gaurav
**Assignment:** Smart Leads Dashboard Internship Submission

