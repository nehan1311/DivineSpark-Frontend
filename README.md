# DivineSpark Frontend

DivineSpark is a wellness platform frontend built using React and TypeScript.
This application focuses on user authentication, clean UI design, and a calm,
modern user experience suitable for a yoga and wellness product.

This repository contains only the frontend code.

---

## Current Features

- Home page with responsive hero section
- User registration with OTP verification
- User login using email and password
- JWT-based authentication handling
- Protected routes for authenticated users
- Logout functionality with confirmation
- Toast notifications for success and errors
- Settings page (basic UI only)
- Responsive layout for desktop and mobile
- Smooth UI animations using Framer Motion

---

## Tech Stack

- React
- TypeScript
- Vite
- CSS Modules
- Framer Motion
- Axios
- React Router
- Context API

---

## Project Structure

divinespark-frontend/
│
├── src/
│   ├── api/            API calls and axios configuration
│   ├── assets/         Images and static files
│   ├── components/     Reusable UI components
│   ├── context/        Authentication and toast context
│   ├── pages/          Application pages
│   ├── routes/         Routing logic
│   ├── types/          TypeScript types
│   └── utils/          Helper utilities
│
├── public/
├── package.json
└── vite.config.ts

---

## Backend Integration

The frontend connects to a Spring Boot backend using REST APIs.

Base API URL:
http://localhost:8080/api/v1

Authentication APIs used:
- POST /auth/request-otp
- POST /auth/verify-otp
- POST /auth/register
- POST /auth/login

---

## Getting Started

1. Clone the repository

git clone https://github.com/<your-username>/divinespark-frontend.git

2. Install dependencies

npm install

3. Start development server

npm run dev

Application runs at:
http://localhost:5173

---

## Environment Variables

Create a .env file if required:

VITE_API_BASE_URL=http://localhost:8080/api/v1

---

## Scripts

npm run dev       Start development server
npm run build     Build for production
npm run preview   Preview production build
npm run lint      Run linting

---

## Notes

- node_modules and dist folders are ignored via .gitignore
- This project is under active development
- UI and features will be enhanced incrementally

