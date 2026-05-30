# WasteWise AI

WasteWise AI is a Python + Expo waste-management prototype matching the supplied mobile mockups while also presenting a centered phone frame on desktop web for laptop showcases.

## Features
- Splash, login, register, dashboard, AI classifier, smart bins, GPS tracker, analytics, notifications, profile, and admin control center.
- Flask API with seeded SQLite data and demo JWT login.
- Expo React Native frontend with web support and responsive desktop showcase shell.

## Demo credentials
- Citizen: `user@wastewise.ai` / `password123`
- Admin: `admin@wastewise.ai` / `password123`

## Run backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Run frontend
```bash
cd frontend
npm install
npm run web
```

Set `EXPO_PUBLIC_API_URL=http://localhost:5000/api` if you want to force the live Flask backend. The frontend also includes a mock fallback so the app can be showcased without the server.
