#!/usr/bin/env bash
set -euo pipefail

if [[ "${RESTORE_DRILL_CONFIRM:-}" != "restore-non-production" ]]; then
  echo "Set RESTORE_DRILL_CONFIRM=restore-non-production to run a restore drill." >&2
  exit 2
fi

if [[ -z "${RESTORE_DRILL_DB_URL:-}" ]]; then
  echo "Set RESTORE_DRILL_DB_URL to a disposable non-production database." >&2
  exit 2
fi

if [[ -z "${BACKUP_FILE:-}" || ! -f "${BACKUP_FILE}" ]]; then
  echo "Set BACKUP_FILE to an existing pg_dump custom-format backup." >&2
  exit 2
fi

case "$RESTORE_DRILL_DB_URL" in
  *supabase.co*|*pooler.supabase.com*)
    echo "Refusing to restore into a Supabase-hosted URL. Use a disposable local/staging drill database." >&2
    exit 3
    ;;
esac

pg_restore \
  --clean \
  --if-exists \
  --no-owner \
  --no-acl \
  --dbname "$RESTORE_DRILL_DB_URL" \
  "$BACKUP_FILE"

psql "$RESTORE_DRILL_DB_URL" -v ON_ERROR_STOP=1 -c "select count(*) as tenants from public.tenants;"

echo "Restore drill completed against non-production database."
