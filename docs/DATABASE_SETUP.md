# CardHoldr — Supabase database setup

This guide matches **`supabase/schema.sql`** to the current **`src/App.tsx`** Supabase calls. The script is **idempotent** (uses `IF NOT EXISTS` / `DROP POLICY IF EXISTS`); it does **not** drop tables or delete data.

## Prerequisites

1. A [Supabase](https://supabase.com) project.
2. **Authentication → Providers**: enable Google and/or Facebook if you use OAuth.
3. **Authentication → URL configuration**: add your app origin to **Redirect URLs**, e.g. `http://localhost:5173/` (and production URL).
4. App env (`.env` or Vite):

   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## 1. Apply database schema

1. Open **Supabase Dashboard → SQL Editor**.
2. Paste the contents of [`supabase/schema.sql`](../supabase/schema.sql).
3. Click **Run**.

Verify in **Table Editor** that these exist:

| Table | Used by App.tsx today |
|-------|------------------------|
| `profiles` | Yes — profile, @name, avatar URL |
| `cards` | Yes — main card `card_data`, slug, `is_public` |
| `contacts` | Yes — Rolodex `contact_data` |
| `conversations` | Yes |
| `conversation_members` | Yes — `contact_id`, `last_read_at` |
| `messages` | Yes — `message_data`, `sender_id` |
| `posts` | Yes — feed posts (Supabase-backed when configured) |
| `post_likes` | Yes — feed likes (Supabase-backed when configured) |
| `post_comments` | Yes — feed comments (Supabase-backed when configured) |
| `notifications` | Yes — load, mark read, cross-user create (likes/comments) |

## 2. Create Storage bucket: `avatars`

The app uploads profile photos to:

`POST /storage/v1/object/avatars/{userId}/avatar-{timestamp}.{ext}`

Public URL pattern:

`{SUPABASE_URL}/storage/v1/object/public/avatars/{userId}/avatar-....jpg`

### Dashboard steps (recommended)

1. **Storage → New bucket**
2. **Name:** `avatars` (exactly — case-sensitive)
3. **Public bucket:** **ON** (public read)
4. **File size limit:** `5` MB (recommended; UI may default to 50 MB — 5 MB is enough for avatars)
5. **Allowed MIME types** (if the UI asks):  
   `image/jpeg`, `image/png`, `image/webp`, `image/gif`
6. Save the bucket.

### Storage policies

After the bucket exists, run the **Storage policies** section at the bottom of `schema.sql` (or re-run the full file). Policies do the following:

| Policy | Behavior |
|--------|----------|
| Public read | Anyone can read objects in `avatars` |
| Upload | Authenticated users can upload only under folder `{their auth.uid()}/` |
| Update / delete | Same folder rule as upload |

### Manual policy check (optional)

In **Storage → avatars → Policies**, you should see policies named like `Avatars: public read`, `Avatars: owner upload`, etc.

## 3. Row Level Security summary

| Area | Who can access |
|------|----------------|
| **profiles** | Anyone can **read** (for @name search and public profiles). Only the owner can insert/update/delete their row (`id = auth.uid()`). |
| **cards** | **Read** public cards (`is_public = true`) or own cards. **Write** own rows only. |
| **contacts** | Owner only (`owner_id = auth.uid()`). |
| **conversations** | Members only (via `conversation_members`). Authenticated users can create a conversation. |
| **conversation_members** | Own rows only; `last_read_at` updated by owner. |
| **messages** | Conversation members can read; insert/update/delete only when `sender_id = auth.uid()`. |
| **posts / likes / comments** | Authenticated read; authors manage their own rows (ready when App.tsx is wired). |
| **notifications** | **Insert:** any signed-in user may create a row for any recipient (`user_id`). Optional `actor_id` must be null or `auth.uid()`. **Select / update / delete:** recipient only (`user_id = auth.uid()`). See [Cross-user notifications](#cross-user-notifications) below. |

## 4. Indexes (why they exist)

| Index | Purpose |
|-------|---------|
| `profiles_username_unique_idx` | Exact @name lookup (`findProfileByUsername`) |
| `profiles_username_lower_idx` | Case-insensitive search |
| `cards_user_id_created_at_idx` | `loadCard` — latest card per user |
| `cards_slug_idx` / `cards_public_lookup_idx` | Public slug / public card listing |
| `cards_card_data_gin_idx` | JSON search on `card_data` (username, social fields) |
| `contacts_owner_updated_at_idx` | Contact list sort |
| `conversation_members_user_contact_idx` | `ensureConversation` lookup |
| `messages_conversation_created_at_idx` | Chat history order |
| `posts_feed_sort_idx` | Feed chronological sort |
| `notifications_user_unread_idx` | Unread badge queries |

## 5. App ↔ column mapping (current code)

### `profiles`

| Column | App usage |
|--------|-----------|
| `id` | Auth user UUID |
| `username` | `profiles.username`, @name |
| `full_name` | `upsertProfile`, signup |
| `avatar_url` | Photo URL after Storage upload |
| `updated_at` | Sent on profile save |

### `cards`

| Column | App usage |
|--------|-----------|
| `user_id` | Owner |
| `slug` | Often the @name; upsert conflict key with `user_id` |
| `card_data` | Full card JSON (`name`, `username`, `avatarUrl`, `publicStack`, `privacy`, `stackPublic`, …) |
| `is_public` | `upsertCard` fourth argument |

### `contacts`

| Column | App usage |
|--------|-----------|
| `owner_id` + `id` | Composite PK; `id` matches app contact `id` |
| `contact_data` | Full contact object JSON |
| `updated_at` | Set on upsert |

### `messages`

| Column | App usage |
|--------|-----------|
| `conversation_id` + `id` | Composite PK; app uses `Date.now()` for `id` |
| `sender_id` | `auth.uid()` for `from: 'me'`; `null` for local-only “them” demo replies |
| `message_data` | `{ id, from, text, time, date, createdAt, … }` |

### `conversation_members`

| Column | App usage |
|--------|-----------|
| `user_id` + `contact_id` | Unique pair — `ensureConversation` |
| `last_read_at` | Unread state / `markConversationRead` |

### `notifications`

| Column | App usage |
|--------|-----------|
| `user_id` | Recipient (who sees the notification) |
| `actor_id` | Optional — user who triggered the event (must equal caller’s `auth.uid()` when set) |
| `notification_type` | `view`, `exchange`, `message`, or `system` (e.g. like/comment on a post) |
| `contact_id` | Optional Rolodex contact id for avatar/name in the UI |
| `body` | Notification text (e.g. `liked your post`) |
| `read` | Unread badge / mark-all-read |

### Cross-user notifications

The app creates notifications **for another user** when someone likes or comments on their post (and for other interaction hooks). That requires the **`Notifications: authenticated insert`** policy in `schema.sql`:

- Any **authenticated** user may `INSERT` a notification for **any** `user_id` (recipient).
- If `actor_id` is set, it must be **`auth.uid()`** (the inserter cannot impersonate another actor).
- **Reads stay private:** users can only `SELECT` rows where `user_id = auth.uid()`.
- **Updates / deletes** remain recipient-only (mark read, clear).

This is **not** realtime or push delivery — there is no Supabase Realtime subscription or mobile push in the app yet. Notifications appear after load/hydration or when the recipient’s client creates a local optimistic row.

Re-run the notifications section of `schema.sql` (or the full file) if cross-user inserts fail with an RLS error.

## 6. What is still local-only in the app

Feed posts, likes, and comments are now Supabase-backed when the user is logged in and Supabase is configured.  
If Supabase is missing/unavailable, feed behavior falls back to local/demo mode.

Even with this schema applied, **`src/App.tsx`** still keeps these in **localStorage** or memory:

- Demo **notifications** when Supabase is off or the table is empty (`NOTIFS` seed)
- Sample **threads** for seed contacts → `ch_threads` + demo auto-replies
- **Realtime / push** for notifications (client polls on hydrate only)
- **TeamVue posts** remain demo/local only

## 7. Deployment checklist

Before deploying, confirm all of the following:

- Set `VITE_SUPABASE_URL` in your host environment variables.
- Set `VITE_SUPABASE_ANON_KEY` in your host environment variables.
- Add your deployed site URL **with trailing slash** to Supabase Auth Redirect URLs.
- Add your local dev URL **with trailing slash** (if needed), e.g. `http://127.0.0.1:5173/`.
- Create the `avatars` storage bucket in Supabase.
- Run `supabase/schema.sql` in Supabase SQL Editor.
- Confirm SPA rewrites are active on your host (e.g. Vercel/Netlify) so deep links refresh to `index.html`.

## 8. Troubleshooting

| Symptom | Check |
|---------|--------|
| OAuth works but no data saves | `VITE_SUPABASE_*` env vars; run `schema.sql` |
| @name search empty | `profiles` + `cards` RLS; user logged in |
| Avatar upload fails | Bucket name `avatars`, public bucket, storage policies, 5 MB limit |
| Messages not saving | `conversations` / `messages` tables exist; contact is not `isSeed`; contact `source` is `scanned`, `manual`, or `exchange` |
| `merge-duplicates` on cards fails | Unique constraint `(user_id, slug)` must exist |
| Like/comment does not notify post owner | Re-run `schema.sql`; confirm **`Notifications: authenticated insert`** policy exists |
| Cross-user notification insert denied | Old policy required `auth.uid() = user_id`; apply updated insert policy from `schema.sql` |

## 9. Re-running the schema

Safe to run `schema.sql` again when adding policies or indexes. It will **not** truncate or drop tables. If you need a clean slate in a dev project, delete tables manually in the Dashboard (not covered here).
