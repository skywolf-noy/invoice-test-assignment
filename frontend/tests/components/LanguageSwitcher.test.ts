import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'
import { useLocaleStore } from '~/stores/locale'

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.localStorage.clear()
  })

  it('renders Ukrainian locale by default', () => {
    const wrapper = mount(LanguageSwitcher)

    expect(wrapper.text()).toContain('Мова')
    expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('ua')
  })

  it('switches locale to English', async () => {
    const wrapper = mount(LanguageSwitcher)
    const localeStore = useLocaleStore()

    await wrapper.find('select').setValue('en')

    expect(localeStore.locale).toBe('en')
  })
})
