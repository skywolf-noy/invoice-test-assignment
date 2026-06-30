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

  it('renders Ukrainian locale by default without visible label', () => {
    const wrapper = mount(LanguageSwitcher)
    const select = wrapper.find('select')

    expect(select.exists()).toBe(true)
    expect(select.attributes('aria-label')).toBe('Language')
    expect((select.element as HTMLSelectElement).value).toBe('ua')
    expect(wrapper.text()).toContain('UA')
    expect(wrapper.text()).toContain('EN')
    expect(wrapper.text()).not.toContain('Мова')
  })

  it('switches locale to English', async () => {
    const wrapper = mount(LanguageSwitcher)
    const localeStore = useLocaleStore()

    await wrapper.find('select').setValue('en')

    expect(localeStore.locale).toBe('en')
  })
})
