import { defineStore } from 'pinia'
import { useInvoicesApi } from '~/composables/useInvoices'
import type { ApiErrorResponse, Invoice } from '~/types/invoice'

function getApiMessage(error: unknown, fallback: string): string {
  const apiError = error as { data?: ApiErrorResponse }

  return apiError.data?.message || fallback
}

export const useInvoiceDetailsStore = defineStore('invoiceDetails', {
  state: () => ({
    currentInvoice: null as Invoice | null,
    isLoading: true,
    error: '',
  }),

  actions: {
    async fetchInvoice(id: number): Promise<void> {
      const { showInvoice } = useInvoicesApi()

      this.isLoading = true
      this.error = ''
      this.currentInvoice = null

      try {
        this.currentInvoice = await showInvoice(id)
      } catch (error) {
        this.error = getApiMessage(error, 'Failed to load invoice.')
      } finally {
        this.isLoading = false
      }
    },

    setInvoice(invoice: Invoice): void {
      this.currentInvoice = invoice
    },

    clearInvoice(invoiceId?: number): void {
      if (!invoiceId || this.currentInvoice?.id === invoiceId) {
        this.currentInvoice = null
      }
    },
  },
})
