<script setup lang="ts">
import { useInvoiceExportMenu } from '~/composables/useInvoiceExportMenu'
import type { Invoice } from '~/types/invoice'

const props = defineProps<{
  mode: 'list' | 'details'
  invoices?: Invoice[]
  invoice?: Invoice
}>()

const {
  t,
  selectedFormat,
  hasExportData,
  formatOptions,
  isExporting,
  isActive,
  handleFormatChange,
  exportSelected,
} = useInvoiceExportMenu(props)
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
