<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: 'pending' | 'approved' | 'rejected'
}>()

const {
  t,
} = useAppI18n()

const statusClass = computed(() => {
  return {
    pending: 'border-amber-200 bg-amber-50 text-amber-700',
    approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    rejected: 'border-rose-200 bg-rose-50 text-rose-700',
  }[props.status]
})

const statusLabel = computed(() => t(`status.${props.status}`))
</script>

<template>
  <span
    class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide"
    :class="statusClass"
  >
    {{ statusLabel }}
  </span>
</template>
