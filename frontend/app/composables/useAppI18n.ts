import { storeToRefs } from 'pinia'
import { computed, getCurrentInstance, onMounted } from 'vue'
import { DEFAULT_LOCALE, locales, type LocaleCode } from '~/locales'
import { useLocaleStore } from '~/stores/locale'

type TranslationParams = Record<string, string | number>

function getNestedValue(source: unknown, key: string): string | undefined {
  return key.split('.').reduce<unknown>((current, segment) => {
    if (current && typeof current === 'object' && segment in current) {
      return (current as Record<string, unknown>)[segment]
    }

    return undefined
  }, source) as string | undefined
}

function interpolate(value: string, params?: TranslationParams): string {
  if (!params) {
    return value
  }

  return Object.entries(params).reduce((text, [key, replacement]) => {
    return text.replaceAll(`{${key}}`, String(replacement))
  }, value)
}

export function useAppI18n() {
  const localeStore = useLocaleStore()

  const {
    locale,
  } = storeToRefs(localeStore)

  if (getCurrentInstance()) {
    onMounted(() => {
      localeStore.hydrate()
    })
  } else {
    localeStore.hydrate()
  }

  const availableLocales = computed(() => localeStore.availableLocales)
  const currentLocaleLabel = computed(() => localeStore.localeLabel)

  function t(key: string, params?: TranslationParams): string {
    const activeDictionary = locales[locale.value]
    const fallbackDictionary = locales[DEFAULT_LOCALE]

    const translatedValue =
      getNestedValue(activeDictionary, key) ||
      getNestedValue(fallbackDictionary, key) ||
      key

    return interpolate(translatedValue, params)
  }

  function setLocale(nextLocale: LocaleCode): void {
    localeStore.setLocale(nextLocale)
  }

  function toggleLocale(): void {
    localeStore.toggleLocale()
  }

  return {
    locale,
    availableLocales,
    currentLocaleLabel,
    t,
    setLocale,
    toggleLocale,
  }
}
