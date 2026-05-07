#!/usr/bin/env bash
set -euo pipefail

run_required() {
  echo
  echo "==> $*"
  "$@"
}

run_required npm run lint
run_required npm run typecheck
run_required npm test
run_required npm run district:verify
run_required npm run enterprise:check
run_required npm run scale:check
run_required npm run load:smoke
run_required npm run build

echo
echo "==> npm run security:supabase"
if [[ -n "${SUPABASE_DB_URL:-}" || -n "${DATABASE_URL:-}" ]]; then
  npm run security:supabase
else
  echo "Skipped: set SUPABASE_DB_URL or DATABASE_URL to run live Supabase launch-security checks."
fi

echo
echo "Launch verification command completed."
