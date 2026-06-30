import type { Invoice } from '~/types/invoice'

export type TranslationFunction = (
  key: string,
  params?: Record<string, string | number>
) => string

export interface InvoiceExportContext {
  t: TranslationFunction
  formatMoney: (amount: string, currency: string) => string
  formatDate: (date: string) => string
  formatDateTime: (date: string) => string
}

export interface InvoiceListExportRow {
  number: string
  supplier: string
  grossAmount: string
  status: string
  dueDate: string
}

export interface InvoiceDetailsExportRow {
  label: string
  value: string
}

function sanitizeFilenamePart(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export function createExportTimestamp(date = new Date()): string {
  return date
    .toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, 19)
}

export function createExportFilename(
  baseName: string,
  extension: string,
  identifier?: string,
): string {
  const parts = [
    sanitizeFilenamePart(baseName),
    identifier ? sanitizeFilenamePart(identifier) : null,
    createExportTimestamp(),
  ].filter(Boolean)

  return `${parts.join('-')}.${extension}`
}

export function getInvoiceListExportRows(
  invoices: Invoice[],
  context: InvoiceExportContext,
): InvoiceListExportRow[] {
  return invoices.map((invoice) => ({
    number: invoice.number,
    supplier: invoice.supplier_name,
    grossAmount: context.formatMoney(invoice.gross_amount, invoice.currency),
    status: context.t(`status.${invoice.status}`),
    dueDate: context.formatDate(invoice.due_date),
  }))
}

export function getInvoiceDetailsExportRows(
  invoice: Invoice,
  context: InvoiceExportContext,
): InvoiceDetailsExportRow[] {
  return [
    {
      label: context.t('fields.number'),
      value: invoice.number,
    },
    {
      label: context.t('fields.supplierName'),
      value: invoice.supplier_name,
    },
    {
      label: context.t('fields.supplierTaxId'),
      value: invoice.supplier_tax_id,
    },
    {
      label: context.t('fields.netAmount'),
      value: context.formatMoney(invoice.net_amount, invoice.currency),
    },
    {
      label: context.t('fields.vatAmount'),
      value: context.formatMoney(invoice.vat_amount, invoice.currency),
    },
    {
      label: context.t('fields.grossAmount'),
      value: context.formatMoney(invoice.gross_amount, invoice.currency),
    },
    {
      label: context.t('fields.currency'),
      value: invoice.currency,
    },
    {
      label: context.t('fields.status'),
      value: context.t(`status.${invoice.status}`),
    },
    {
      label: context.t('fields.issueDate'),
      value: context.formatDate(invoice.issue_date),
    },
    {
      label: context.t('fields.dueDate'),
      value: context.formatDate(invoice.due_date),
    },
    {
      label: context.t('fields.lastUpdated'),
      value: context.formatDateTime(invoice.updated_at),
    },
  ]
}
