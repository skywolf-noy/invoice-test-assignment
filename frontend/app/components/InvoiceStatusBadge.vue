<script setup lang="ts">
import type { InvoiceStatus } from '~/types/invoice'

const props = defineProps<{
  status: InvoiceStatus
}>()

const labels: Record<InvoiceStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
}

const classes: Record<InvoiceStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 ring-amber-200',
  approved: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  rejected: 'bg-rose-100 text-rose-800 ring-rose-200',
}
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset"
    :class="classes[props.status]"
  >
    {{ labels[props.status] }}
  </span>
</template>
