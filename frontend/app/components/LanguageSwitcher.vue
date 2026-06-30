<script setup lang="ts">
import { useLanguageSwitcher } from '~/composables/useLanguageSwitcher'

const {
  locale,
  availableLocales,
  handleChange,
} = useLanguageSwitcher()
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
