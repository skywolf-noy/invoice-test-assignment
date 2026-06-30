import { useAppI18n } from '~/composables/useAppI18n'
import type { LocaleCode } from '~/locales'

export function useLanguageSwitcher() {
  const {
    locale,
    availableLocales,
    setLocale,
  } = useAppI18n()

  function handleChange(event: Event): void {
    const target = event.target as HTMLSelectElement

    setLocale(target.value as LocaleCode)
  }

  return {
    locale,
    availableLocales,
    handleChange,
  }
}
