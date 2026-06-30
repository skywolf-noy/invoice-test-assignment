export function useInvoiceFormatters() {
  function formatMoney(amount: string, currency: string): string {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency,
    }).format(Number(amount))
  }

  function formatDate(date: string): string {
    return new Intl.DateTimeFormat('uk-UA', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(new Date(date))
  }

  function formatDateTime(date: string): string {
    return new Intl.DateTimeFormat('uk-UA', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  return {
    formatMoney,
    formatDate,
    formatDateTime,
  }
}
