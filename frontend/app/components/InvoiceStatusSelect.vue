<script setup lang="ts">
import type { Invoice, InvoiceFinalStatus } from '~/types/invoice'

const props = defineProps<{
  invoice: Invoice
  processing?: boolean
  showLockedHint?: boolean
}>()

const emit = defineEmits<{
  'change-status': [status: InvoiceFinalStatus]
}>()

const {
  t,
} = useAppI18n()

const {
  isLocked,
  handleChange,
} = useInvoiceStatusSelect(props, emit)
</script>

<template>
  <div class="app-status-select">
    <select
      :value="invoice.status"
      :disabled="isLocked || processing"
      class="app-select"
      @change="handleChange"
    >
      <option value="pending">
        {{ t('status.pending') }}
      </option>
      <option value="approved">
        {{ t('status.approved') }}
      </option>
      <option value="rejected">
        {{ t('status.rejected') }}
      </option>
    </select>

    <span v-if="showLockedHint && isLocked" class="app-status-select__hint">
      {{ t('invoices.finalisedDocument') }}
    </span>
  </div>
</template>
