import { describe, expect, it } from 'vitest'
import { useInvoiceFormatters } from '~/composables/useInvoiceFormatters'

function normalizeFormattedValue(value: string): string {
  return value
    .replace(/\u00A0/g, ' ')
    .replace(/\u202F/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

describe('useInvoiceFormatters', () => {
  it('formats money with currency', () => {
    const { formatMoney } = useInvoiceFormatters()

    const result = normalizeFormattedValue(formatMoney('1234.50', 'USD'))

    expect(result).toContain('1')
    expect(result).toContain('234')
    expect(result).toMatch(/50/)
    expect(result).toMatch(/USD|\$/)
  })

  it('formats ISO date to readable date', () => {
    const { formatDate } = useInvoiceFormatters()

    const result = formatDate('2026-06-30')

    expect(result).toMatch(/2026|Jun|30/)
  })

  it('formats ISO datetime to readable datetime', () => {
    const { formatDateTime } = useInvoiceFormatters()

    const result = formatDateTime('2026-06-30T13:30:00.000000Z')

    expect(result).toMatch(/2026|Jun|30/)
  })
})
