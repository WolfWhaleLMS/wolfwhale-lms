#!/usr/bin/env bash
set -euo pipefail

DB_URL="${SUPABASE_DB_URL:-${DATABASE_URL:-}}"
if [[ -z "$DB_URL" ]]; then
  echo "Set SUPABASE_DB_URL or DATABASE_URL before seeding test accounts." >&2
  exit 2
fi

psql "$DB_URL" -v ON_ERROR_STOP=1 -f supabase/seed_test_accounts.sql

echo "Test accounts seeded."
