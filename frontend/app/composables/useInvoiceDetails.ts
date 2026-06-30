import { computed, onMounted, ref, type Ref } from 'vue'
import type { Invoice } from '~/types/invoice'

export function useInvoiceDetails(invoiceId: Ref<number>) {
  const { showInvoice } = useInvoicesApi()

  const {
    actionError,
    canChangeStatus,
    canDelete,
    isActionProcessing,
    changeStatus,
    removeInvoice,
  } = useInvoiceLifecycleActions()

  const {
    data: invoice,
    pending,
    error,
    refresh,
  } = useAsyncData<Invoice | null>(
    () => `invoice-${invoiceId.value}`,
    () => showInvoice(invoiceId.value),
    {
      server: false,
      default: () => null,
    },
  )

  const isHydrated = ref(false)

  onMounted(() => {
    isHydrated.value = true
  })

  const isLoading = computed(() => !isHydrated.value || pending.value)

  function refreshDetails(): void {
    void refresh()
  }

  function setInvoice(updatedInvoice: Invoice): void {
    invoice.value = updatedInvoice
  }

  async function approveInvoice(): Promise<void> {
    if (!invoice.value) {
      return
    }

    const updatedInvoice = await changeStatus(invoice.value, 'approved')
    setInvoice(updatedInvoice)
  }

  async function rejectInvoice(): Promise<void> {
    if (!invoice.value) {
      return
    }

    const updatedInvoice = await changeStatus(invoice.value, 'rejected')
    setInvoice(updatedInvoice)
  }

  async function deleteCurrentInvoice(): Promise<void> {
    if (!invoice.value) {
      return
    }

    const confirmed = window.confirm(`Delete invoice ${invoice.value.number}? This action is allowed only for pending invoices.`)

    if (!confirmed) {
      return
    }

    await removeInvoice(invoice.value)
    await navigateTo('/invoices')
  }

  return {
    invoice,
    isLoading,
    error,
    actionError,
    refreshDetails,
    setInvoice,
    canChangeStatus,
    canDelete,
    isActionProcessing,
    approveInvoice,
    rejectInvoice,
    deleteCurrentInvoice,
  }
}
