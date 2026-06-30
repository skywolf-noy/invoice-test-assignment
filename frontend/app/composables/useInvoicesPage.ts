import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useInvoiceListStore } from '~/stores/invoiceList'
import { useInvoiceMutationsStore } from '~/stores/invoiceMutations'
import type { Invoice, InvoiceFinalStatus } from '~/types/invoice'

export function useInvoicesPage() {
  const listStore = useInvoiceListStore()
  const mutationsStore = useInvoiceMutationsStore()

  const {
    invoices,
    isLoading,
    error,
  } = storeToRefs(listStore)

  const {
    actionError,
  } = storeToRefs(mutationsStore)

  const {
    formatMoney,
    formatDate,
  } = useInvoiceFormatters()

  onMounted(() => {
    void listStore.fetchInvoices()
  })

  function refreshInvoices(): void {
    void listStore.fetchInvoices()
  }

  function openInvoice(invoice: Invoice): void {
    void navigateTo(`/invoices/${invoice.id}`)
  }

  function openCreateInvoice(): void {
    void navigateTo('/invoices/create')
  }

  function changeInvoiceStatus(invoice: Invoice, status: InvoiceFinalStatus): void {
    void mutationsStore.changeInvoiceStatus(invoice, status)
  }

  function deleteInvoice(invoice: Invoice): void {
    const confirmed = window.confirm(`Delete invoice ${invoice.number}? This action is allowed only for pending invoices.`)

    if (!confirmed) {
      return
    }

    void mutationsStore.deleteInvoice(invoice)
  }

  return {
    invoices,
    isLoading,
    error,
    actionError,
    formatMoney,
    formatDate,
    refreshInvoices,
    openInvoice,
    openCreateInvoice,
    canChangeStatus: mutationsStore.canChangeStatus,
    canDelete: mutationsStore.canDelete,
    isActionProcessing: mutationsStore.isActionProcessing,
    changeInvoiceStatus,
    deleteInvoice,
  }
}
