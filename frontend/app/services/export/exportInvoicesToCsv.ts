import type { Invoice } from '~/types/invoice'
import {
  createExportFilename,
  getInvoiceListExportRows,
  type InvoiceExportContext,
} from './invoiceExportData'

function escapeCsvValue(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`
  }

  return value
}

export async function exportInvoicesToCsv(
  invoices: Invoice[],
  context: InvoiceExportContext,
): Promise<void> {
  const {
    saveAs,
  } = await import('file-saver')

  const headers = [
    context.t('fields.number'),
    context.t('fields.supplier'),
    context.t('fields.grossAmount'),
    context.t('fields.status'),
    context.t('fields.dueDate'),
  ]

  const rows = getInvoiceListExportRows(invoices, context).map((invoice) => [
    invoice.number,
    invoice.supplier,
    invoice.grossAmount,
    invoice.status,
    invoice.dueDate,
  ])

  const csv = [
    headers,
    ...rows,
  ]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\n')

  const blob = new Blob([`\uFEFF${csv}`], {
    type: 'text/csv;charset=utf-8;',
  })

  saveAs(blob, createExportFilename('invoice-report', 'csv'))
}
