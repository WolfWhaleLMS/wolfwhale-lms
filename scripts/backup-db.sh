#!/bin/bash
# Wolf Whale LMS - Database Backup Script
# Creates a timestamped pg_dump of the production Supabase database
# Usage: ./scripts/backup-db.sh

set -euo pipefail

BACKUP_DIR="$(dirname "$0")/../backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/wolfwhale_backup_${TIMESTAMP}.sql"

mkdir -p "$BACKUP_DIR"

echo "=== Wolf Whale LMS Database Backup ==="
echo "Timestamp: $TIMESTAMP"
echo ""

# Dump schema
echo "Step 1: Dumping schema..."
supabase db dump --linked -f "$BACKUP_DIR/wolfwhale_schema_${TIMESTAMP}.sql"

# Dump data
echo "Step 2: Dumping data..."
supabase db dump --linked --data-only -f "$BACKUP_DIR/wolfwhale_data_${TIMESTAMP}.sql"

echo ""
echo "Backup complete!"
echo "  Schema: $BACKUP_DIR/wolfwhale_schema_${TIMESTAMP}.sql"
echo "  Data:   $BACKUP_DIR/wolfwhale_data_${TIMESTAMP}.sql"
echo ""

# Cleanup: keep only last 10 backups
echo "Cleaning up old backups (keeping last 10)..."
ls -t "$BACKUP_DIR"/wolfwhale_schema_*.sql 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true
ls -t "$BACKUP_DIR"/wolfwhale_data_*.sql 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true

echo "Done."
