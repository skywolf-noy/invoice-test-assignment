<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: 'pending' | 'approved' | 'rejected'
}>()

const {
  t,
} = useAppI18n()

const statusClass = computed(() => `app-badge--${props.status}`)
const statusLabel = computed(() => t(`status.${props.status}`))
</script>

<template>
  <span class="app-badge" :class="statusClass">
    {{ statusLabel }}
  </span>
</template>
