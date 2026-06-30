import type { Invoice } from '~/types/invoice'

export function useInvoiceCreatePage() {
  const {
    t,
  } = useAppI18n()

  function goBack(): void {
    void navigateTo('/invoices')
  }

  function handleCreated(invoice: Invoice): void {
    void navigateTo(`/invoices/${invoice.id}`)
  }

  return {
    t,
    goBack,
    handleCreated,
  }
}
