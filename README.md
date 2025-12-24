🌿 DivineSpark – Frontend

DivineSpark is a modern wellness platform designed to help users transform their body, mind, and soul through yoga, fitness sessions, and holistic wellness programs.
This repository contains the frontend application built with React + TypeScript, focusing on a calm, elegant, and responsive user experience.

✨ Features
🔐 Authentication

Email-based registration with OTP verification

Secure login using email & password

Token-based authentication (JWT)

Protected routes for authenticated users

🧘 User Experience

Smooth animations using Framer Motion

Responsive hero section with parallax effects

Magnetic button interactions

Toast notifications for success & error states

Modal confirmations (logout, actions)

🧭 Navigation

Public & protected route handling

Dynamic header with profile icon

Login / Logout flow with session persistence

⚙️ User Utilities

Settings page

Logout confirmation

Session handling

🛠 Tech Stack
Category	Technology
Framework	React 18
Language	TypeScript
Build Tool	Vite
Styling	CSS Modules
Animations	Framer Motion
HTTP Client	Axios
Routing	React Router
State	React Context API
Linting	ESLint
📁 Project Structure
divinespark-frontend/
│
├── src/
│   ├── api/            # Axios setup & API calls
│   ├── assets/         # Images, videos, backgrounds
│   ├── components/     # Reusable UI components
│   ├── context/        # Auth & Toast context
│   ├── pages/          # Home, Login, Register, Sessions, Settings
│   ├── routes/         # Public & protected routes
│   ├── styles/         # Global styles & tokens
│   ├── types/          # TypeScript types
│   └── utils/          # Local storage helpers
│
├── public/
├── package.json
├── vite.config.ts
└── README.md

🔗 Backend Integration

The frontend communicates with the DivineSpark Backend using REST APIs.

Base API URL

http://localhost:8080/api/v1


Integrated Auth Endpoints

POST /auth/request-otp

POST /auth/verify-otp

POST /auth/register

POST /auth/login

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/divinespark-frontend.git
cd divinespark-frontend

2️⃣ Install Dependencies
npm install

3️⃣ Start Development Server
npm run dev


App will run at:

http://localhost:5173

🔒 Environment Variables

Create a .env file if required:

VITE_API_BASE_URL=http://localhost:8080/api/v1

🧪 Scripts
Command	Description
npm run dev	Start dev server
npm run build	Production build
npm run preview	Preview build
npm run lint	Run ESLint
📌 Best Practices Followed

Component-based architecture

Clean separation of concerns

Secure token handling

Mobile-first responsive design

Scalable folder structure

Production-ready Git hygiene
