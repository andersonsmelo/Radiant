create table if not exists auth_password_reset_tokens (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references app_users (id) on delete cascade,
    token_hash text not null unique,
    expires_at timestamptz not null,
    consumed_at timestamptz,
    created_at timestamptz not null default now()
);

create index if not exists idx_auth_password_reset_tokens_active
    on auth_password_reset_tokens (token_hash, expires_at)
    where consumed_at is null;

create index if not exists idx_auth_password_reset_tokens_user_id
    on auth_password_reset_tokens (user_id, created_at desc);
