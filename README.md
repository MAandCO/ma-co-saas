# Ma & Co Accountants – Compliance CRM SaaS

A navy & gold practice cockpit for Ma & Co Accountants. The platform combines a marketing homepage with a Supabase-authenticated internal dashboard that orchestrates clients, staff, compliance workflows, document storage, and Stripe-powered billing. AI (via OpenRouter) generates compliance schedules tailored to each client profile.

## Project layout

```
ma-co-saas/
├── backend/          # Express API (Auth guard, Supabase persistence, AI, Stripe)
├── frontend/         # Vite + React client (homepage + protected dashboard)
├── supabase/         # schema.sql, rls.sql, seed.sql helpers for your project
└── README.md
```

## 1. Backend (Express API)

### Environment

Duplicate `backend/.env.example` → `backend/.env` and populate:

```bash
PORT=4000
OPENROUTER_API_KEY=sk-or-v1-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_APP_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> ⚠️ Keep the OpenRouter and Supabase service keys secret – `.env` files are already git-ignored.

### Install & run

```bash
cd backend
npm install
npm run dev
```

All `/api/*` routes (clients, workers, tasks, documents, payments) now require a valid Supabase access token. `requireAuth` verifies the bearer token and injects `req.user` / `req.ownerId` so every CRUD controller scopes queries to the authenticated firm.

Key endpoints:

- `GET /health` – health check
- `POST /api/tasks/generate` – call OpenRouter (GPT‑5 mini) for task suggestions tied to the signed-in firm
- `POST /api/documents` – upload files (stored locally) + metadata persisted to Supabase
- `POST /api/payments/checkout-session` – create Stripe Checkout session with firm/client metadata
- `POST /api/webhooks/stripe` – receives Stripe CLI events (raw body preserved for signature verification)

### Supabase schema

All table/trigger definitions now live in `supabase/schema.sql`. Run it once against your Supabase project (SQL Editor → paste contents → **Run**, or `supabase db push --file supabase/schema.sql`). Follow it with `supabase/rls.sql` to enable the per-owner policies your API expects.

- **Seed data:** update `supabase/seed.sql` with your workspace owner UUID (replace `{{OWNER_ID}}`) and apply it via the Studio SQL editor or the Supabase CLI.
- **Re-running locally:** if you drop tables during development, just re-run `schema.sql` followed by `rls.sql`.
- **API fallback:** if `SUPABASE_URL`/`SERVICE_ROLE_KEY` are missing, the backend and frontend show helpful warnings instead of crashing, making local iteration easier.

### Stripe CLI (local testing)

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and log in.
2. Start the backend on port 4000, then in a new shell:
   ```bash
   stripe listen --forward-to localhost:4000/api/webhooks/stripe
   ```
3. Create a checkout link from the dashboard; webhook updates will mark the Supabase payment record as completed.

## 2. Frontend (Vite + React)

### Environment

Duplicate `frontend/.env.example` → `frontend/.env` and populate:

```bash
VITE_API_BASE_URL=http://localhost:4000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Install & run

```bash
cd frontend
npm install
npm run dev
```

The dev server proxies `/api/*` to `http://localhost:4000`. Supabase Auth drives the UI:

- `AuthProvider` wraps the app, listens for auth state changes, and injects the access token into Axios.
- `/auth` renders a combined sign-in/sign-up screen.
- `/dashboard` and `/payments/:state` are wrapped in `ProtectedRoute`, redirecting unauthenticated visitors back to `/auth`.
- `Sign out` in the dashboard header revokes the session.

### Dashboard features

- **Clients** – capture UTR, VAT, PAYE & Companies House details (scoped per firm).
- **Staff** – onboard team members with specialties.
- **Tasks** – AI-generated compliance runway, status & assignee controls.
- **Documents** – upload/download engagement letters, payroll files, VAT submissions.
- **Payments** – create Stripe checkout links and monitor completions.
- **SQL Editor** – run read-only `SELECT * FROM <table> [LIMIT n]` queries against your workspace data without leaving the app.

All sections now persist to Supabase tables through the authenticated API, so each firm only sees its own records.

## 3. AI task generation

`backend/src/services/aiService.js` still calls OpenRouter’s `openai/gpt-5-mini` model. It expects JSON responses and maps them to compliance tasks. Ensure the following headers remain for OpenRouter requirements:

- `Authorization: Bearer <OPENROUTER_API_KEY>`
- `HTTP-Referer`
- `X-Title`

## 4. Next steps & enhancements

1. **Row Level Security:** Harden Supabase by enabling RLS/policies once you’re done iterating locally.
2. **Storage:** Swap local document storage for Supabase Storage or S3 for cloud deployments.
3. **Realtime updates:** Use Supabase Realtime or Pusher to broadcast task/payment updates across active sessions.
4. **Testing:** Add Jest + React Testing Library on the frontend, Vitest for hooks, and supertest for API endpoints.
5. **CI/CD:** Configure GitHub Actions for lint/test/build and Supabase migrations.

## 5. Development notes

- The sandbox cannot run network installs, so regenerate lockfiles locally with `npm install` inside both `backend/` and `frontend/`.
- Stripe, Supabase, and OpenRouter require outbound network access when running the app.
- Preserve `.env` secrets and mount a persistent volume for `backend/uploads/` if you keep local file storage in production.
