import { defineStore } from 'pinia'
import { useInvoicesApi } from '~/composables/useInvoices'
import type {
  ApiErrorResponse,
  CreateInvoicePayload,
  Invoice,
  InvoiceFinalStatus,
  UpdateInvoicePayload,
} from '~/types/invoice'

type InvoiceAction = 'create' | 'update' | 'approve' | 'reject' | 'delete'

function getApiMessage(error: unknown, fallback: string): string {
  const apiError = error as { data?: ApiErrorResponse }

  return apiError.data?.message || fallback
}

export const useInvoicesStore = defineStore('invoices', {
  state: () => ({
    invoices: [] as Invoice[],
    currentInvoice: null as Invoice | null,

    isListLoading: true,
    isDetailsLoading: true,
    isCreating: false,
    isUpdating: false,

    listError: '',
    detailsError: '',
    createError: '',
    updateError: '',
    actionError: '',

    activeInvoiceId: null as number | null,
    activeAction: null as InvoiceAction | null,
  }),

  getters: {
    canChangeStatus: () => {
      return (invoice: Invoice): boolean => invoice.status === 'pending'
    },

    canDelete: () => {
      return (invoice: Invoice): boolean => invoice.status === 'pending'
    },

    isActionProcessing: (state) => {
      return (invoiceId: number, action?: InvoiceAction): boolean => {
        if (state.activeInvoiceId !== invoiceId) {
          return false
        }

        return action ? state.activeAction === action : state.activeAction !== null
      }
    },
  },

  actions: {
    resetErrors(): void {
      this.listError = ''
      this.detailsError = ''
      this.createError = ''
      this.updateError = ''
      this.actionError = ''
    },

    replaceInvoice(updatedInvoice: Invoice): void {
      this.invoices = this.invoices.map((invoice) => {
        if (invoice.id === updatedInvoice.id) {
          return updatedInvoice
        }

        return invoice
      })

      if (this.currentInvoice?.id === updatedInvoice.id) {
        this.currentInvoice = updatedInvoice
      }
    },

    prependInvoice(invoice: Invoice): void {
      this.invoices = [
        invoice,
        ...this.invoices.filter((item) => item.id !== invoice.id),
      ]
    },

    removeInvoiceFromState(invoiceId: number): void {
      this.invoices = this.invoices.filter((invoice) => invoice.id !== invoiceId)

      if (this.currentInvoice?.id === invoiceId) {
        this.currentInvoice = null
      }
    },

    async fetchInvoices(): Promise<void> {
      const { listInvoices } = useInvoicesApi()

      this.isListLoading = true
      this.listError = ''

      try {
        this.invoices = await listInvoices()
      } catch (error) {
        this.listError = getApiMessage(error, 'Failed to load invoices.')
      } finally {
        this.isListLoading = false
      }
    },

    async fetchInvoice(id: number): Promise<void> {
      const { showInvoice } = useInvoicesApi()

      this.isDetailsLoading = true
      this.detailsError = ''
      this.currentInvoice = null

      try {
        this.currentInvoice = await showInvoice(id)
      } catch (error) {
        this.detailsError = getApiMessage(error, 'Failed to load invoice.')
      } finally {
        this.isDetailsLoading = false
      }
    },

    async createInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
      const { createInvoice } = useInvoicesApi()

      this.isCreating = true
      this.createError = ''

      try {
        const createdInvoice = await createInvoice(payload)

        this.prependInvoice(createdInvoice)
        this.currentInvoice = createdInvoice

        return createdInvoice
      } catch (error) {
        this.createError = getApiMessage(error, 'Failed to create invoice.')
        throw error
      } finally {
        this.isCreating = false
      }
    },

    async updateInvoice(id: number, payload: UpdateInvoicePayload): Promise<Invoice> {
      const { updateInvoice } = useInvoicesApi()

      this.isUpdating = true
      this.updateError = ''

      try {
        const updatedInvoice = await updateInvoice(id, payload)

        this.replaceInvoice(updatedInvoice)

        return updatedInvoice
      } catch (error) {
        this.updateError = getApiMessage(error, 'Failed to update invoice.')
        throw error
      } finally {
        this.isUpdating = false
      }
    },

    async changeInvoiceStatus(invoice: Invoice, status: InvoiceFinalStatus): Promise<Invoice> {
      const { updateInvoiceStatus } = useInvoicesApi()

      if (!this.canChangeStatus(invoice)) {
        this.actionError = 'Only pending invoices can change status.'
        throw new Error(this.actionError)
      }

      this.actionError = ''
      this.activeInvoiceId = invoice.id
      this.activeAction = status === 'approved' ? 'approve' : 'reject'

      try {
        const updatedInvoice = await updateInvoiceStatus(invoice.id, { status })

        this.replaceInvoice(updatedInvoice)

        return updatedInvoice
      } catch (error) {
        this.actionError = getApiMessage(error, 'Failed to update invoice status.')
        throw error
      } finally {
        this.activeInvoiceId = null
        this.activeAction = null
      }
    },

    async deleteInvoice(invoice: Invoice): Promise<void> {
      const { deleteInvoice } = useInvoicesApi()

      if (!this.canDelete(invoice)) {
        this.actionError = 'Only pending invoices can be deleted.'
        throw new Error(this.actionError)
      }

      this.actionError = ''
      this.activeInvoiceId = invoice.id
      this.activeAction = 'delete'

      try {
        await deleteInvoice(invoice.id)
        this.removeInvoiceFromState(invoice.id)
      } catch (error) {
        this.actionError = getApiMessage(error, 'Failed to delete invoice.')
        throw error
      } finally {
        this.activeInvoiceId = null
        this.activeAction = null
      }
    },
  },
})
