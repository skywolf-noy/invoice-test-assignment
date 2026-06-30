import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAppI18n } from '~/composables/useAppI18n'
import { useLocaleStore } from '~/stores/locale'

describe('useAppI18n', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('uses Ukrainian as default locale', () => {
    const localeStore = useLocaleStore()

    expect(localeStore.locale).toBe('ua')
  })

  it('translates keys from default Ukrainian dictionary', () => {
    const { t } = useAppI18n()

    expect(t('invoices.title')).toBe('Рахунки-фактури')
  })

  it('switches locale to English', () => {
    const localeStore = useLocaleStore()
    const { t } = useAppI18n()

    localeStore.setLocale('en')

    expect(t('invoices.title')).toBe('Invoices')
  })

  it('interpolates translation params', () => {
    const { t } = useAppI18n()

    expect(t('invoices.deleteConfirm', { number: 'INV-001' })).toContain('INV-001')
  })

  it('returns key when translation is missing', () => {
    const { t } = useAppI18n()

    expect(t('missing.translation.key')).toBe('missing.translation.key')
  })
})
