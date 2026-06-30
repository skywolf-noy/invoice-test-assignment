import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useInvoiceDetailsStore } from '~/stores/invoiceDetails'
import { useInvoiceListStore } from '~/stores/invoiceList'
import { useInvoiceMutationsStore } from '~/stores/invoiceMutations'
import type {
  CreateInvoicePayload,
  Invoice,
  UpdateInvoicePayload,
} from '~/types/invoice'

const api = vi.hoisted(() => ({
  listInvoices: vi.fn(),
  showInvoice: vi.fn(),
  createInvoice: vi.fn(),
  updateInvoice: vi.fn(),
  updateInvoiceStatus: vi.fn(),
  deleteInvoice: vi.fn(),
}))

vi.mock('~/composables/useInvoices', () => ({
  useInvoicesApi: () => api,
}))

function makeInvoice(overrides: Partial<Invoice> = {}): Invoice {
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
    updated_at: '2026-06-30T10:00:00.000000Z',
    ...overrides,
  }
}

describe('invoice Pinia stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    vi.clearAllMocks()
  })

  it('loads invoice list into invoiceList store', async () => {
    const invoice = makeInvoice()

    api.listInvoices.mockResolvedValueOnce([invoice])

    const listStore = useInvoiceListStore()

    await listStore.fetchInvoices()

    expect(api.listInvoices).toHaveBeenCalledOnce()
    expect(listStore.invoices).toEqual([invoice])
    expect(listStore.isLoading).toBe(false)
    expect(listStore.error).toBe('')
  })

  it('loads current invoice into invoiceDetails store', async () => {
    const invoice = makeInvoice({ id: 7 })

    api.showInvoice.mockResolvedValueOnce(invoice)

    const detailsStore = useInvoiceDetailsStore()

    await detailsStore.fetchInvoice(7)

    expect(api.showInvoice).toHaveBeenCalledWith(7)
    expect(detailsStore.currentInvoice).toEqual(invoice)
    expect(detailsStore.isLoading).toBe(false)
    expect(detailsStore.error).toBe('')
  })

  it('creates invoice and synchronizes list and details stores', async () => {
    const createdInvoice = makeInvoice({ id: 10, number: 'INV-2026-010' })
    const payload: CreateInvoicePayload = {
      number: createdInvoice.number,
      supplier_name: createdInvoice.supplier_name,
      supplier_tax_id: createdInvoice.supplier_tax_id,
      net_amount: createdInvoice.net_amount,
      vat_amount: createdInvoice.vat_amount,
      gross_amount: createdInvoice.gross_amount,
      currency: createdInvoice.currency,
      issue_date: createdInvoice.issue_date,
      due_date: createdInvoice.due_date,
    }

    api.createInvoice.mockResolvedValueOnce(createdInvoice)

    const listStore = useInvoiceListStore()
    const detailsStore = useInvoiceDetailsStore()
    const mutationsStore = useInvoiceMutationsStore()

    const result = await mutationsStore.createInvoice(payload)

    expect(result).toEqual(createdInvoice)
    expect(api.createInvoice).toHaveBeenCalledWith(payload)
    expect(listStore.invoices).toEqual([createdInvoice])
    expect(detailsStore.currentInvoice).toEqual(createdInvoice)
    expect(mutationsStore.isCreating).toBe(false)
    expect(mutationsStore.createError).toBe('')
  })

  it('updates invoice and synchronizes existing list and details state', async () => {
    const originalInvoice = makeInvoice({ id: 15 })
    const updatedInvoice = makeInvoice({
      id: 15,
      net_amount: '150.00',
      vat_amount: '30.00',
      gross_amount: '180.00',
      updated_at: '2026-06-30T12:00:00.000000Z',
    })
    const payload: UpdateInvoicePayload = {
      net_amount: updatedInvoice.net_amount,
      vat_amount: updatedInvoice.vat_amount,
      gross_amount: updatedInvoice.gross_amount,
      due_date: updatedInvoice.due_date,
    }

    api.updateInvoice.mockResolvedValueOnce(updatedInvoice)

    const listStore = useInvoiceListStore()
    const detailsStore = useInvoiceDetailsStore()
    const mutationsStore = useInvoiceMutationsStore()

    listStore.invoices = [originalInvoice]
    detailsStore.setInvoice(originalInvoice)

    const result = await mutationsStore.updateInvoice(15, payload)

    expect(result).toEqual(updatedInvoice)
    expect(api.updateInvoice).toHaveBeenCalledWith(15, payload)
    expect(listStore.invoices).toEqual([updatedInvoice])
    expect(detailsStore.currentInvoice).toEqual(updatedInvoice)
    expect(mutationsStore.isUpdating).toBe(false)
    expect(mutationsStore.updateError).toBe('')
  })

  it('allows pending invoice status transition and synchronizes stores', async () => {
    const pendingInvoice = makeInvoice({ id: 21, status: 'pending' })
    const approvedInvoice = makeInvoice({ id: 21, status: 'approved' })

    api.updateInvoiceStatus.mockResolvedValueOnce(approvedInvoice)

    const listStore = useInvoiceListStore()
    const detailsStore = useInvoiceDetailsStore()
    const mutationsStore = useInvoiceMutationsStore()

    listStore.invoices = [pendingInvoice]
    detailsStore.setInvoice(pendingInvoice)

    const result = await mutationsStore.changeInvoiceStatus(pendingInvoice, 'approved')

    expect(result).toEqual(approvedInvoice)
    expect(api.updateInvoiceStatus).toHaveBeenCalledWith(21, { status: 'approved' })
    expect(listStore.invoices).toEqual([approvedInvoice])
    expect(detailsStore.currentInvoice).toEqual(approvedInvoice)
    expect(mutationsStore.activeInvoiceId).toBeNull()
    expect(mutationsStore.activeAction).toBeNull()
  })

  it('blocks status transition for finalised invoice before API call', async () => {
    const approvedInvoice = makeInvoice({ id: 31, status: 'approved' })

    const mutationsStore = useInvoiceMutationsStore()

    await expect(
      mutationsStore.changeInvoiceStatus(approvedInvoice, 'rejected'),
    ).rejects.toThrow('Only pending invoices can change status.')

    expect(api.updateInvoiceStatus).not.toHaveBeenCalled()
    expect(mutationsStore.actionError).toBe('Only pending invoices can change status.')
  })

  it('deletes pending invoice and removes it from stores', async () => {
    const pendingInvoice = makeInvoice({ id: 41, status: 'pending' })

    api.deleteInvoice.mockResolvedValueOnce(undefined)

    const listStore = useInvoiceListStore()
    const detailsStore = useInvoiceDetailsStore()
    const mutationsStore = useInvoiceMutationsStore()

    listStore.invoices = [pendingInvoice]
    detailsStore.setInvoice(pendingInvoice)

    await mutationsStore.deleteInvoice(pendingInvoice)

    expect(api.deleteInvoice).toHaveBeenCalledWith(41)
    expect(listStore.invoices).toEqual([])
    expect(detailsStore.currentInvoice).toBeNull()
    expect(mutationsStore.activeInvoiceId).toBeNull()
    expect(mutationsStore.activeAction).toBeNull()
  })

  it('blocks delete for finalised invoice before API call', async () => {
    const rejectedInvoice = makeInvoice({ id: 51, status: 'rejected' })

    const mutationsStore = useInvoiceMutationsStore()

    await expect(
      mutationsStore.deleteInvoice(rejectedInvoice),
    ).rejects.toThrow('Only pending invoices can be deleted.')

    expect(api.deleteInvoice).not.toHaveBeenCalled()
    expect(mutationsStore.actionError).toBe('Only pending invoices can be deleted.')
  })
})
