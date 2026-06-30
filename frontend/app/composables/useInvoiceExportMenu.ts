import { computed, ref, watch } from 'vue'
import { useAppI18n } from '~/composables/useAppI18n'
import { useInvoiceExport, type InvoiceExportFormat } from '~/composables/useInvoiceExport'
import type { Invoice } from '~/types/invoice'

type InvoiceExportMenuMode = 'list' | 'details'

type InvoiceExportMenuProps = {
  mode: InvoiceExportMenuMode
  invoices?: Invoice[]
  invoice?: Invoice
}

type ExportFormatOption = {
  value: InvoiceExportFormat
  label: string
}

export function useInvoiceExportMenu(props: InvoiceExportMenuProps) {
  const {
    t,
  } = useAppI18n()

  const {
    isExporting,
    activeExportFormat,
    exportInvoicePdf,
    exportInvoiceWord,
    exportInvoicesPdf,
    exportInvoicesExcel,
    exportInvoicesCsv,
  } = useInvoiceExport()

  const selectedFormat = ref<InvoiceExportFormat>('pdf')

  const hasListData = computed(() => Boolean(props.invoices?.length))
  const hasInvoiceData = computed(() => Boolean(props.invoice))

  const hasExportData = computed(() => {
    return props.mode === 'list'
      ? hasListData.value
      : hasInvoiceData.value
  })

  const formatOptions = computed<ExportFormatOption[]>(() => {
    if (props.mode === 'list') {
      return [
        {
          value: 'pdf',
          label: t('export.listPdf'),
        },
        {
          value: 'xlsx',
          label: t('export.listExcel'),
        },
        {
          value: 'csv',
          label: t('export.listCsv'),
        },
      ]
    }

    return [
      {
        value: 'pdf',
        label: t('export.invoicePdf'),
      },
      {
        value: 'docx',
        label: t('export.invoiceWord'),
      },
    ]
  })

  watch(
    () => props.mode,
    () => {
      selectedFormat.value = 'pdf'
    },
  )

  function isActive(format: InvoiceExportFormat): boolean {
    return isExporting.value && activeExportFormat.value === format
  }

  function handleFormatChange(event: Event): void {
    const target = event.target as HTMLSelectElement

    selectedFormat.value = target.value as InvoiceExportFormat
  }

  function exportSelected(): void {
    if (props.mode === 'list') {
      exportList()
      return
    }

    exportDetails()
  }

  function exportList(): void {
    if (!props.invoices?.length) {
      return
    }

    if (selectedFormat.value === 'pdf') {
      void exportInvoicesPdf(props.invoices)
      return
    }

    if (selectedFormat.value === 'xlsx') {
      void exportInvoicesExcel(props.invoices)
      return
    }

    if (selectedFormat.value === 'csv') {
      void exportInvoicesCsv(props.invoices)
    }
  }

  function exportDetails(): void {
    if (!props.invoice) {
      return
    }

    if (selectedFormat.value === 'pdf') {
      void exportInvoicePdf(props.invoice)
      return
    }

    if (selectedFormat.value === 'docx') {
      void exportInvoiceWord(props.invoice)
    }
  }

  return {
    t,
    selectedFormat,
    hasExportData,
    formatOptions,
    isExporting,
    isActive,
    handleFormatChange,
    exportSelected,
  }
}
