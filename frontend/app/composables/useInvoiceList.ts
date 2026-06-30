import { computed, onMounted, ref } from 'vue'
import type { Invoice } from '~/types/invoice'

export function useInvoiceList() {
  const { listInvoices } = useInvoicesApi()

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

  return {
    invoices,
    isLoading,
    error,
    refreshInvoices,
    openInvoice,
    openCreateInvoice,
  }
}
