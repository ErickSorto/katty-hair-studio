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

6. Connect the salon owner's Google account, then call the provisioning endpoint. It creates one
   `Katty Hair Studio Bookings` calendar, stores its Calendar ID, maps every active service to the
   hidden salon-team record, and optionally writes the salon's weekly availability. The default
   `maxConcurrentBookings` is `4`. Customers never select or see an individual stylist; Katty
   assigns the team internally. Calendar sharing remains manual so the app does not request an ACL
   management scope.

   ```json
   {
     "bookingCalendarName": "Katty Hair Studio Bookings",
     "maxConcurrentBookings": 4,
     "managerEmails": [],
     "availability": [
       { "dayOfWeek": 1, "startTime": "09:00", "endTime": "18:00" }
     ]
   }
   ```

7. Run every migration in filename order. The single-calendar capacity migration adds an atomic
   `reserve_salon_booking` function. The booking API uses that function so simultaneous requests
   cannot both claim the salon's final available spot.

All exposed tables have RLS enabled and no anonymous or authenticated browser policies. Application
access uses the server-only Supabase secret through Next.js Route Handlers.
