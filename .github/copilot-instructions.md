# GitHub Copilot – Repository Instructions

> Place this file at `.github/copilot-instructions.md` in the repo. Keep statements concise and action‑oriented. Copilot should follow these unless code in the repo explicitly contradicts them.

---

## Project snapshot

- **Framework:** Next.js (App Router). Prefer **Server Components**; add `"use client"` only when a browser API or client state is required.
- **Language:** TypeScript (strict). Generate types and reuse them end‑to‑end.
- **UI:** shadcn/ui + Tailwind CSS. Follow shadcn composition patterns; keep components accessible.
- **Data:** Prisma ORM with PostgreSQL.
- **Storage:** DigitalOcean Spaces (S3‑compatible) via AWS SDK v3 `@aws-sdk/client-s3`.

## General rules Copilot must follow

1. **Read first**: Before generating code, examine relevant files (e.g., `package.json`, `prisma/schema.prisma`, `src/app/**`, `src/components/**`, `tailwind.config.ts`, `.env.example`). Align with existing patterns.
2. **TypeScript**: Use explicit types, `satisfies` where appropriate, and `zod`/`valibot` for input validation when touching API endpoints or actions.
3. **Next.js**:
   - Prefer **Server Actions** for mutations when possible; otherwise use API route handlers under `app/**/route.ts`.
   - Keep RSC boundaries small; pass plain data (no class instances) across the boundary.
   - Use dynamic rendering only if needed; default to static/SSR as dictated by existing routes.
4. **shadcn/ui + Tailwind**:
   - Compose primitives; don’t fork library internals.
   - Keep class names tidy; prefer utility extraction (e.g., `cn()` helper) over long inline classes.
   - Ensure keyboard and screen‑reader accessibility (labels, `aria-*`, focus management).
5. **Prisma**:
   - Never inline raw SQL unless necessary; prefer Prisma Client.
   - Use `include`/`select` minimally; avoid N+1 queries (batch or `include` appropriately).
   - Wrap multi‑step writes in `prisma.$transaction`.
6. **PostgreSQL**:
   - Reuse the singleton Prisma client (no new client per request). Avoid long transactions.
   - Index columns used in filters/joins and keep migrations in `prisma/migrations`.
7. **Object storage (Spaces)**:
   - Use presigned URLs for uploads/downloads; do **not** proxy large file streams through the app unless necessary.
   - Enforce content‑type/size validation server‑side. Sanitize file names, and **store the original file name** (`originalName`) alongside the key. Store only canonical public URLs/keys in DB.
8. **Security**:
   - Never hardcode secrets or bucket names; use env vars and update `.env.example`.
   - Validate all untrusted input on the server. Escape user content when rendering.
   - Follow least privilege for IAM keys (read/write prefixes, limited lifetimes for presigned URLs).

## Security

- **Authentication:** Uses **Better Auth** with **email and password** as the only sign-in method.
- Store password hashes securely using **bcrypt** only in the user table.
- Ensure email verification and session handling follow Better Auth best practices.

9. **Testing & quality**:
   - **Only add unit tests for server-side business logic.**
   - **No database integration tests.** Stub Prisma or inject repositories to test logic in isolation.
   - **No API/route handler tests.** Focus on pure functions and server actions logic.
   - Keep tests deterministic; avoid real I/O.
10. **Docs & PRs**:

- When creating a feature, update README/docs and add migration notes if schema changes.
- For PRs, include: what/why, screenshots (UI), how to test, and migration steps.

## Environment & configuration

