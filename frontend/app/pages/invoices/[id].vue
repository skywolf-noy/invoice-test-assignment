<script setup lang="ts">
const {
  invoice,
  isLoading,
  error,
  actionError,
  formatMoney,
  formatDate,
  formatDateTime,
  t,
  goBack,
  refreshDetails,
  handleUpdated,
  canDelete,
  isActionProcessing,
  changeInvoiceStatus,
  deleteInvoice,
} = useInvoiceDetailsPage()

definePageMeta({
  validate: (route) => /^\d+$/.test(String(route.params.id)),
})
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

      <div v-if="isLoading" class="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
        {{ t('invoices.loadingDetails') }}
      </div>

      <div v-else-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        {{ error }}
      </div>

      <div v-else-if="!invoice" class="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
        {{ t('invoices.notFound') }}
      </div>

      <div v-else class="space-y-6">
        <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {{ t('invoices.detailsTitle') }}
              </p>
              <h1 class="mt-2 text-3xl font-bold tracking-tight">
                {{ invoice.number }}
              </h1>
              <p class="mt-2 text-slate-600">
                {{ invoice.supplier_name }} · {{ t('fields.supplierTaxId') }}: {{ invoice.supplier_tax_id }}
              </p>
            </div>

            <div class="flex flex-col items-start gap-3 sm:items-end">
              <InvoiceStatusBadge :status="invoice.status" />

              <InvoiceExportMenu
                mode="details"
                :invoice="invoice"
              />
            </div>
          </div>

          <dl class="mt-8 grid gap-5 md:grid-cols-3">
            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="text-sm font-medium text-slate-500">
                {{ t('fields.netAmount') }}
              </dt>
              <dd class="mt-1 text-lg font-semibold">
                {{ formatMoney(invoice.net_amount, invoice.currency) }}
              </dd>
            </div>

            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="text-sm font-medium text-slate-500">
                {{ t('fields.vatAmount') }}
              </dt>
              <dd class="mt-1 text-lg font-semibold">
                {{ formatMoney(invoice.vat_amount, invoice.currency) }}
              </dd>
            </div>

            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="text-sm font-medium text-slate-500">
                {{ t('fields.grossAmount') }}
              </dt>
              <dd class="mt-1 text-lg font-semibold">
                {{ formatMoney(invoice.gross_amount, invoice.currency) }}
              </dd>
            </div>

            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="text-sm font-medium text-slate-500">
                {{ t('fields.issueDate') }}
              </dt>
              <dd class="mt-1 font-semibold">
                {{ formatDate(invoice.issue_date) }}
              </dd>
            </div>

            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="text-sm font-medium text-slate-500">
                {{ t('fields.dueDate') }}
              </dt>
              <dd class="mt-1 font-semibold">
                {{ formatDate(invoice.due_date) }}
              </dd>
            </div>

            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="text-sm font-medium text-slate-500">
                {{ t('fields.lastUpdated') }}
              </dt>
              <dd class="mt-1 font-semibold">
                {{ formatDateTime(invoice.updated_at) }}
              </dd>
            </div>
          </dl>

          <div class="mt-6">
            <button
              type="button"
              class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              @click="refreshDetails"
            >
              {{ t('invoices.refreshDetails') }}
            </button>
          </div>
        </section>

        <InvoiceEditForm
          :invoice="invoice"
          :lifecycle-error="actionError"
          :lifecycle-processing="isActionProcessing(invoice.id)"
          :delete-processing="isActionProcessing(invoice.id, 'delete')"
          :show-delete="canDelete(invoice)"
          @updated="handleUpdated"
          @change-status="changeInvoiceStatus"
          @delete="deleteInvoice"
        />
      </div>
    </div>
  </main>
</template>
