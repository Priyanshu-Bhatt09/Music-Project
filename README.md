# Music Library Platform

Full-stack music library app with Spring Boot, Next.js, Tailwind CSS, and an AI-ready backend.

## Live Link
https://music-project-taupe-one.vercel.app/

## Project Choice

The app focuses on **albums**.

That choice keeps the schema simple and makes the analytics more meaningful because albums have stable metadata like release date, genre, and track count.

## Stack

- Backend: Java, Spring Boot, JPA, Security, Validation
- Frontend: Next.js, React, Tailwind CSS
- Database: SQL with JPA
- API source: iTunes Search API

## Architecture

- `backend/` contains the Spring Boot API, persistence layer, auth scaffolding, and insights endpoint.
- `frontend-music/` contains the Next.js app router pages, shared UI components, and chart sections.

## Schema

The saved library stores only user-owned items with fields:

- `id`
- `apple_catalog_id`
- `title`
- `artist_name`
- `genre`
- `release_date`
- `track_count`
- `duration_seconds`
- `artwork_url`
- `user_rating`
- `user_notes`
- `created_at`
- `updated_at`

## AI Feature

The first AI-style feature is a lightweight **trend summary** endpoint that turns the library into a natural-language insight.

## Trade-offs

- JWT authentication is scaffolded in the backend structure, but the current demo flow is intentionally lightweight so the project stays easy to run locally.
- The frontend currently uses local demo data for presentation; wiring it to live API calls is the next integration step.
- Chart rendering is implemented without a chart library to keep the dependency footprint small.

## Run

Backend:

```bash
cd backend
./mvnw spring-boot:run
```

Frontend:

```bash
cd frontend-music
npm install
npm run dev
```

## Deployment

- Frontend: Vercel or Netlify
- Backend: Render, Railway, or AWS
