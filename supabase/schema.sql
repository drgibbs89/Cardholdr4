-- CardHoldr Supabase schema (idempotent — safe to re-run; does not DROP existing objects)
-- Matches src/App.tsx REST/Storage usage as of this repo.
-- Apply in Supabase SQL Editor or: psql "$DATABASE_URL" -f supabase/schema.sql

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles (auth.users 1:1 — username, avatar, display name)
-- App: upsertProfile, loadProfile, findProfileByUsername, searchCardholdrProfiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (
    username is null or username ~ '^[a-z0-9][a-z0-9_.-]{0,31}$'
  )
);

create unique index if not exists profiles_username_unique_idx
  on public.profiles (username)
  where username is not null;

create index if not exists profiles_username_lower_idx
  on public.profiles (lower(username))
  where username is not null;

create index if not exists profiles_updated_at_idx
  on public.profiles (updated_at desc);

-- ---------------------------------------------------------------------------
-- cards (user business card JSON + public slug)
-- App: upsertCard (merge on user_id+slug), loadCard, public search on card_data
-- ---------------------------------------------------------------------------
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null,
  card_data jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

create index if not exists cards_user_id_created_at_idx
  on public.cards (user_id, created_at desc);

create index if not exists cards_slug_idx
  on public.cards (slug);

create index if not exists cards_public_lookup_idx
  on public.cards (is_public, updated_at desc)
  where is_public = true;

create index if not exists cards_card_data_gin_idx
  on public.cards using gin (card_data);

-- ---------------------------------------------------------------------------
-- contacts (owner-scoped Rolodex entries)
-- App: loadContacts, upsertContact, deleteContact — PK (owner_id, id), contact_data jsonb
-- ---------------------------------------------------------------------------
create table if not exists public.contacts (
  owner_id uuid not null references auth.users (id) on delete cascade,
  id bigint not null,
  contact_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (owner_id, id)
);

create index if not exists contacts_owner_id_idx
  on public.contacts (owner_id);

create index if not exists contacts_owner_updated_at_idx
  on public.contacts (owner_id, updated_at desc);

-- ---------------------------------------------------------------------------
-- conversations + members + messages
-- App: ensureConversation, conversation_members (contact_id, last_read_at), messages (message_data)
-- ---------------------------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists conversations_updated_at_idx
  on public.conversations (updated_at desc);

create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  contact_id bigint not null,
  last_read_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (conversation_id, user_id),
  unique (user_id, contact_id),
  foreign key (user_id, contact_id) references public.contacts (owner_id, id) on delete cascade
);

create index if not exists conversation_members_user_id_idx
  on public.conversation_members (user_id);

create index if not exists conversation_members_conversation_id_idx
  on public.conversation_members (conversation_id);

create index if not exists conversation_members_user_contact_idx
  on public.conversation_members (user_id, contact_id);

create table if not exists public.messages (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  id bigint not null,
  sender_id uuid references auth.users (id) on delete set null,
  message_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  primary key (conversation_id, id)
);

create index if not exists messages_conversation_created_at_idx
  on public.messages (conversation_id, created_at asc);

create index if not exists messages_sender_id_idx
  on public.messages (sender_id)
  where sender_id is not null;

-- ---------------------------------------------------------------------------
-- feed: posts, likes, comments (schema for future App.tsx wiring; currently localStorage)
-- App UI shape: { id, contactId, isOwn, text, time, likes, liked, comments[] }
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id bigint primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  contact_id bigint,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_feed_sort_idx
  on public.posts (created_at desc);

create index if not exists posts_user_id_idx
  on public.posts (user_id, created_at desc);

create table if not exists public.post_likes (
  post_id bigint not null references public.posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists post_likes_user_id_idx
  on public.post_likes (user_id);

create table if not exists public.post_comments (
  id bigint primary key,
  post_id bigint not null references public.posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists post_comments_post_created_at_idx
  on public.post_comments (post_id, created_at asc);

create index if not exists post_comments_user_id_idx
  on public.post_comments (user_id);

-- ---------------------------------------------------------------------------
-- notifications (recipient user_id; optional actor_id = who triggered the event)
-- App UI shape: { id, type, contactId, text, time, read }
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id bigint generated by default as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  actor_id uuid references auth.users (id) on delete set null,
  notification_type text not null,
  contact_id bigint,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now(),
  constraint notifications_type_check check (
    notification_type in ('view', 'exchange', 'message', 'system')
  )
);

-- Idempotent column add for projects created before actor_id existed
alter table public.notifications
  add column if not exists actor_id uuid references auth.users (id) on delete set null;

create index if not exists notifications_user_unread_idx
  on public.notifications (user_id, read, created_at desc);

create index if not exists notifications_user_created_at_idx
  on public.notifications (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists cards_set_updated_at on public.cards;
create trigger cards_set_updated_at
  before update on public.cards
  for each row execute function public.set_updated_at();

drop trigger if exists contacts_set_updated_at on public.contacts;
create trigger contacts_set_updated_at
  before update on public.contacts
  for each row execute function public.set_updated_at();

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.cards enable row level security;
alter table public.contacts enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.notifications enable row level security;

-- profiles: owner write; readable for discovery & public /@username pages
drop policy if exists "Profiles: public read" on public.profiles;
create policy "Profiles: public read"
  on public.profiles for select
  using (true);

drop policy if exists "Profiles: owner insert" on public.profiles;
create policy "Profiles: owner insert"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Profiles: owner update" on public.profiles;
create policy "Profiles: owner update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Profiles: owner delete" on public.profiles;
create policy "Profiles: owner delete"
  on public.profiles for delete
  using (auth.uid() = id);

-- cards: owner full access; public cards readable when is_public
drop policy if exists "Cards: read public or own" on public.cards;
create policy "Cards: read public or own"
  on public.cards for select
  using (is_public = true or auth.uid() = user_id);

drop policy if exists "Cards: owner insert" on public.cards;
create policy "Cards: owner insert"
  on public.cards for insert
  with check (auth.uid() = user_id);

drop policy if exists "Cards: owner update" on public.cards;
create policy "Cards: owner update"
  on public.cards for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Cards: owner delete" on public.cards;
create policy "Cards: owner delete"
  on public.cards for delete
  using (auth.uid() = user_id);

-- contacts: owner only
drop policy if exists "Contacts: owner manage" on public.contacts;
create policy "Contacts: owner manage"
  on public.contacts for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- conversations: visible if user is a member
drop policy if exists "Conversations: member read" on public.conversations;
create policy "Conversations: member read"
  on public.conversations for select
  using (
    exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = id and cm.user_id = auth.uid()
    )
  );

drop policy if exists "Conversations: authenticated create" on public.conversations;
create policy "Conversations: authenticated create"
  on public.conversations for insert
  with check (auth.uid() is not null);

drop policy if exists "Conversations: member update" on public.conversations;
create policy "Conversations: member update"
  on public.conversations for update
  using (
    exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = id and cm.user_id = auth.uid()
    )
  );

