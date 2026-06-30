import { computed, onMounted, ref } from 'vue'
import type { Invoice } from '~/types/invoice'

export function useInvoiceList() {
  const { listInvoices } = useInvoicesApi()

  const {
    actionError,
    canChangeStatus,
    canDelete,
    isActionProcessing,
    changeStatus,
    removeInvoice,
  } = useInvoiceLifecycleActions()

  const {
    data: invoices,
    pending,
    error,
    refresh,
  } = useAsyncData<Invoice[]>(
    'invoices',
    () => listInvoices(),
    {
      server: false,
      default: () => [],
    },
  )

  const isHydrated = ref(false)

  onMounted(() => {
    isHydrated.value = true
  })

  const isLoading = computed(() => !isHydrated.value || pending.value)

  function refreshInvoices(): void {
    void refresh()
  }

  function openInvoice(invoice: Invoice): void {
    void navigateTo(`/invoices/${invoice.id}`)
  }

  function openCreateInvoice(): void {
    void navigateTo('/invoices/create')
  }

  function replaceInvoice(updatedInvoice: Invoice): void {
    invoices.value = invoices.value.map((invoice) => {
      if (invoice.id === updatedInvoice.id) {
        return updatedInvoice
      }

      return invoice
    })
  }

  async function approveInvoice(invoice: Invoice): Promise<void> {
    const updatedInvoice = await changeStatus(invoice, 'approved')
    replaceInvoice(updatedInvoice)
  }

  async function rejectInvoice(invoice: Invoice): Promise<void> {
    const updatedInvoice = await changeStatus(invoice, 'rejected')
    replaceInvoice(updatedInvoice)
  }

  async function deleteInvoiceFromList(invoice: Invoice): Promise<void> {
    const confirmed = window.confirm(`Delete invoice ${invoice.number}? This action is allowed only for pending invoices.`)

    if (!confirmed) {
      return
    }

    await removeInvoice(invoice)

    invoices.value = invoices.value.filter((item) => item.id !== invoice.id)
  }

  return {
    invoices,
    isLoading,
    error,
    actionError,
    refreshInvoices,
    openInvoice,
    openCreateInvoice,
    canChangeStatus,
    canDelete,
    isActionProcessing,
    approveInvoice,
    rejectInvoice,
    deleteInvoiceFromList,
  }
}
