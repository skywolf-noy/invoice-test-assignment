import { computed, onMounted, ref, type Ref } from 'vue'
import type { Invoice } from '~/types/invoice'

export function useInvoiceDetails(invoiceId: Ref<number>) {
  const { showInvoice } = useInvoicesApi()

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

  return {
    invoice,
    isLoading,
    error,
    refreshDetails,
    setInvoice,
  }
}
