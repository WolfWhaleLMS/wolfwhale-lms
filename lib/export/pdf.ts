import 'server-only'

import React from 'react'
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1a2a4e', marginBottom: 4 },
  subtitle: { fontSize: 12, color: '#6b7280', marginBottom: 2 },
  date: { fontSize: 9, color: '#9ca3af', marginBottom: 16 },
  table: { width: '100%', marginBottom: 16 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  tableCell: { flex: 1 },
  tableCellHeader: { flex: 1, fontWeight: 'bold', fontSize: 9, color: '#374151' },
  statCard: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statLabel: { fontSize: 8, color: '#6b7280', marginBottom: 2 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#1a2a4e' },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#9ca3af',
  },
})

interface ReportProps {
  title: string
  subtitle?: string
  generatedBy?: string
  children?: React.ReactNode
}

export function ReportDocument({ title, subtitle, generatedBy, children }: ReportProps) {
  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'LETTER', style: styles.page },
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.title }, title),
        subtitle && React.createElement(Text, { style: styles.subtitle }, subtitle),
        React.createElement(
          Text,
          { style: styles.date },
          `Generated: ${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}${generatedBy ? ` | By: ${generatedBy}` : ''}`
        )
      ),
      children,
      React.createElement(
        View,
        { style: styles.footer, fixed: true },
        React.createElement(Text, null, 'Wolf Whale LMS'),
        React.createElement(Text, { render: ({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}` })
      )
    )
  )
}

export function StatRow({ stats }: { stats: { label: string; value: string }[] }) {
  return React.createElement(
    View,
    { style: styles.statCard },
    ...stats.map((s, i) =>
      React.createElement(
        View,
        { key: i, style: styles.statBox },
        React.createElement(Text, { style: styles.statLabel }, s.label),
        React.createElement(Text, { style: styles.statValue }, s.value)
      )
    )
  )
}

export function Table({
  columns,
  rows,
}: {
  columns: { key: string; header: string; width?: number }[]
  rows: Record<string, string | number>[]
}) {
  return React.createElement(
    View,
    { style: styles.table },
    React.createElement(
      View,
      { style: styles.tableHeader },
      ...columns.map((col, i) =>
        React.createElement(
          Text,
          { key: i, style: col.width ? { ...styles.tableCellHeader, flex: col.width } : styles.tableCellHeader },
          col.header
        )
      )
    ),
    ...rows.map((row, ri) =>
      React.createElement(
        View,
        { key: ri, style: styles.tableRow },
        ...columns.map((col, ci) =>
          React.createElement(
            Text,
            { key: ci, style: col.width ? { ...styles.tableCell, flex: col.width } : styles.tableCell },
            String(row[col.key] ?? '')
          )
        )
      )
    )
  )
}

export { renderToBuffer, styles }
