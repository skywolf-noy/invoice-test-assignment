<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAppI18n } from '~/composables/useAppI18n'
import { useInvoiceExport, type InvoiceExportFormat } from '~/composables/useInvoiceExport'
import type { Invoice } from '~/types/invoice'

const props = defineProps<{
  mode: 'list' | 'details'
  invoices?: Invoice[]
  invoice?: Invoice
}>()

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
const hasExportData = computed(() => props.mode === 'list' ? hasListData.value : hasInvoiceData.value)

const formatOptions = computed(() => {
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
    ] as Array<{ value: InvoiceExportFormat; label: string }>
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
  ] as Array<{ value: InvoiceExportFormat; label: string }>
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

    return
  }

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
</script>

<template>
  <div class="app-export-menu">
    <select
      :value="selectedFormat"
      class="app-select app-select--compact"
      :disabled="!hasExportData || isExporting"
      :aria-label="t('export.title')"
      @change="handleFormatChange"
    >
      <option
        v-for="option in formatOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <button
      type="button"
      class="app-button app-button--secondary app-button--compact"
      :disabled="!hasExportData || isExporting"
      @click="exportSelected"
    >
      {{ isActive(selectedFormat) ? t('export.exporting') : t('export.title') }}
    </button>
  </div>
</template>
