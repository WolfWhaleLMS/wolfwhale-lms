import 'server-only'

/**
 * Convert an array of objects to a CSV string with BOM for Excel compatibility.
 */
export function arrayToCSV(
  data: Record<string, unknown>[],
  columns: { key: string; header: string }[]
): string {
  const BOM = '\uFEFF'
  const headers = columns.map((c) => escapeCSV(c.header)).join(',')
  const rows = data.map((row) =>
    columns.map((c) => escapeCSV(String(row[c.key] ?? ''))).join(',')
  )
  return BOM + [headers, ...rows].join('\n')
}

function escapeCSV(value: string): string {
  let sanitized = value
  if (/^[=+\-@\t\r]/.test(sanitized)) {
    sanitized = `'${sanitized}`
  }
  if (sanitized.includes(',') || sanitized.includes('"') || sanitized.includes('\n') || sanitized.includes("'")) {
    return `"${sanitized.replace(/"/g, '""')}"`
  }
  return sanitized
}
