<script setup lang="ts">
import type { LocaleCode } from '~/locales'

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
  <label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
    <span>{{ t('app.language') }}</span>

    <select
      :value="locale"
      class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
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
