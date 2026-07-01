import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useInvoiceFormatters } from '~/composables/useInvoiceFormatters'
import { useLocaleStore } from '~/stores/locale'

function normalizeFormattedValue(value: string): string {
  return value
    .replace(/\u00A0/g, ' ')
    .replace(/\u202F/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

describe('useInvoiceFormatters', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('formats money with currency', () => {
    const { formatMoney } = useInvoiceFormatters()

    const result = normalizeFormattedValue(formatMoney('1234.50', 'USD'))

    expect(result).toContain('1')
    expect(result).toContain('234')
    expect(result).toMatch(/50/)
    expect(result).toMatch(/USD|\$/)
  })

  it('formats date with Ukrainian locale by default', () => {
    const { formatDate } = useInvoiceFormatters()

    const result = formatDate('2026-06-30')

    expect(result).toMatch(/2026/)
    expect(result).toMatch(/черв|черв\.|06/)
  })

  it('formats date with English locale when language is English', () => {
    const localeStore = useLocaleStore()
    const { formatDate } = useInvoiceFormatters()

    localeStore.setLocale('en')

    const result = formatDate('2026-06-30')

    expect(result).toMatch(/2026/)
    expect(result).toMatch(/Jun|June/)
    expect(result).not.toMatch(/черв/)
  })

  it('formats datetime with English locale when language is English', () => {
    const localeStore = useLocaleStore()
    const { formatDateTime } = useInvoiceFormatters()

    localeStore.setLocale('en')

    const result = formatDateTime('2026-06-30T13:30:00.000000Z')

    expect(result).toMatch(/2026/)
    expect(result).toMatch(/Jun|June/)
    expect(result).not.toMatch(/черв/)
  })
})
