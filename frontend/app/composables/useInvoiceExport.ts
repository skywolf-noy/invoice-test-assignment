import { ref } from 'vue'
import { exportInvoiceToDocx } from '~/services/export/exportInvoiceToDocx'
import { exportInvoiceToPdf } from '~/services/export/exportInvoiceToPdf'
import { exportInvoicesToCsv } from '~/services/export/exportInvoicesToCsv'
import { exportInvoicesToExcel } from '~/services/export/exportInvoicesToExcel'
import { exportInvoicesToPdf } from '~/services/export/exportInvoicesToPdf'
import type { Invoice } from '~/types/invoice'

export type InvoiceExportFormat = 'pdf' | 'xlsx' | 'docx' | 'csv'

export function useInvoiceExport() {
  const isExporting = ref(false)
  const activeExportFormat = ref<InvoiceExportFormat | null>(null)

  const {
    t,
  } = useAppI18n()

  const {
    formatMoney,
    formatDate,
    formatDateTime,
  } = useInvoiceFormatters()

  const {
    notifySuccess,
    notifyError,
  } = useNotifications()

  const exportContext = {
    t,
    formatMoney,
    formatDate,
    formatDateTime,
  }

  async function runExport(
    format: InvoiceExportFormat,
    callback: () => Promise<void>,
  ): Promise<void> {
    isExporting.value = true
    activeExportFormat.value = format

    try {
      await callback()
      notifySuccess('notifications.exported')
    } catch {
      notifyError('notifications.failed')
    } finally {
      isExporting.value = false
      activeExportFormat.value = null
    }
  }

  function exportInvoicePdf(invoice: Invoice): Promise<void> {
    return runExport('pdf', () => exportInvoiceToPdf(invoice, exportContext))
  }

  function exportInvoiceWord(invoice: Invoice): Promise<void> {
    return runExport('docx', () => exportInvoiceToDocx(invoice, exportContext))
  }

  function exportInvoicesPdf(invoices: Invoice[]): Promise<void> {
    return runExport('pdf', () => exportInvoicesToPdf(invoices, exportContext))
  }

  function exportInvoicesExcel(invoices: Invoice[]): Promise<void> {
    return runExport('xlsx', () => exportInvoicesToExcel(invoices, exportContext))
  }

  function exportInvoicesCsv(invoices: Invoice[]): Promise<void> {
    return runExport('csv', () => exportInvoicesToCsv(invoices, exportContext))
  }

  return {
    isExporting,
    activeExportFormat,
    exportInvoicePdf,
    exportInvoiceWord,
    exportInvoicesPdf,
    exportInvoicesExcel,
    exportInvoicesCsv,
  }
}
