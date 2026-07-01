import { computed } from 'vue'
import { useAppI18n } from '~/composables/useAppI18n'
import type { LocaleCode } from '~/locales'

const intlLocales: Record<LocaleCode, string> = {
  ua: 'uk-UA',
  en: 'en-US',
}

function toNumber(value: string | number): number {
  const amount = Number(value)

  return Number.isFinite(amount) ? amount : 0
}

export function useInvoiceFormatters() {
  const {
    locale,
  } = useAppI18n()

  const activeIntlLocale = computed(() => {
    return intlLocales[locale.value] || intlLocales.ua
  })

  function formatMoney(amount: string | number, currency = 'UAH'): string {
    return new Intl.NumberFormat(activeIntlLocale.value, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(toNumber(amount))
  }

  function formatDate(date: string): string {
    if (!date) {
      return '—'
    }

    return new Intl.DateTimeFormat(activeIntlLocale.value, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date))
  }

  function formatDateTime(dateTime: string): string {
    if (!dateTime) {
      return '—'
    }

    return new Intl.DateTimeFormat(activeIntlLocale.value, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateTime))
  }

  return {
    formatMoney,
    formatDate,
    formatDateTime,
  }
}
