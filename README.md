# MentorHub — Frontend

A modern, role-based web platform that connects **students** with **mentors** for online and offline tutoring sessions. Built with Vue 3, TypeScript, and Vite.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Architecture Overview](#architecture-overview)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Overview

MentorHub is a platform where students discover and book sessions with qualified mentors. The frontend implements **role-based access control** for three actor types:

| Role | Description |
|------|-------------|
| 🎓 **Student** | Search mentors, view profiles, book lessons, manage bookings |
| 🧑‍🏫 **Mentor** | Manage professional profile, define availability slots, review incoming bookings |
| 🛡️ **Admin** | Access platform-wide statistics and recent activity |
| 🌐 **Public** | Browse the mentor directory and view individual profiles without logging in |

---

## Features

### Public
- Landing page with platform introduction
- Paginated / searchable mentor directory
- Detailed mentor profiles: bio, specializations, lesson formats, pricing, ratings, and available slots
- User authentication: registration (student or mentor), login, password recovery, email verification

### Student
- Personalized dashboard with upcoming lesson events and booking statistics
- Profile management
- Full booking lifecycle: create, view, and track lessons

### Mentor
- Dashboard with income/student/rating stats and upcoming events
- Professional profile editor (specializations, experience, lesson format, price per hour)
- Availability slot manager (start/end time, timezone, online/offline format, meeting link or address)
- Booking management: view student requests and lesson history

### Admin
- Platform-wide dashboard: total bookings, active students/mentors, completion rate, average rating
- Recent activity feed

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Vue 3](https://vuejs.org/) with `<script setup>` Composition API |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (strict mode) |
| **Build Tool** | [Vite](https://vite.dev/) |
| **Routing** | [Vue Router 4](https://router.vuejs.org/) |
| **State Management** | [Pinia](https://pinia.vuejs.org/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **CSS** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Form Validation** | [VeeValidate](https://vee-validate.logaretm.com/) + [Zod](https://zod.dev/) |
| **Icons** | [Lucide Vue Next](https://lucide.dev/) |
| **Utilities** | [@vueuse/core](https://vueuse.org/) |
| **Containerisation** | Docker (multi-stage) + Nginx |
| **Deployment** | Google Cloud Run |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- A running instance of the [MentorHub backend API](http://localhost:8080) (or any compatible API)

### Installation

```bash
# Clone the repository
git clone https://github.com/ksulaimanov/metorhub-frontend.git
cd metorhub-frontend

# Install dependencies
npm install
```

### Running the Development Server

```bash
# Copy the example environment file and set your API URL
cp .env.example .env

# Start the dev server
npm run dev
```

The application is served at **http://localhost:5173** by default.

---

## Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```dotenv
# Base URL of the MentorHub backend REST API
VITE_API_BASE_URL=http://localhost:8080
```

> **Note:** All variables must be prefixed with `VITE_` to be exposed to the browser bundle by Vite.

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend API base URL |

---

## Project Structure

```
src/
├── app/
│   └── router/          # Vue Router configuration with role-based navigation guards
├── assets/              # Global styles (Tailwind entry point)
├── components/          # Generic reusable components
├── pages/               # Route-level page components, organised by role
│   ├── admin/           #   Admin dashboard
│   ├── auth/            #   Login, Register, Forgot/Reset Password, Verify Email
│   ├── mentor/          #   Mentor dashboard, profile, slots, bookings
│   ├── public/          #   Home, About, Mentor Directory, Public Mentor Profile
│   ├── student/         #   Student dashboard, profile, bookings
│   └── system/          #   404 Not Found
├── shared/
│   ├── api/             # Axios HTTP client & typed API modules
│   │   ├── http.ts      #   Axios instance with Bearer-token interceptor
│   │   ├── bookingApi.ts
│   │   ├── dashboardApi.ts
│   │   ├── mentorPublicApi.ts
│   │   └── reviewApi.ts
│   ├── composables/     # Reusable Vue composables (e.g. useErrorHandler)
│   ├── lib/             # Pure utility functions (date formatting, error extraction)
│   ├── types/           # Shared TypeScript interfaces and types
│   └── ui/              # Shared UI components (badges, cards, states, toasts, …)
├── stores/              # Pinia stores
│   └── authStore.ts     #   Authentication state (tokens, roles, user info)
└── widgets/             # Complex, self-contained UI blocks
    ├── header/          #   PrivateHeader (authenticated nav bar)
    └── layout/          #   PublicLayout & PrivateLayout wrappers
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Type-check with `vue-tsc`, then build optimised production bundle |
| `npm run preview` | Serve the production build locally for verification |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                    Pages (Routes)               │
│  admin/ │ mentor/ │ student/ │ auth/ │ public/  │
└────────────────────┬────────────────────────────┘
                     │ use
          ┌──────────┴──────────┐
          │  Composables        │  ← useErrorHandler, etc.
          └──────────┬──────────┘
                     │ call
          ┌──────────┴──────────┐
          │   API Layer         │  ← bookingApi, dashboardApi, …
          │   (Axios + Bearer)  │
          └──────────┬──────────┘
                     │
          ┌──────────┴──────────┐
          │  Pinia Stores       │  ← authStore, toast store
          └─────────────────────┘
```

### Key Design Decisions

- **Role-based routing** — Route meta fields (`requiresAuth`, `role`) drive navigation guards that redirect users to the appropriate dashboard or login page automatically.
- **Centralised HTTP client** — A single Axios instance (`shared/api/http.ts`) injects the Bearer token on every request, keeping API modules thin.
- **Composable error handling** — `useErrorHandler` normalises diverse API error formats and dispatches toast notifications, preventing duplicated try/catch boilerplate in pages.
- **Two-layout system** — `PublicLayout` and `PrivateLayout` cleanly separate the authenticated UX from public-facing pages without conditional rendering at the root level.
- **Strict TypeScript** — `"strict": true` in `tsconfig.app.json` ensures type safety across the entire codebase.

---

## Deployment

### Docker (recommended)

```bash
# Build the image, passing the API URL as a build argument
docker build \
  --build-arg VITE_API_BASE_URL=https://api.yourdomain.com \
  -t mentorhub-frontend .

# Run the container
docker run -p 8080:8080 mentorhub-frontend
```

The image uses a **multi-stage build** (Node 20-Alpine → Nginx-Alpine) to produce a minimal production image. Nginx serves the SPA on port **8080** and includes a catch-all rewrite rule for client-side routing.

### Google Cloud Run

Deployment scripts are included for both Linux/macOS and Windows:

```bash
# Linux / macOS
chmod +x deploy.sh
./deploy.sh https://api.yourdomain.com

# Windows
deploy.bat https://api.yourdomain.com
```

The scripts build the image, push it to Google Container Registry, and deploy to Cloud Run (region: `us-central1`, memory: 256 Mi, 1 vCPU, unauthenticated access).

---

## Contributing

1. Fork the repository and create your feature branch (`git checkout -b feature/your-feature`).
2. Make your changes, following the existing code style.
3. Commit using a descriptive message (`git commit -m 'feat: add XYZ'`).
4. Push to your fork and open a Pull Request.

> There is currently no automated test or linting suite configured. Contributions that add Vitest or ESLint/Prettier are welcome.
