# UNINOTES Backend

## Overview

- **Database**: SQLite (Prisma 7 + `@prisma/adapter-better-sqlite3`)
- **Auth**: JWT in httpOnly cookies (lib/auth + jose)
- **Roles**: `student`, `host`, `admin`

## Setup

1. Copy `.env.example` to `.env` and set:
   - `DATABASE_URL` (default `file:./dev.db`)
   - `JWT_SECRET` (required in production)

2. Create DB and seed:
   ```bash
   npm run db:push
   npm run db:seed
   ```

3. Seed users (password for all: `password123`):
   - **Admin**: admin@uninotes.edu
   - **Host**: host@uninotes.edu
   - **Student**: student@uninotes.edu

## API

- `POST /api/auth/register` – register (body: email, password, firstName, lastName, department?, year?, section?)
- `POST /api/auth/login` – login (body: email, password)
- `GET /api/auth/me` – current user
- `POST /api/auth/logout` – logout
- `GET /api/departments` – list departments with note counts
- `GET /api/notes` – list notes (query: department, year, section, subject)
- `POST /api/notes` – create note (auth; body: title, description, department, year, section, subject, fileUrl?)
- `POST /api/upload` – upload file locally (auth; body: formData with file)
- `GET /api/notes/[id]` – note detail
- `POST /api/notes/[id]/download` – record download (auth)
- `GET/POST /api/notes/[id]/comments` – list / add comment (auth for POST)
- `POST /api/notes/[id]/rate` – rate 1–5 (auth)
- `POST /api/notes/[id]/approve` – approve (host/admin)
- `POST /api/notes/[id]/reject` – reject (host/admin; body: reason?)
- `GET /api/host/pending-notes` – list notes pending approval (host/admin)
- `GET /api/leaderboard` – top contributors
- `GET /api/dashboard/stats` – user stats (auth)
- `GET /api/dashboard/submissions` – my submissions (auth)
- `GET /api/dashboard/recent-downloads` – recent downloads (auth)

## Scripts

- `npm run db:generate` – generate Prisma client
- `npm run db:push` – push schema to DB
- `npm run db:seed` – run seed
- `npm run db:studio` – open Prisma Studio
