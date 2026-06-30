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

  function getTodayDate(): string {
    return new Date().toISOString().slice(0, 10)
  }

  function getDateAfterDays(days: number): string {
    const date = new Date()
    date.setDate(date.getDate() + days)

    return date.toISOString().slice(0, 10)
  }

  return {
    formatMoney,
    formatDate,
    formatDateTime,
    getTodayDate,
    getDateAfterDays,
  }
}
