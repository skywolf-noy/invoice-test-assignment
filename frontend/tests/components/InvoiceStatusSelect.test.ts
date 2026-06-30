import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import InvoiceStatusSelect from '~/components/InvoiceStatusSelect.vue'
import { makeInvoice } from '../factories/invoice'

describe('InvoiceStatusSelect', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('emits selected final status for pending invoice', async () => {
    const wrapper = mount(InvoiceStatusSelect, {
      props: {
        invoice: makeInvoice({
          status: 'pending',
        }),
      },
    })

    await wrapper.find('select').setValue('approved')

    expect(wrapper.emitted('change-status')).toEqual([
      ['approved'],
    ])
  })

  it('disables select for finalised invoice and renders localized hint', () => {
    const wrapper = mount(InvoiceStatusSelect, {
      props: {
        invoice: makeInvoice({
          status: 'approved',
        }),
        showLockedHint: true,
      },
    })

    expect((wrapper.find('select').element as HTMLSelectElement).disabled).toBe(true)
    expect(wrapper.text()).toContain('Завершений документ')
  })
})