-- conversation_members: own rows only
drop policy if exists "Conversation members: own read" on public.conversation_members;
create policy "Conversation members: own read"
  on public.conversation_members for select
  using (auth.uid() = user_id);

drop policy if exists "Conversation members: own insert" on public.conversation_members;
create policy "Conversation members: own insert"
  on public.conversation_members for insert
  with check (auth.uid() = user_id);

drop policy if exists "Conversation members: own update" on public.conversation_members;
create policy "Conversation members: own update"
  on public.conversation_members for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Conversation members: own delete" on public.conversation_members;
create policy "Conversation members: own delete"
  on public.conversation_members for delete
  using (auth.uid() = user_id);

-- messages: members of the conversation can read; sender inserts own (sender_id = auth.uid())
drop policy if exists "Messages: member read" on public.messages;
create policy "Messages: member read"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = conversation_id and cm.user_id = auth.uid()
    )
  );

drop policy if exists "Messages: member insert own" on public.messages;
create policy "Messages: member insert own"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = conversation_id and cm.user_id = auth.uid()
    )
  );

drop policy if exists "Messages: member update own" on public.messages;
create policy "Messages: member update own"
  on public.messages for update
  using (sender_id = auth.uid())
  with check (sender_id = auth.uid());

drop policy if exists "Messages: member delete own" on public.messages;
create policy "Messages: member delete own"
  on public.messages for delete
  using (sender_id = auth.uid());

-- posts: authenticated read feed; author manages own posts
drop policy if exists "Posts: authenticated read" on public.posts;
create policy "Posts: authenticated read"
  on public.posts for select
  using (auth.uid() is not null);

drop policy if exists "Posts: author insert" on public.posts;
create policy "Posts: author insert"
  on public.posts for insert
  with check (auth.uid() = user_id);

drop policy if exists "Posts: author update" on public.posts;
create policy "Posts: author update"
  on public.posts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Posts: author delete" on public.posts;
create policy "Posts: author delete"
  on public.posts for delete
  using (auth.uid() = user_id);

-- post_likes
drop policy if exists "Post likes: authenticated read" on public.post_likes;
create policy "Post likes: authenticated read"
  on public.post_likes for select
  using (auth.uid() is not null);

drop policy if exists "Post likes: user manage own" on public.post_likes;
create policy "Post likes: user manage own"
  on public.post_likes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- post_comments
drop policy if exists "Post comments: authenticated read" on public.post_comments;
create policy "Post comments: authenticated read"
  on public.post_comments for select
  using (auth.uid() is not null);

drop policy if exists "Post comments: author insert" on public.post_comments;
create policy "Post comments: author insert"
  on public.post_comments for insert
  with check (auth.uid() = user_id);

drop policy if exists "Post comments: author update" on public.post_comments;
create policy "Post comments: author update"
  on public.post_comments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Post comments: author delete" on public.post_comments;
create policy "Post comments: author delete"
  on public.post_comments for delete
  using (auth.uid() = user_id);

-- notifications: authenticated users may create rows for any recipient (user_id).
-- Optional actor_id must be null or equal auth.uid() when provided.
-- Recipients can only read/update/delete their own notifications (user_id = auth.uid()).
drop policy if exists "Notifications: own read" on public.notifications;
create policy "Notifications: own read"
  on public.notifications for select
  using (auth.uid() = user_id);

drop policy if exists "Notifications: own update" on public.notifications;
create policy "Notifications: own update"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Notifications: insert for self or system" on public.notifications;
drop policy if exists "Notifications: authenticated insert" on public.notifications;
create policy "Notifications: authenticated insert"
  on public.notifications for insert
  with check (
    auth.uid() is not null
    and (actor_id is null or actor_id = auth.uid())
  );

drop policy if exists "Notifications: own delete" on public.notifications;
create policy "Notifications: own delete"
  on public.notifications for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Storage: avatars bucket policies (run AFTER creating bucket — see docs/DATABASE_SETUP.md)
-- Paths used by App.tsx: {userId}/avatar-{timestamp}.{ext}
-- ---------------------------------------------------------------------------
drop policy if exists "Avatars: public read" on storage.objects;
create policy "Avatars: public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Avatars: owner upload" on storage.objects;
create policy "Avatars: owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Avatars: owner update" on storage.objects;
create policy "Avatars: owner update"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Avatars: owner delete" on storage.objects;
create policy "Avatars: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
