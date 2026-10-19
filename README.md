# LevBakehila.Client – לב בקהילה (React)

A simple React client for the LevBakehila API.

```bash
npm install
npm run dev      # http://localhost:5173
```

The client calls the API at `https://localhost:7257` by default. To use a different address, copy `.env.example` to `.env` and change `VITE_API_URL`.

Screens: login and registration, the activity list (filtering, sorting and server-side paging), activity details with registration (including 409 handling), "my registrations" with cancellation, and an admin screen for creating, editing and cancelling activities and viewing registrants.
