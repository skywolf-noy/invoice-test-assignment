<script setup lang="ts">
import { computed } from 'vue'
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
  if (!props.invoices?.length) {
    return
  }

  void exportInvoicesPdf(props.invoices)
}

function exportListExcel(): void {
  if (!props.invoices?.length) {
    return
  }

  void exportInvoicesExcel(props.invoices)
}

function exportListCsv(): void {
  if (!props.invoices?.length) {
    return
  }

  void exportInvoicesCsv(props.invoices)
}

function exportDetailsPdf(): void {
  if (!props.invoice) {
    return
  }

  void exportInvoicePdf(props.invoice)
}

function exportDetailsWord(): void {
  if (!props.invoice) {
    return
  }

  void exportInvoiceWord(props.invoice)
}
</script>

<template>
  <div class="inline-flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
    <span class="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
      {{ t('export.title') }}
    </span>

    <template v-if="mode === 'list'">
      <button
        type="button"
        class="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!hasListData || isExporting"
        :title="t('export.exportAsPdf')"
        @click="exportListPdf"
      >
        {{ isActive('pdf') ? t('export.exporting') : t('export.listPdf') }}
      </button>

      <button
        type="button"
        class="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!hasListData || isExporting"
        :title="t('export.exportAsExcel')"
        @click="exportListExcel"
      >
        {{ isActive('xlsx') ? t('export.exporting') : t('export.listExcel') }}
      </button>

      <button
        type="button"
        class="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
        class="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!hasInvoiceData || isExporting"
        :title="t('export.exportAsPdf')"
        @click="exportDetailsPdf"
      >
        {{ isActive('pdf') ? t('export.exporting') : t('export.invoicePdf') }}
      </button>

      <button
        type="button"
        class="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!hasInvoiceData || isExporting"
        :title="t('export.exportAsWord')"
        @click="exportDetailsWord"
      >
        {{ isActive('docx') ? t('export.exporting') : t('export.invoiceWord') }}
      </button>
    </template>
  </div>
</template>
