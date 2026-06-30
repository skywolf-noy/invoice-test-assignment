import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import InvoiceExportMenu from '~/components/InvoiceExportMenu.vue'
import { makeInvoice } from '../factories/invoice'

const exportMocks = vi.hoisted(() => ({
  exportInvoicePdf: vi.fn(),
  exportInvoiceWord: vi.fn(),
  exportInvoicesPdf: vi.fn(),
  exportInvoicesExcel: vi.fn(),
  exportInvoicesCsv: vi.fn(),
}))

vi.mock('~/composables/useInvoiceExport', async () => {
  const vue = await vi.importActual<typeof import('vue')>('vue')

  return {
    useInvoiceExport: () => ({
      isExporting: vue.ref(false),
      activeExportFormat: vue.ref(null),
      exportInvoicePdf: exportMocks.exportInvoicePdf,
      exportInvoiceWord: exportMocks.exportInvoiceWord,
      exportInvoicesPdf: exportMocks.exportInvoicesPdf,
      exportInvoicesExcel: exportMocks.exportInvoicesExcel,
      exportInvoicesCsv: exportMocks.exportInvoicesCsv,
    }),
  }
})

describe('InvoiceExportMenu', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('exports invoice list as PDF by default', async () => {
    const invoice = makeInvoice()

    const wrapper = mount(InvoiceExportMenu, {
      props: {
        mode: 'list',
        invoices: [invoice],
      },
    })

    await wrapper.find('button').trigger('click')

    expect(exportMocks.exportInvoicesPdf).toHaveBeenCalledWith([invoice])
  })

  it('exports invoice list as Excel after selecting xlsx', async () => {
    const invoice = makeInvoice()

    const wrapper = mount(InvoiceExportMenu, {
      props: {
        mode: 'list',
        invoices: [invoice],
      },
    })

    await wrapper.find('select').setValue('xlsx')
    await wrapper.find('button').trigger('click')

    expect(exportMocks.exportInvoicesExcel).toHaveBeenCalledWith([invoice])
  })

  it('exports invoice list as CSV after selecting csv', async () => {
    const invoice = makeInvoice()

    const wrapper = mount(InvoiceExportMenu, {
      props: {
        mode: 'list',
        invoices: [invoice],
      },
    })

    await wrapper.find('select').setValue('csv')
    await wrapper.find('button').trigger('click')

    expect(exportMocks.exportInvoicesCsv).toHaveBeenCalledWith([invoice])
  })

  it('exports invoice details as Word after selecting docx', async () => {
    const invoice = makeInvoice()

    const wrapper = mount(InvoiceExportMenu, {
      props: {
        mode: 'details',
        invoice,
      },
    })

    await wrapper.find('select').setValue('docx')
    await wrapper.find('button').trigger('click')

    expect(exportMocks.exportInvoiceWord).toHaveBeenCalledWith(invoice)
  })

  it('disables export controls when there are no invoices', () => {
    const wrapper = mount(InvoiceExportMenu, {
      props: {
        mode: 'list',
        invoices: [],
      },
    })

    expect(wrapper.find('select').attributes('disabled')).toBeDefined()
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
})
