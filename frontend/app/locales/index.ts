import { en } from './en'
import { ua } from './ua'

export const locales = {
  ua,
  en,
} as const

export type LocaleCode = keyof typeof locales
export type LocaleDictionary = typeof ua

export const DEFAULT_LOCALE: LocaleCode = 'ua'

export const localeLabels: Record<LocaleCode, string> = {
  ua: 'UA',
  en: 'EN',
}
