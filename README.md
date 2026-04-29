# Marketing Phone Book

A mobile-friendly contact manager for marketing executives:
- `/` Add contact details (name, organization, phone, designation, address/location, comments)
- `/phonebook` View all saved contacts

## Stack

- Next.js 16 (App Router)
- Prisma ORM
- PostgreSQL (free tier-friendly)
- Vercel deployment

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set your database URL:

```bash
DATABASE_URL="postgresql://username:password@hostname:5432/database?sslmode=require"
```

3. Push schema to database:

```bash
npm run db:push
```

4. Run development server:

```bash
npm run dev
```

## Free database option for Vercel

Recommended: **Neon (Free Tier) + PostgreSQL**

1. Create a Neon project (free).
2. Copy the Neon Postgres connection string.
3. Add it as `DATABASE_URL`:
- Local `.env`
- Vercel Project Settings -> Environment Variables
4. Run `npm run db:push` once against that DB.
5. Deploy to Vercel.

This project is already configured for PostgreSQL via Prisma, so Neon plugs in directly.

## Useful scripts

- `npm run dev` Start local app
- `npm run build` Production build
- `npm run lint` Lint code
- `npm run db:push` Sync Prisma schema to DB
- `npm run db:studio` Open Prisma Studio
