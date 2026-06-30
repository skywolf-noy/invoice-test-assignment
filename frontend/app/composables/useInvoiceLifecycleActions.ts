import { ref } from 'vue'
import type { ApiErrorResponse, Invoice, InvoiceFinalStatus } from '~/types/invoice'

type InvoiceLifecycleAction = 'approve' | 'reject' | 'delete'

export function useInvoiceLifecycleActions() {
  const {
    updateInvoiceStatus,
    deleteInvoice,
  } = useInvoicesApi()

  const actionError = ref('')
  const activeInvoiceId = ref<number | null>(null)
  const activeAction = ref<InvoiceLifecycleAction | null>(null)

  function canChangeStatus(invoice: Invoice): boolean {
    return invoice.status === 'pending'
  }

  function canDelete(invoice: Invoice): boolean {
    return invoice.status === 'pending'
  }

  function isActionProcessing(invoiceId: number, action?: InvoiceLifecycleAction): boolean {
    if (activeInvoiceId.value !== invoiceId) {
      return false
    }

    return action ? activeAction.value === action : true
  }

  async function changeStatus(invoice: Invoice, status: InvoiceFinalStatus): Promise<Invoice> {
    if (!canChangeStatus(invoice)) {
      actionError.value = 'Only pending invoices can change status.'
      throw new Error(actionError.value)
    }

    actionError.value = ''
    activeInvoiceId.value = invoice.id
    activeAction.value = status === 'approved' ? 'approve' : 'reject'

    try {
      return await updateInvoiceStatus(invoice.id, { status })
    } catch (error) {
      const apiError = error as { data?: ApiErrorResponse }

      actionError.value = apiError.data?.message || 'Failed to update invoice status.'
      throw error
    } finally {
      activeInvoiceId.value = null
      activeAction.value = null
    }
  }

  async function removeInvoice(invoice: Invoice): Promise<void> {
    if (!canDelete(invoice)) {
      actionError.value = 'Only pending invoices can be deleted.'
      throw new Error(actionError.value)
    }

    actionError.value = ''
    activeInvoiceId.value = invoice.id
    activeAction.value = 'delete'

    try {
      await deleteInvoice(invoice.id)
    } catch (error) {
      const apiError = error as { data?: ApiErrorResponse }

      actionError.value = apiError.data?.message || 'Failed to delete invoice.'
      throw error
    } finally {
      activeInvoiceId.value = null
      activeAction.value = null
    }
  }

  return {
    actionError,
    canChangeStatus,
    canDelete,
    isActionProcessing,
    changeStatus,
    removeInvoice,
  }
}
