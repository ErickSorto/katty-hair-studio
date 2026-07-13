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

5. Configure Google OAuth with only these non-sensitive scopes:

   ```text
   https://www.googleapis.com/auth/calendar.app.created
   https://www.googleapis.com/auth/calendar.freebusy
   https://www.googleapis.com/auth/calendar.calendarlist.readonly
   ```

6. Connect the salon owner's Google account, then call the provisioning endpoint. It creates the
   Operations calendar and one appointment calendar per staff member, saves their Calendar IDs,
   maps services, and writes weekly availability. If a manager or staff member needs direct Google
   Calendar access, use Google Calendar on a computer to share the returned calendar with the
   response's `shareWith` addresses. Use **See all event details** for view-only staff. Reserve
   **Make changes to events** for trusted managers who need to add or clear blocks, because that
   permission can also edit customer appointment events. Calendar sharing remains manual so the
   app does not request an ACL management scope.

All exposed tables have RLS enabled and no anonymous or authenticated browser policies. Application
access uses the server-only Supabase secret through Next.js Route Handlers.
