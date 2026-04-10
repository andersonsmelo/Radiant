create extension if not exists pgcrypto;

create table if not exists app_users (
    id uuid primary key default gen_random_uuid(),
    email text not null unique,
    password_hash text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists auth_refresh_tokens (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references app_users (id) on delete cascade,
    token_hash text not null unique,
    expires_at timestamptz not null,
    revoked_at timestamptz,
    created_at timestamptz not null default now()
);

create table if not exists user_profiles (
    user_id uuid primary key references app_users (id) on delete cascade,
    display_name text,
    profession text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists content_tracks (
    id text primary key,
    slug text not null unique,
    title text not null,
    description text not null,
    sort_order integer not null default 0,
    is_published boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists content_lessons (
    id text primary key,
    track_id text not null references content_tracks (id) on delete restrict,
    slug text not null unique,
    title text not null,
    difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
    sort_order integer not null default 0,
    content_version text not null,
    payload jsonb not null,
    is_published boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists lesson_progress (
    user_id uuid not null references app_users (id) on delete cascade,
    lesson_id text not null references content_lessons (id) on delete cascade,
    status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
    attempts_count integer not null default 0,
    best_score integer not null default 0,
    last_score integer not null default 0,
    last_answered_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (user_id, lesson_id)
);

create table if not exists review_cards (
    user_id uuid not null references app_users (id) on delete cascade,
    lesson_id text not null references content_lessons (id) on delete cascade,
    ease_factor numeric(4,2) not null default 2.50,
    interval_days integer not null default 0,
    repetitions integer not null default 0,
    next_review_at timestamptz not null default now(),
    last_reviewed_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (user_id, lesson_id)
);

create table if not exists user_preferences (
    user_id uuid primary key references app_users (id) on delete cascade,
    notifications_enabled boolean not null default false,
    character_enabled boolean not null default true,
    reduce_motion_override boolean,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_auth_refresh_tokens_user_id
    on auth_refresh_tokens (user_id);

create index if not exists idx_auth_refresh_tokens_active
    on auth_refresh_tokens (token_hash, expires_at)
    where revoked_at is null;
