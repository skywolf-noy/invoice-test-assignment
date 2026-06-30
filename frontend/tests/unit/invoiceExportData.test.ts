import { describe, expect, it } from 'vitest'
import {
  createExportFilename,
  createExportTimestamp,
  getInvoiceDetailsExportRows,
  getInvoiceListExportRows,
  type InvoiceExportContext,
} from '~/services/export/invoiceExportData'
import type { Invoice } from '~/types/invoice'

const invoice: Invoice = {
  id: 1,
  number: 'INV-2026-001',
  supplier_name: 'Acme Ltd',
  supplier_tax_id: 'TAX-001',
  net_amount: '100.00',
  vat_amount: '20.00',
  gross_amount: '120.00',
  currency: 'USD',
  status: 'pending',
  issue_date: '2026-06-30',
  due_date: '2026-07-30',
  created_at: '2026-06-30T10:00:00.000000Z',
  updated_at: '2026-06-30T11:00:00.000000Z',
}

const context: InvoiceExportContext = {
  t: (key: string) => {
    const dictionary: Record<string, string> = {
      'fields.number': 'Number',
      'fields.supplier': 'Supplier',
      'fields.supplierName': 'Supplier name',
      'fields.supplierTaxId': 'Supplier Tax ID',
      'fields.netAmount': 'Net amount',
      'fields.vatAmount': 'VAT amount',
      'fields.grossAmount': 'Gross amount',
      'fields.currency': 'Currency',
      'fields.status': 'Status',
      'fields.issueDate': 'Issue date',
      'fields.dueDate': 'Due date',
      'fields.lastUpdated': 'Last updated',
      'status.pending': 'Pending',
    }

    return dictionary[key] || key
  },
  formatMoney: (amount, currency) => `${amount} ${currency}`,
  formatDate: (date) => date,
  formatDateTime: (date) => date,
}

describe('invoice export data helpers', () => {
  it('creates safe export timestamp', () => {
    expect(createExportTimestamp(new Date('2026-06-30T14:30:15.000Z'))).toBe('2026-06-30T14-30-15')
  })

  it('creates safe export filename', () => {
    const filename = createExportFilename('Invoice Report', 'pdf', 'INV/2026 001')

    expect(filename).toMatch(/^invoice-report-inv-2026-001-/)
    expect(filename).toMatch(/\.pdf$/)
  })

  it('maps invoice list rows for report exports', () => {
    const rows = getInvoiceListExportRows([invoice], context)

    expect(rows).toEqual([
      {
        number: 'INV-2026-001',
        supplier: 'Acme Ltd',
        grossAmount: '120.00 USD',
        status: 'Pending',
        dueDate: '2026-07-30',
      },
    ])
  })

  it('maps invoice details rows for document exports', () => {
    const rows = getInvoiceDetailsExportRows(invoice, context)

    expect(rows).toContainEqual({
      label: 'Number',
      value: 'INV-2026-001',
    })

    expect(rows).toContainEqual({
      label: 'Gross amount',
      value: '120.00 USD',
    })
  })
})
