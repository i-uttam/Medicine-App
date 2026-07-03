# Wholesale Pharma App

A B2B wholesale pharmacy platform. Mobile app (Expo/React Native) for browsing and ordering medicines, backed by an Express API server and a Supabase (PostgreSQL) database.

## Run & Operate

- `artifacts/api-server: API Server` workflow — runs the API server (port 8080, path `/api`)
- `artifacts/pharma-app: expo` workflow — runs the Expo mobile app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `node scripts/seed.mjs` — seed the database with categories and medicines from mock data (idempotent)
- `pnpm --filter @workspace/db run push` — push DB schema changes to Supabase (dev only)

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- API: Express 5 (`artifacts/api-server`)
- Mobile: Expo / React Native with Expo Router (`artifacts/pharma-app`)
- DB: PostgreSQL (Supabase) + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle for API server)

## Where things live

- `artifacts/api-server/src/routes/` — Express route handlers (categories, medicines, auth, users, cart, wishlist, orders)
- `lib/db/src/schema/` — Drizzle table definitions (categories, medicines, users, orders, order_items, cart_items, wishlist)
- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/api-client-react/src/` — generated TanStack Query hooks (from codegen)
- `lib/api-zod/src/` — generated Zod schemas (from codegen)
- `artifacts/pharma-app/data/medicines.ts` — original mock data (also used by seed script)
- `scripts/seed.mjs` — standalone DB seed script

## Database (Supabase)

- Connection via `SUPABASE_DB_URL` secret (transaction pooler URL, port 6543)
- Tables: `categories`, `medicines`, `users`, `orders`, `order_items`, `cart_items`, `wishlist`
- Unique constraints: `(user_id, medicine_id)` on both `cart_items` and `wishlist`
- Run `pnpm --filter @workspace/db run push` after any schema change to apply to Supabase

## API Endpoints

All routes under `/api`:
- `GET /healthz` — health check
- `GET /categories` — list all categories
- `GET /categories/:id/medicines` — medicines in a category
- `GET /medicines` — list medicines (supports `?search=`, `?categoryId=`, `?prescriptionRequired=`, `?limit=`, `?offset=`)
- `GET /medicines/:id` — medicine detail
- `POST /auth/login` — phone-based login/register `{ phone, name? }`
- `GET /users/:id` / `PATCH /users/:id` — user profile
- `GET /cart/:userId` / `POST /cart` / `PATCH /cart/item/:id` / `DELETE /cart/item/:id` / `DELETE /cart/:userId`
- `GET /wishlist/:userId` / `POST /wishlist` / `DELETE /wishlist/:id`
- `GET /orders/user/:userId` / `GET /orders/:id` / `POST /orders`

## Architecture decisions

- Supabase pooler URL (Transaction mode, port 6543) required — direct connection (`db.*.supabase.co`) is not reachable from Replit
- Order creation is fully atomic (`db.transaction`) — cart is cleared in the same transaction
- Cart add is an upsert — adding an existing medicine increments qty rather than creating a duplicate
- All user-scoped routes validate IDs; negative/zero values and non-integers are rejected
- `uses` and `sideEffects` fields are stored as JSON strings in text columns for compatibility

## Gotchas

- After any schema change, run `pnpm --filter @workspace/db run push` AND restart the API server workflow
- After any OpenAPI spec change, run `pnpm --filter @workspace/api-spec run codegen` to regenerate hooks/schemas
- The seed script (`scripts/seed.mjs`) uses ON CONFLICT DO NOTHING — safe to run multiple times
- The pharma-app currently uses mock data; the API hooks from `@workspace/api-client-react` are generated but not yet wired into the app

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._
