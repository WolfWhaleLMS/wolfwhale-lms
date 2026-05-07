#!/usr/bin/env bash
set -euo pipefail

DB_URL="${SUPABASE_DB_URL:-${DATABASE_URL:-}}"
if [[ -z "$DB_URL" ]]; then
  echo "Set SUPABASE_DB_URL or DATABASE_URL before running a database backup." >&2
  exit 2
fi

mkdir -p backups
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
output="backups/wolfwhale-${timestamp}.dump"

pg_dump \
  --format=custom \
  --no-owner \
  --no-acl \
  --file "$output" \
  "$DB_URL"

shasum -a 256 "$output" > "${output}.sha256"

echo "Backup written: $output"
echo "Checksum written: ${output}.sha256"
