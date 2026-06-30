import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import InvoiceStatusBadge from '~/components/InvoiceStatusBadge.vue'

describe('InvoiceStatusBadge', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders translated status label', () => {
    const wrapper = mount(InvoiceStatusBadge, {
      props: {
        status: 'approved',
      },
    })

    expect(wrapper.text()).toContain('Затверджено')
  })

  it('applies semantic status class', () => {
    const wrapper = mount(InvoiceStatusBadge, {
      props: {
        status: 'rejected',
      },
    })

    expect(wrapper.classes()).toContain('app-badge')
    expect(wrapper.classes()).toContain('app-badge--rejected')
  })
})
