<script setup lang="ts">
import { computed } from 'vue'
import type { Invoice, InvoiceFinalStatus } from '~/types/invoice'

const props = defineProps<{
  invoice: Invoice
  processing?: boolean
  showLockedHint?: boolean
}>()

const emit = defineEmits<{
  'change-status': [status: InvoiceFinalStatus]
}>()

const isLocked = computed(() => props.invoice.status !== 'pending')

function handleChange(event: Event): void {
  const target = event.target as HTMLSelectElement
  const selectedStatus = target.value

  if (selectedStatus !== 'approved' && selectedStatus !== 'rejected') {
    return
  }

  emit('change-status', selectedStatus)
}
</script>

<template>
  <div class="inline-flex flex-col gap-1">
    <select
      :value="invoice.status"
      :disabled="isLocked || processing"
      class="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      @change="handleChange"
    >
      <option value="pending">
        Pending
      </option>
      <option value="approved">
        Approved
      </option>
      <option value="rejected">
        Rejected
      </option>
    </select>

    <span v-if="showLockedHint && isLocked" class="text-xs font-medium text-slate-400">
      Finalised document
    </span>
  </div>
</template>
