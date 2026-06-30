import { storeToRefs } from 'pinia'
import { computed, onMounted, watch } from 'vue'
import { useInvoiceDetailsStore } from '~/stores/invoiceDetails'
import { useInvoiceMutationsStore } from '~/stores/invoiceMutations'
import type { Invoice, InvoiceFinalStatus } from '~/types/invoice'

export function useInvoiceDetailsPage() {
  const route = useRoute()
  const invoiceId = computed(() => Number(route.params.id))

  const detailsStore = useInvoiceDetailsStore()
  const mutationsStore = useInvoiceMutationsStore()

  const {
    currentInvoice: invoice,
    isLoading,
    error,
  } = storeToRefs(detailsStore)

  const {
    actionError,
  } = storeToRefs(mutationsStore)

  const {
    formatMoney,
    formatDate,
    formatDateTime,
  } = useInvoiceFormatters()

  const {
    t,
  } = useAppI18n()

  onMounted(() => {
    void detailsStore.fetchInvoice(invoiceId.value)
  })

  watch(invoiceId, (id) => {
    void detailsStore.fetchInvoice(id)
  })

  function goBack(): void {
    void navigateTo('/invoices')
  }

  function refreshDetails(): void {
    void detailsStore.fetchInvoice(invoiceId.value)
  }

  function handleUpdated(updatedInvoice: Invoice): void {
    detailsStore.setInvoice(updatedInvoice)
  }

  function changeInvoiceStatus(status: InvoiceFinalStatus): void {
    if (!invoice.value) {
      return
    }

    void mutationsStore.changeInvoiceStatus(invoice.value, status)
  }

  function deleteInvoice(): void {
    if (!invoice.value) {
      return
    }

    const confirmed = window.confirm(
      t('invoices.deleteConfirm', { number: invoice.value.number }),
    )

    if (!confirmed) {
      return
    }

    void mutationsStore.deleteInvoice(invoice.value).then(() => {
      void navigateTo('/invoices')
    })
  }

  return {
    invoice,
    isLoading,
    error,
    actionError,
    formatMoney,
    formatDate,
    formatDateTime,
    t,
    goBack,
    refreshDetails,
    handleUpdated,
    canDelete: mutationsStore.canDelete,
    isActionProcessing: mutationsStore.isActionProcessing,
    changeInvoiceStatus,
    deleteInvoice,
  }
}
