import { defineStore } from 'pinia'
import {
  DEFAULT_LOCALE,
  localeLabels,
  locales,
  type LocaleCode,
} from '~/locales'

const STORAGE_KEY = 'invoice-manager-locale'

function isLocaleCode(value: string): value is LocaleCode {
  return value in locales
}

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    locale: DEFAULT_LOCALE as LocaleCode,
    isHydrated: false,
  }),

  getters: {
    dictionary: (state) => locales[state.locale],
    availableLocales: () => Object.keys(locales) as LocaleCode[],
    localeLabel: (state) => localeLabels[state.locale],
  },

  actions: {
    hydrate(): void {
      if (this.isHydrated || !import.meta.client) {
        return
      }

      const savedLocale = window.localStorage.getItem(STORAGE_KEY)

      if (savedLocale && isLocaleCode(savedLocale)) {
        this.locale = savedLocale
      }

      this.isHydrated = true
    },

    setLocale(locale: LocaleCode): void {
      this.locale = locale

      if (import.meta.client) {
        window.localStorage.setItem(STORAGE_KEY, locale)
      }
    },

    toggleLocale(): void {
      this.setLocale(this.locale === 'ua' ? 'en' : 'ua')
    },
  },
})
