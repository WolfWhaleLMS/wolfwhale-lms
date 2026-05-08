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
run_required npm run ops:evidence
run_required npm run scale:check
run_required npm run load:smoke
run_required npm run build

echo
echo "==> npm run security:supabase"
set +e
npm run security:supabase
security_status=$?
set -e

if [[ "$security_status" -eq 2 ]]; then
  echo "Skipped: set SUPABASE_DB_URL, DATABASE_URL, SUPABASE_DB_PASSWORD, or SUPABASE_ACCESS_TOKEN + SUPABASE_PROJECT_REF to run live Supabase launch-security checks."
elif [[ "$security_status" -ne 0 ]]; then
  exit "$security_status"
fi

echo
echo "Launch verification command completed."
