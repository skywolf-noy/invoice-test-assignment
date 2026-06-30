<script setup lang="ts">
const {
  goBack,
  handleCreated,
} = useInvoiceCreatePage()
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-5xl">
      <button
        type="button"
        class="mb-6 inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
        @click="goBack"
      >
        Back to invoices
      </button>

      <header class="mb-6">
        <p class="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Invoice module
        </p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight">
          Create invoice
        </h1>
        <p class="mt-2 max-w-2xl text-slate-600">
          Create a new pending invoice with automatic gross amount calculation and server-side validation.
        </p>
      </header>

      <InvoiceCreateForm @created="handleCreated" />
    </div>
  </main>
</template>
