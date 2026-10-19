# LevBakehila.Client – לב בקהילה (React)

A simple React 18 + Vite client for the LevBakehila API (separate repository, next to the `LevBakehila` server folder).

```bash
npm install
npm run dev      # http://localhost:5173
```

The client calls the API at `https://localhost:7257` by default. To use a different address, copy `.env.example` to `.env` and change `VITE_API_URL`.
Start the server first (see the server README).

Screens:
- **Login and registration:** the JWT is saved in localStorage and sent in the `Authorization: Bearer` header.
- **Activity list:** filtering by neighborhood and type, "my neighborhood first", sorting and server-side paging.
- **Activity details:** registration, with clear 409 messages (full, duplicate, overlap, parallel conflict), and required-skills matching (✓/✗).
- **My registrations:** cancellation.
- **My profile:** name, home neighborhood and skills.
- **Admin screen:** create, edit and cancel (DELETE, soft delete) activities, view registrants, and manage skills.

Times: the API speaks UTC. The client always shows and edits times in Israel time (`Asia/Jerusalem`), whatever the browser's time zone.
