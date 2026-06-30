import type { Invoice } from '~/types/invoice'

export function makeInvoice(overrides: Partial<Invoice> = {}): Invoice {
  return {
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
    ...overrides,
  }
}
