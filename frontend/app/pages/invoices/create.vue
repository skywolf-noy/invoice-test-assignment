<script setup lang="ts">
const {
  t,
  goBack,
  handleCreated,
} = useInvoiceCreatePage()
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-5xl">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          class="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
          @click="goBack"
        >
          {{ t('navigation.backToInvoices') }}
        </button>

        <LanguageSwitcher />
      </div>

      <header class="mb-6">
        <p class="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {{ t('app.module') }}
        </p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight">
          {{ t('invoices.createTitle') }}
        </h1>
        <p class="mt-2 max-w-2xl text-slate-600">
          {{ t('invoices.createDescription') }}
        </p>
      </header>

      <InvoiceCreateForm @created="handleCreated" />
    </div>
  </main>
</template>
