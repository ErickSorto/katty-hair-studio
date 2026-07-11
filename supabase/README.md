# Katty Hair Studio booking database

1. Create a Supabase project owned by the business (or add the business as an owner later).
2. Open **SQL Editor**, paste the migration in `migrations/20260710193000_booking_foundation.sql`,
   and run it once.
3. From the Supabase project's **Connect** dialog, copy the Project URL and server secret key into:

   ```text
   SUPABASE_URL=
   SUPABASE_SECRET_KEY=
   ```

   The secret key is server-only. Never prefix it with `NEXT_PUBLIC_`.

4. Add `ADMIN_SETUP_TOKEN` using a randomly generated value:

   ```bash
   openssl rand -base64 32
   ```

5. Reconnect Google OAuth after adding the `calendar.calendars` and `calendar.acls` scopes. The
   provisioning endpoint can then create the Operations calendar, create one appointment calendar
   per staff member, share calendars, save Calendar IDs, map services, and write weekly availability.

All exposed tables have RLS enabled and no anonymous or authenticated browser policies. Application
access uses the server-only Supabase secret through Next.js Route Handlers.
