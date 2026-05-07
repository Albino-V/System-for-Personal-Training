# FitCheck — Personal Training Check-In System

Automated attendance tracking for personal trainers using QR codes + Google Sheets.

## How it works

1. **Trainer** adds clients on the setup page → system generates a unique QR code per client
2. **Client** scans their QR code with any phone camera → instantly checked in, no app download needed
3. **Attendance** is logged to Google Sheets in real time
4. **Trainer** views today's attendance on the dashboard

## Features

- QR code generation (downloadable PNG per client)
- PWA check-in page — works on any phone, no app install required
- Real-time Google Sheets sync (attendance log with date/time/name)
- Trainer dashboard — live attendance per day + 30-day history
- Docker-ready for VPS deployment

## Tech Stack

- **Backend**: Node.js + Express, SQLite (better-sqlite3), Google Sheets API
- **Frontend**: React + Vite (PWA), React Router
- **Deploy**: Docker + Docker Compose + Nginx

## Local Development

### 1. Backend
```bash
cd backend
cp .env.example .env  # fill in your values
npm install
npm run dev           # runs on http://localhost:4000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev           # runs on http://localhost:5173
```

### 3. Google Sheets setup
1. Create a Google Cloud project and enable the Sheets API
2. Create a Service Account and download the JSON key
3. Share your spreadsheet with the service account email
4. Fill in `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_PRIVATE_KEY` in `.env`

> If Google credentials are not set, the app still works — check-ins are stored in SQLite only.

## VPS Deployment

```bash
cp backend/.env.example backend/.env  # fill in values
docker compose up -d --build
```

The app will be available at `http://your-vps-ip:3000`.

## Screenshots

| Setup / Client Management | QR Code | Check-in Confirmation | Trainer Dashboard |
|---|---|---|---|
| Add clients, generate QR codes | Printable per-client QR | Instant confirmation screen | Daily attendance table |
