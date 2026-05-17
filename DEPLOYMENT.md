# Deployment Guide

This project is deployed as:
- **Frontend (React/CRACO):** Vercel or Netlify
- **Backend (FastAPI):** Render or Railway
- **Database (optional):** MongoDB Atlas

---

## 1) Environment Variables

### Backend (Render/Railway)
Set:
- `NANO_BANANA_API_KEY` (required for image generation)
- `NANO_BANANA_MODEL` (optional, default `gemini-2.5-flash-image`)
- `GEMINI_API_KEY` (optional fallback key name)
- `MONGO_URL` (optional)
- `DB_NAME`
- `CORS_ORIGINS` (exact frontend domain(s), comma-separated)

Use `backend/env.example` as template.

### Frontend (Vercel/Netlify)
Set:
- `REACT_APP_BACKEND_URL` (public backend URL)

Use `frontend/env.example` as template.

---

## 2) Backend Deployment First

### Option A: Render
This repo includes `render.yaml`.

Key settings:
- Service root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
- Health check: `/api/`

### Option B: Railway
This repo includes `backend/Procfile`:
- `web: uvicorn server:app --host 0.0.0.0 --port $PORT`

Set backend root directory to `backend` in Railway service settings.

### Verify Backend
After deploy, verify:
- `GET https://<backend-domain>/api/` returns 200 with API message.

---

## 3) Frontend Deployment Next

### Option A: Vercel
- Import repo
- Set **Root Directory** to `frontend`
- Build command: `npm run build`
- Output directory: `build`
- Add env: `REACT_APP_BACKEND_URL=https://<backend-domain>`

SPA fallback is configured in `frontend/vercel.json`.

### Option B: Netlify
This repo includes `netlify.toml` with:
- Base: `frontend`
- Build: `npm run build`
- Publish: `build`
- SPA redirect to `/index.html`

Add env: `REACT_APP_BACKEND_URL=https://<backend-domain>`.

---

## 4) End-to-End Validation

After both deployments are live:
1. Open frontend URL.
2. Test image generation flow.
3. Test template listing/download.
4. Test PDF export.
5. Test PPT export.
6. Confirm browser network panel has no CORS errors.
7. Confirm backend logs show successful generation provider calls.

---

## 5) Final Hardening

1. Add custom domains for frontend and backend.
2. Enforce HTTPS only.
3. Restrict `CORS_ORIGINS` to exact frontend domains.
4. Add uptime monitors (frontend + `/api/`).
5. Add log alerts for backend error rates/timeouts.
