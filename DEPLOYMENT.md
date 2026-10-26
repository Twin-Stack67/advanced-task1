# Deploying to Vercel

This repository keeps the Next.js frontend at the project root and exposes the
Express backend through the Vercel Node.js Function in `api/[...path].ts`.
Keep the Vercel project's **Root Directory** set to the repository root (the
directory containing this file and `vercel.json`). Vercel builds the Next.js
application using its standard `.next` output; no static `outputDirectory`
override is needed.

The function forwards `/api/*` requests to the existing Express routes. It
connects to MongoDB before dispatching each request and reuses the connection
while the function instance remains warm. The local `backend/src/server.ts`
still starts Express with `app.listen()` for development; that listener is not
imported by the deployed function.

## Environment variables

For local development, copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api` for the local frontend
  to reach the separately running Express server.
- `MONGO_URI` with a MongoDB connection string.
- `JWT_SECRET` with a long, random signing secret.
- Optionally, `CORS_ORIGINS` as a comma-separated list of browser origins when
  the frontend and backend use different hosts.

Start the frontend with `npm run dev` from this directory and the backend with
`npm run dev` from `backend`. The backend reads `../.env.local` by default;
`DOTENV_CONFIG_PATH` can override that path.

For Vercel, add `MONGO_URI` and `JWT_SECRET` under **Project Settings ->
Environment Variables** for every environment that needs them. Do not prefix
these secrets with `NEXT_PUBLIC_`; that prefix exposes a value to browser
bundles. The frontend uses the same-origin `/api` path in production by
default, so leave `NEXT_PUBLIC_API_BASE_URL` unset for the standard
single-project deployment. `CORS_ORIGINS` is not needed for same-origin
requests. If the backend is moved to a separate host, set
`NEXT_PUBLIC_API_BASE_URL` to its full API base URL (including `/api`) and set
`CORS_ORIGINS` to the frontend origin.

For MongoDB Atlas, ensure its network access rules permit connections from
Vercel deployments; Vercel function egress addresses are not a fixed
allowlist.
