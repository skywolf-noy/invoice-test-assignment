import type { Invoice } from '~/types/invoice'

export function useInvoiceCreatePage() {
  function goBack(): void {
    void navigateTo('/invoices')
  }

  function handleCreated(invoice: Invoice): void {
    void navigateTo(`/invoices/${invoice.id}`)
  }

  return {
    goBack,
    handleCreated,
  }
}
