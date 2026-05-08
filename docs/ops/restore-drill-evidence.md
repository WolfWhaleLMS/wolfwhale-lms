# Restore Drill Evidence

Date: 2026-05-08

The repo includes guarded commands for backup and restore:

```bash
npm run db:backup
RESTORE_DRILL_CONFIRM=restore-non-production RESTORE_DRILL_DB_URL=<disposable-db-url> BACKUP_FILE=<backup.dump> npm run db:restore-drill
```

After the drill, copy `fixtures/ops/restore-drill-evidence.example.json` to an evidence file, set `evidenceType` to `completed_drill`, and fill in:

- `environment`
- `backupFile`
- `backupSha256`
- `restoredAt`
- `verifiedBy`
- `outcome`
- `verificationQueries`

Validate production evidence with:

```bash
ENFORCE_REAL_OPS_EVIDENCE=1 RESTORE_DRILL_EVIDENCE_PATH=<evidence.json> npm run ops:evidence
```

The default `npm run ops:evidence` validates the evidence schema against the bundled example. It does not prove a production restore drill by itself.
