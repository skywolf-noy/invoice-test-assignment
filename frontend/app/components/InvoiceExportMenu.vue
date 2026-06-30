<script setup lang="ts">
import { computed } from 'vue'
import { useAppI18n } from '~/composables/useAppI18n'
import { useInvoiceExport } from '~/composables/useInvoiceExport'
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

const hasListData = computed(() => Boolean(props.invoices?.length))
const hasInvoiceData = computed(() => Boolean(props.invoice))

function isActive(format: string): boolean {
  return isExporting.value && activeExportFormat.value === format
}

function exportListPdf(): void {
  if (props.invoices?.length) {
    void exportInvoicesPdf(props.invoices)
  }
}

function exportListExcel(): void {
  if (props.invoices?.length) {
    void exportInvoicesExcel(props.invoices)
  }
}

function exportListCsv(): void {
  if (props.invoices?.length) {
    void exportInvoicesCsv(props.invoices)
  }
}

function exportDetailsPdf(): void {
  if (props.invoice) {
    void exportInvoicePdf(props.invoice)
  }
}

function exportDetailsWord(): void {
  if (props.invoice) {
    void exportInvoiceWord(props.invoice)
  }
}
</script>

<template>
  <div class="app-export-menu">
    <span class="app-export-menu__label">
      {{ t('export.title') }}
    </span>

    <template v-if="mode === 'list'">
      <button
        type="button"
        class="app-button app-button--secondary app-button--compact"
        :disabled="!hasListData || isExporting"
        :title="t('export.exportAsPdf')"
        @click="exportListPdf"
      >
        {{ isActive('pdf') ? t('export.exporting') : t('export.listPdf') }}
      </button>

      <button
        type="button"
        class="app-button app-button--secondary app-button--compact"
        :disabled="!hasListData || isExporting"
        :title="t('export.exportAsExcel')"
        @click="exportListExcel"
      >
        {{ isActive('xlsx') ? t('export.exporting') : t('export.listExcel') }}
      </button>

      <button
        type="button"
        class="app-button app-button--secondary app-button--compact"
        :disabled="!hasListData || isExporting"
        :title="t('export.exportAsCsv')"
        @click="exportListCsv"
      >
        {{ isActive('csv') ? t('export.exporting') : t('export.listCsv') }}
      </button>
    </template>

    <template v-else>
      <button
        type="button"
        class="app-button app-button--secondary app-button--compact"
        :disabled="!hasInvoiceData || isExporting"
        :title="t('export.exportAsPdf')"
        @click="exportDetailsPdf"
      >
        {{ isActive('pdf') ? t('export.exporting') : t('export.invoicePdf') }}
      </button>

      <button
        type="button"
        class="app-button app-button--secondary app-button--compact"
        :disabled="!hasInvoiceData || isExporting"
        :title="t('export.exportAsWord')"
        @click="exportDetailsWord"
      >
        {{ isActive('docx') ? t('export.exporting') : t('export.invoiceWord') }}
      </button>
    </template>
  </div>
</template>
