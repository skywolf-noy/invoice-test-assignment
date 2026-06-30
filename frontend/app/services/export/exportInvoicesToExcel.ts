import type { Invoice } from '~/types/invoice'
import {
  createExportFilename,
  getInvoiceListExportRows,
  type InvoiceExportContext,
} from './invoiceExportData'

export async function exportInvoicesToExcel(
  invoices: Invoice[],
  context: InvoiceExportContext,
): Promise<void> {
  const XLSX = await import('xlsx')
  const {
    saveAs,
  } = await import('file-saver')

  const rows = getInvoiceListExportRows(invoices, context).map((invoice) => ({
    [context.t('fields.number')]: invoice.number,
    [context.t('fields.supplier')]: invoice.supplier,
    [context.t('fields.grossAmount')]: invoice.grossAmount,
    [context.t('fields.status')]: invoice.status,
    [context.t('fields.dueDate')]: invoice.dueDate,
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()

  worksheet['!cols'] = [
    { wch: 18 },
    { wch: 28 },
    { wch: 18 },
    { wch: 14 },
    { wch: 18 },
  ]

  XLSX.utils.book_append_sheet(workbook, worksheet, context.t('invoices.title'))

  const output = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })

  const blob = new Blob([output], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  saveAs(blob, createExportFilename('invoice-report', 'xlsx'))
}
