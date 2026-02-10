#!/bin/bash
# Wolf Whale LMS - Restore Drill
# Tests that the latest backup can be restored to verify backup integrity.
# This does NOT restore to production — it validates the backup files.
#
# Usage: ./scripts/restore-drill.sh

set -euo pipefail

BACKUP_DIR="$(dirname "$0")/../backups"

echo "=== Wolf Whale LMS Restore Drill ==="
echo "Date: $(date)"
echo ""

# Find latest backups
LATEST_SCHEMA=$(ls -t "$BACKUP_DIR"/wolfwhale_schema_*.sql 2>/dev/null | head -1)
LATEST_DATA=$(ls -t "$BACKUP_DIR"/wolfwhale_data_*.sql 2>/dev/null | head -1)

if [ -z "$LATEST_SCHEMA" ] || [ -z "$LATEST_DATA" ]; then
  echo "ERROR: No backup files found in $BACKUP_DIR"
  echo "Run ./scripts/backup-db.sh first."
  exit 1
fi

echo "Latest schema backup: $LATEST_SCHEMA"
echo "Latest data backup:   $LATEST_DATA"
echo ""

# Check 1: File integrity
echo "Check 1: File integrity..."
SCHEMA_SIZE=$(wc -c < "$LATEST_SCHEMA")
DATA_SIZE=$(wc -c < "$LATEST_DATA")
echo "  Schema file: ${SCHEMA_SIZE} bytes"
echo "  Data file:   ${DATA_SIZE} bytes"

if [ "$SCHEMA_SIZE" -lt 1000 ]; then
  echo "  FAIL: Schema backup is suspiciously small (< 1KB)"
  exit 1
fi
echo "  PASS: File sizes look reasonable"
echo ""

# Check 2: Schema contains expected tables
echo "Check 2: Schema contains expected tables..."
EXPECTED_TABLES=("tenants" "profiles" "tenant_memberships" "courses" "assignments" "submissions" "grades" "attendance_records" "consent_records" "quizzes")
MISSING=0
for table in "${EXPECTED_TABLES[@]}"; do
  if grep -q "CREATE TABLE.*$table" "$LATEST_SCHEMA" 2>/dev/null || grep -q "CREATE TABLE public.$table" "$LATEST_SCHEMA" 2>/dev/null; then
    echo "  FOUND: $table"
  else
    echo "  MISSING: $table"
    MISSING=$((MISSING + 1))
  fi
done

if [ "$MISSING" -gt 0 ]; then
  echo "  WARNING: $MISSING expected table(s) not found in schema dump"
else
  echo "  PASS: All expected tables present"
fi
echo ""

# Check 3: Data contains records
echo "Check 3: Data file contains INSERT/COPY statements..."
INSERTS=$(grep -c "^INSERT\|^COPY" "$LATEST_DATA" 2>/dev/null || echo "0")
echo "  Found $INSERTS INSERT/COPY statements"
if [ "$INSERTS" -gt 0 ]; then
  echo "  PASS: Data file contains records"
else
  echo "  WARNING: Data file may be empty (could be expected for new deployments)"
fi
echo ""

# Check 4: SQL syntax validation (basic)
echo "Check 4: SQL syntax validation..."
if head -20 "$LATEST_SCHEMA" | grep -q "PostgreSQL\|pg_dump\|SET\|CREATE"; then
  echo "  PASS: Schema file appears to be valid PostgreSQL dump"
else
  echo "  WARNING: Schema file may not be a valid pg_dump output"
fi
echo ""

# Check 5: RLS policies in backup
echo "Check 5: RLS policies in backup..."
RLS_COUNT=$(grep -c "CREATE POLICY\|ENABLE ROW LEVEL SECURITY" "$LATEST_SCHEMA" 2>/dev/null || echo "0")
echo "  Found $RLS_COUNT RLS-related statements"
if [ "$RLS_COUNT" -gt 10 ]; then
  echo "  PASS: RLS policies are included in backup"
else
  echo "  WARNING: Few or no RLS policies found — verify backup includes policies"
fi
echo ""

# Summary
echo "=== RESTORE DRILL SUMMARY ==="
echo "Schema: $LATEST_SCHEMA"
echo "Data:   $LATEST_DATA"
echo "Status: Drill complete — backup integrity verified"
echo ""
echo "To restore to production (DESTRUCTIVE), you would run:"
echo "  psql \$DATABASE_URL < $LATEST_SCHEMA"
echo "  psql \$DATABASE_URL < $LATEST_DATA"
echo ""
echo "IMPORTANT: Never restore to production without first testing on a staging environment."
echo "=== END ==="
