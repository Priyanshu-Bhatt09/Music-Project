# Muse Library Frontend

Next.js + Tailwind CSS frontend for the music library project.

## Focus Choice

This project focuses on **albums**.

Why albums:

- Albums map cleanly to the iTunes catalog fields needed for the assignment.
- They give richer analytics than single tracks because track count, release year, and genre are more meaningful.
- They keep the saved-library schema simple while still supporting a nice UI for search, library management, and insights.

## UI Structure

- `app/page.tsx` - search landing page
- `app/library/page.tsx` - saved library view
- `app/analytics/page.tsx` - analytics dashboard
- `components/` - reusable layout and card primitives
- `lib/mock-data.ts` - local demo data for the UI shell

## Notes

- Tailwind CSS is used for all styling.
- The charts are implemented with lightweight SVG and utility classes to keep the project dependency-light.
- Replace the mock arrays with live backend requests once the backend URL is wired in.

## Run

```bash
npm install
npm run dev
```
