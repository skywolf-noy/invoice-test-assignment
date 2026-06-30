<script setup lang="ts">
import { useAppI18n } from '~/composables/useAppI18n'
import type { LocaleCode } from '~/locales'

const {
  locale,
  availableLocales,
  setLocale,
} = useAppI18n()

function handleChange(event: Event): void {
  const target = event.target as HTMLSelectElement

  setLocale(target.value as LocaleCode)
}
</script>

<template>
  <select
    :value="locale"
    class="app-select app-select--compact"
    aria-label="Language"
    @change="handleChange"
  >
    <option
      v-for="availableLocale in availableLocales"
      :key="availableLocale"
      :value="availableLocale"
    >
      {{ availableLocale.toUpperCase() }}
    </option>
  </select>
</template>