- Provide or update `.env.example` any time a new variable is introduced.
- Typical variables (adjust to actual project):
  - `DATABASE_URL` – Postgres connection
  - `S3_ENDPOINT` (e.g., `https://<space>.<region>.digitaloceanspaces.com`) - `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
  - Auth/session variables if applicable (e.g., `NEXTAUTH_URL`, `NEXTAUTH_SECRET`)

## Preferred libraries & patterns

- **Forms:** Use **React Hook Form** with **Zod** for schema validation. Define Zod schemas in shared modules and use them for both form validation and server-side input parsing.
- **HTTP**: fetch/`next` runtime; avoid axios unless the repo already uses it.
- **Validation**: `zod` schemas shared between client/server where feasible.
- **Dates**: `date-fns` over heavy alternatives.
- **State**: Prefer server state via loaders; on client use React hooks or lightweight state libs already present.

## File/Folder conventions (adapt to repo)

- `docs/` – project documentation folder containing specifications, notes, and planning artifacts.
  - `docs/epic/` – stores all epics for the program; ensure each new feature has a corresponding epic document created or updated before development begins.
- `src/app/(routes)/...` – routes and route handlers
- `src/components/ui` – shadcn primitives
- `src/lib` – utilities (e.g., `cn`, S3 client, auth helpers)
- `src/server` – server‑only modules (db, actions)
- `prisma/schema.prisma` – data models and relations

## S3/Spaces usage blueprint

- Create a **server‑only** module `src/server/clients/s3.ts` exporting a singleton `S3Client` configured from env.
- Provide helpers: `createPresignedUploadUrl({ key, contentType, maxSize })` and `getPresignedDownloadUrl({ key, expiresIn })`.
- Keys should be namespaced by resource and user: `uploads/{userId}/{yyyymmdd}/{uuid}-{safeName}`.
- On upload completion, persist `{ key, originalName, contentType, size, checksum }` to Postgres.

## Prisma usage blueprint

- Use a single `prisma` instance (prevent hot‑reload leaks in dev):
  ```ts
  // src/server/db.ts
  import { PrismaClient } from '@prisma/client';
  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
  export const prisma = globalForPrisma.prisma ?? new PrismaClient();
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
  ```
- Prefer **data mappers** or **repository** helpers in `src/server/repos/**` to isolate queries.

## API & actions blueprint

- For route handlers under `app/**/route.ts`:
  - Parse/validate input with `zod`.
  - Use `NextResponse.json` and proper status codes.
  - Never expose raw errors; map to safe messages and log details server‑side.
- For **Server Actions**:
  - Mark `"use server"`. Validate input, authorize user, run Prisma calls, return serializable results.

## Tailwind & shadcn guidelines

- Keep UI atomic; compose primitives for complex components.
- Extract repeated class lists into utilities or variant helpers.
- Ensure color/contrast meets WCAG; include focus styles and keyboard paths.

## What to do when uncertain

- Inspect existing code for precedents and mimic them.
- Ask clarifying questions in PR description or TODO comments **only** where ambiguity remains after reading the repo.
- Generate a short plan before large changes (list files to touch, data model diffs, and tests).

## Ready‑to‑use snippets

### DigitalOcean Spaces client (server‑only)

```ts
// src/server/clients/s3.ts
import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT!,
  forcePathStyle: false,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});
```

### Generate a presigned upload URL

```ts
// src/server/storage/presign.ts
'use server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '../clients/s3';

export async function createPresignedUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    ContentType: contentType,
    ACL: 'private',
  });
  return getSignedUrl(s3, command, { expiresIn: 60 * 5 });
}
```

### Safe Prisma singleton

```ts
// src/server/db.ts
import { PrismaClient } from '@prisma/client';
const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') g.prisma = prisma;
```

---

### Path‑specific instruction hooks (optional)

> If using path‑specific instructions, create `.github/instructions/<name>.instructions.md` with frontmatter like:

```md
---
applyTo:
  - 'src/server/storage/**'
---

In storage code:

- Only import from `src/server/clients/s3` for S3 access.
- Use presigned URLs; never expose bucket credentials in client code.
```

---

**Tone & style**: Generate code that is idiomatic, minimal, and readable. Prefer composition over configuration. Add comments only when intent isn’t obvious.
