<script setup lang="ts">
import type { LocaleCode } from '~/locales'
import { useAppI18n } from '~/composables/useAppI18n'

const {
  locale,
  availableLocales,
  t,
  setLocale,
} = useAppI18n()

function handleChange(event: Event): void {
  const target = event.target as HTMLSelectElement

  setLocale(target.value as LocaleCode)
}
</script>

<template>
  <label class="app-language-switcher">
    <span>{{ t('app.language') }}</span>

    <select
      :value="locale"
      class="app-select"
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
  </label>
</template>
