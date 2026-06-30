<script setup lang="ts">
import type { Invoice } from '~/types/invoice'

const route = useRoute()
const invoiceId = computed(() => Number(route.params.id))

const {
  invoice,
  isLoading,
  error,
  refreshDetails,
  setInvoice,
} = useInvoiceDetails(invoiceId)

const {
  formatMoney,
  formatDate,
  formatDateTime,
} = useInvoiceFormatters()

function goBack(): void {
  void navigateTo('/invoices')
}

function handleUpdated(updatedInvoice: Invoice): void {
  setInvoice(updatedInvoice)
}
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

      <div v-if="isLoading" class="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
        Loading invoice...
      </div>

      <div v-else-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        Failed to load invoice. Check whether the record exists and backend is running.
      </div>

      <div v-else-if="!invoice" class="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
        Invoice not found.
      </div>

      <div v-else class="space-y-6">
        <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Invoice details
              </p>
              <h1 class="mt-2 text-3xl font-bold tracking-tight">
                {{ invoice.number }}
              </h1>
              <p class="mt-2 text-slate-600">
                {{ invoice.supplier_name }} · Tax ID: {{ invoice.supplier_tax_id }}
              </p>
            </div>

            <InvoiceStatusBadge :status="invoice.status" />
          </div>

          <dl class="mt-8 grid gap-5 md:grid-cols-3">
            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="text-sm font-medium text-slate-500">
                Net amount
              </dt>
              <dd class="mt-1 text-lg font-semibold">
                {{ formatMoney(invoice.net_amount, invoice.currency) }}
              </dd>
            </div>

            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="text-sm font-medium text-slate-500">
                VAT amount
              </dt>
              <dd class="mt-1 text-lg font-semibold">
                {{ formatMoney(invoice.vat_amount, invoice.currency) }}
              </dd>
            </div>

            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="text-sm font-medium text-slate-500">
                Gross amount
              </dt>
              <dd class="mt-1 text-lg font-semibold">
                {{ formatMoney(invoice.gross_amount, invoice.currency) }}
              </dd>
            </div>

            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="text-sm font-medium text-slate-500">
                Issue date
              </dt>
              <dd class="mt-1 font-semibold">
                {{ formatDate(invoice.issue_date) }}
              </dd>
            </div>

            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="text-sm font-medium text-slate-500">
                Due date
              </dt>
              <dd class="mt-1 font-semibold">
                {{ formatDate(invoice.due_date) }}
              </dd>
            </div>

            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="text-sm font-medium text-slate-500">
                Last updated
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
              Refresh details
            </button>
          </div>
        </section>

        <InvoiceEditForm :invoice="invoice" @updated="handleUpdated" />
      </div>
    </div>
  </main>
</template>
