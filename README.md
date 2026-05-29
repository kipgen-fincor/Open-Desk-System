# Open-Desk-System
=======
# Fincor DeskZilla

Next.js + TypeScript + Supabase desk and meeting-room booking system.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Add your Supabase project URL and anon key from Supabase Project Settings > API.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:3000`.

## Supabase

Run the full database setup from:

`supabase/migrations/20260527001000_desk_booking_system.sql`

It creates:

- `profiles` with `user` and `admin` roles
- `resources` for A-1 to A-18, B-1 to B-12, and MR-1 to MR-7
- `bookings` with `reserved`, `booked`, `completed`, and `cancelled` statuses
- RLS policies and RPC functions for booking, cancellation, reassignment, and rescheduling
- overlap protection so the same seat or meeting room cannot be booked across intersecting times
- a cleanup function for cancelled and old day activity

To make a user an admin after they register and verify email:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@yourcompany.com';
```

For email verification, enable Supabase Auth > Providers > Email > Confirm email.

For daily cleanup at 12 PM, enable `pg_cron` in Supabase Database Extensions and run the commented `cron.schedule` command at the bottom of the migration.

## Useful commands

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
```

## Deployment

Add the same environment variables in Vercel Project Settings > Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` only if you add server-only admin tasks
- `NEXT_PUBLIC_SITE_URL`
