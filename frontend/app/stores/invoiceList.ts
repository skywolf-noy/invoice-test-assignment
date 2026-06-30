import { defineStore } from 'pinia'
import { useInvoicesApi } from '~/composables/useInvoices'
import type { ApiErrorResponse, Invoice } from '~/types/invoice'

function getApiMessage(error: unknown, fallback: string): string {
  const apiError = error as { data?: ApiErrorResponse }

  return apiError.data?.message || fallback
}

export const useInvoiceListStore = defineStore('invoiceList', {
  state: () => ({
    invoices: [] as Invoice[],
    isLoading: true,
    error: '',
  }),

  actions: {
    async fetchInvoices(): Promise<void> {
      const { listInvoices } = useInvoicesApi()

      this.isLoading = true
      this.error = ''

      try {
        this.invoices = await listInvoices()
      } catch (error) {
        this.error = getApiMessage(error, 'Failed to load invoices.')
      } finally {
        this.isLoading = false
      }
    },

    replaceInvoice(updatedInvoice: Invoice): void {
      this.invoices = this.invoices.map((invoice) => {
        return invoice.id === updatedInvoice.id ? updatedInvoice : invoice
      })
    },

    prependInvoice(invoice: Invoice): void {
      this.invoices = [
        invoice,
        ...this.invoices.filter((item) => item.id !== invoice.id),
      ]
    },

    removeInvoiceById(invoiceId: number): void {
      this.invoices = this.invoices.filter((invoice) => invoice.id !== invoiceId)
    },
  },
})
