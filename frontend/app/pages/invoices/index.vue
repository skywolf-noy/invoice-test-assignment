<script setup lang="ts">
import type { Invoice } from '~/types/invoice'

const { listInvoices } = useInvoicesApi()

const {
  data: invoices,
  pending,
  error,
  refresh,
} = await useAsyncData<Invoice[]>(
  'invoices',
  () => listInvoices(),
  {
    server: false,
    default: () => [],
  },
)

function handleRefresh(): void {
  void refresh()
}

function formatMoney(amount: string, currency: string): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency,
  }).format(Number(amount))
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('uk-UA', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(date))
}

function openInvoice(invoice: Invoice): void {
  navigateTo(`/invoices/${invoice.id}`)
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <header class="mb-8">
        <p class="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Invoice module
        </p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight">
          Invoices
        </h1>
        <p class="mt-2 max-w-2xl text-slate-600">
          Minimal full-stack invoice management module with Laravel API and Nuxt frontend.
        </p>
      </header>

      <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 class="text-base font-semibold">
              Invoice list
            </h2>
            <p class="text-sm text-slate-500">
              Sorted by newest records from the backend.
            </p>
          </div>

          <button
            type="button"
            class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            @click="handleRefresh"
          >
            Refresh
          </button>
        </div>

        <div v-if="pending" class="p-6 text-slate-500">
          Loading invoices...
        </div>

        <div v-else-if="error" class="m-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          Failed to load invoices. Check whether the backend is running.
        </div>

        <div v-else-if="!invoices.length" class="p-6 text-slate-500">
          No invoices found.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Number
                </th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Supplier
                </th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Gross amount
                </th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Due date
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100 bg-white">
              <tr
                v-for="invoice in invoices"
                :key="invoice.id"
                class="cursor-pointer transition hover:bg-slate-50"
                tabindex="0"
                role="button"
                @click="openInvoice(invoice)"
                @keydown.enter="openInvoice(invoice)"
              >
                <td class="whitespace-nowrap px-5 py-4 font-semibold text-slate-950">
                  {{ invoice.number }}
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-700">
                  {{ invoice.supplier_name }}
                </td>
                <td class="whitespace-nowrap px-5 py-4 font-medium text-slate-950">
                  {{ formatMoney(invoice.gross_amount, invoice.currency) }}
                </td>
                <td class="whitespace-nowrap px-5 py-4">
                  <InvoiceStatusBadge :status="invoice.status" />
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-700">
                  {{ formatDate(invoice.due_date) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>
</template>
