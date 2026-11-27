# EaseDrive

EaseDrive is a full-stack vehicle rental app starter built with React, Express, and SQLite. It includes renter and vehicle owner accounts, role-protected dashboards, vehicle listings and approval, date conflict checks, booking requests, manual GCash receipt review, notifications, booking messages, reviews, maintenance reports, activity logs, and administrator tools.

## Run locally

1. Install Node.js 22.5 or later (for the built-in SQLite module).
2. Copy `.env.example` to `.env` and set a long random `JWT_SECRET` before exposing the service to a network.
3. Run `npm install`, then `npm run dev`.
4. Open `http://localhost:5173`.
5. Create a normal account, then promote its email to administrator with `npm run promote-admin -- you@example.com` (restart or sign in again after promotion).

The API listens on port 4000 and creates `server/easedrive.db` on first start. SQLite is suitable for local development; choose and configure a production database, backups, secure hosting, and HTTPS before deployment. Set `CLIENT_ORIGIN` and `PORT` as needed.

## Payment and identity integrations

GCash is the only payment method represented. The current workflow stores a receipt link, leaves payment pending, and lets an administrator review it manually. The app does not initiate a GCash transfer or claim verification on its own. To accept online payments, connect a legitimate GCash-supported payment provider and verify its signed server-side callbacks before changing a payment to successful. Never expose provider secrets to the browser.

Google OAuth requires provider setup. Password recovery is implemented with expiring, attempt-limited one-time codes and one-time password reset tokens. Configure Resend with `RESEND_API_KEY` and a verified `EMAIL_FROM` sender, and Semaphore with `SEMAPHORE_API_KEY` to enable real email and SMS delivery to Philippine numbers. `SEMAPHORE_SENDER_NAME` is optional when an active default sender name is set in Semaphore. The server stores only an HMAC of each code; codes expire after 5 minutes, are invalidated on resend, and allow at most five verification attempts. Password reset requires 12 characters with upper and lowercase letters, a number, and a symbol. Recovery requests return a generic response to avoid account enumeration. Account passwords are hashed with bcrypt; JWT_SECRET must be set in production. Admin bootstrap intentionally requires an operator to promote an already registered account from the command line.

Vehicle photos accept JPG, JPEG, PNG, and WEBP uploads up to 5 MB each, with 8 photos and 24 MB total per vehicle. Uploads are checked by their file signatures, associated with a vehicle, previewed and managed by the owner, and reviewed by an administrator before the listing becomes public. Without cloud credentials, images are stored in the ignored `server/uploads/` directory for local development. For Supabase Storage, configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_STORAGE_BUCKET` in `.env`; keep the service role key server-side and configure the bucket for public reads of vehicle listings. Image URLs, ordering, primary image, upload metadata, and moderation state are stored in `vehicle_images`.

## Data model

`server/schema.sql` defines users and staff profiles, vehicles and images, bookings, GCash payments and transactions, notifications, messages, reviews, availability blocks, maintenance records, and activity logs. Booking creation checks date overlaps inside a SQLite transaction. Staff queries are scoped to their own vehicle ownership; renter and administrator operations are protected by role checks.
