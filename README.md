# Ma & Co Accountants – Compliance CRM SaaS

A navy & gold practice cockpit for Ma & Co Accountants. The platform combines a marketing homepage with an internal dashboard that orchestrates clients, staff, compliance workflows, document storage, and Stripe-powered billing. AI (via OpenRouter) generates compliance schedules tailored to each client profile.

## Project layout

```
ma-co-saas/
├── backend/          # Express API (AI, compliance tasks, documents, Stripe)
├── frontend/         # Vite + React client (homepage + dashboard)
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
```

> ⚠️ The OpenRouter key supplied by Ma & Co should be kept secret. Store it in `.env`, never in committed files.

### Install & run

```bash
cd backend
npm install
npm run dev
```

Key endpoints:

- `GET /health` – health check
- `GET /api/clients` – list clients (`POST/PUT/DELETE` also available)
- `POST /api/tasks/generate` – call OpenRouter (GPT‑5 mini) for task suggestions
- `POST /api/documents` – upload files (stored locally in `backend/uploads/`)
- `POST /api/payments/checkout-session` – create Stripe Checkout session
- `POST /api/webhooks/stripe` – receive Stripe CLI events (requires raw body)

The lightweight datastore persists to `backend/src/data/store.json`; it is suitable for prototyping and can be swapped for PostgreSQL later.

### Stripe CLI (local testing)

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and log in.
2. Start the backend on port 4000, then in a new shell:
   ```bash
   stripe listen --forward-to localhost:4000/api/webhooks/stripe
   ```
3. Create a checkout link from the dashboard; the CLI will surface webhook confirmations.

## 2. Frontend (Vite + React)

### Install & run

```bash
cd frontend
npm install
npm run dev
```

The dev server proxies `/api/*` to `http://localhost:4000`, so both apps should run concurrently (ports 5173 + 4000).

### Features

- **Homepage** – modern navy & gold marketing site introducing the Ma & Co CRM.
- **Dashboard** (`/dashboard`) – Monday-style board with sidebar sections:
  - *Clients* – capture UTR, VAT, PAYE & Companies House details.
  - *Staff* – onboard team members with specialties.
  - *Tasks* – AI-generated compliance runway, drag column substitutes via status dropdowns.
  - *Documents* – upload/download engagement letters, payroll files, VAT submissions.
  - *Payments* – create Stripe checkout links, track payment history.

The UI stores state via API calls; Stripe checkout links open in a new tab. Document downloads stream straight from the backend.

## 3. AI task generation

`backend/src/services/aiService.js` calls OpenRouter’s `openai/gpt-5-mini` model. It expects JSON responses and maps them to compliance tasks. Ensure the following headers remain for OpenRouter requirements:

- `Authorization: Bearer <OPENROUTER_API_KEY>`
- `HTTP-Referer`
- `X-Title`

## 4. Next steps & enhancements

1. **Authentication:** Add Clerk/Auth0 or NextAuth for secure multi-user access.
2. **Database upgrade:** Replace the JSON datastore with PostgreSQL + Prisma.
3. **Realtime updates:** Socket.io or Pusher to broadcast task/ payment status changes.
4. **File storage:** Swap local uploads for S3/Backblaze to support multi-instance deployments.
5. **Testing:** Add Jest + React Testing Library on the frontend, Vitest for hooks, and supertest for API endpoints.

## 5. Development notes

- This repository was generated without installing dependencies or running builds due to the current sandbox network restrictions. Run `npm install` inside `backend/` and `frontend/` locally before starting development.
- Stripe and OpenRouter require live network access; ensure your environment has outbound connectivity when running the app.
- When deploying, configure environment variables securely and mount a persistent volume for `backend/uploads/` if local storage persists.
