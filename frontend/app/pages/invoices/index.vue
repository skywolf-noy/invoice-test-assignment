<script setup lang="ts">
const {
  invoices,
  isLoading,
  error,
  actionError,
  formatMoney,
  formatDate,
  t,
  refreshInvoices,
  openInvoice,
  openCreateInvoice,
  canChangeStatus,
  canDelete,
  isActionProcessing,
  changeInvoiceStatus,
  deleteInvoice,
} = useInvoicesPage()
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <header class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {{ t('app.module') }}
          </p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight">
            {{ t('invoices.title') }}
          </h1>
          <p class="mt-2 max-w-2xl text-slate-600">
            {{ t('invoices.moduleDescription') }}
          </p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <LanguageSwitcher />

          <InvoiceExportMenu
            mode="list"
            :invoices="invoices"
          />

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            @click="openCreateInvoice"
          >
            {{ t('invoices.createInvoice') }}
          </button>
        </div>
      </header>

      <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 class="text-base font-semibold">
              {{ t('invoices.listTitle') }}
            </h2>
            <p class="text-sm text-slate-500">
              {{ t('invoices.listDescription') }}
            </p>
          </div>

          <button
            type="button"
            class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            @click="refreshInvoices"
          >
            {{ t('app.refresh') }}
          </button>
        </div>

        <div v-if="actionError" class="m-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {{ actionError }}
        </div>

        <div v-if="isLoading" class="p-6 text-slate-500">
          {{ t('invoices.loadingList') }}
        </div>

        <div v-else-if="error" class="m-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          {{ error }}
        </div>

        <div v-else-if="!invoices.length" class="p-6 text-slate-500">
          {{ t('invoices.noInvoices') }}
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {{ t('fields.number') }}
                </th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {{ t('fields.supplier') }}
                </th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {{ t('fields.grossAmount') }}
                </th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {{ t('fields.status') }}
                </th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {{ t('fields.dueDate') }}
                </th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {{ t('app.actions') }}
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

                <td class="whitespace-nowrap px-5 py-4" @click.stop @keydown.stop>
                  <div v-if="canChangeStatus(invoice)" class="flex items-center gap-2">
                    <InvoiceStatusSelect
                      :invoice="invoice"
                      :processing="isActionProcessing(invoice.id)"
                      @change-status="changeInvoiceStatus(invoice, $event)"
                    />

                    <button
                      v-if="canDelete(invoice)"
                      type="button"
                      class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-300 text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
                      :disabled="isActionProcessing(invoice.id)"
                      :title="t('invoices.deleteInvoice')"
                      :aria-label="t('invoices.deleteInvoice')"
                      @click="deleteInvoice(invoice)"
                    >
                      <svg
                        class="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M9 3h6m-8 4h10m-9 0 .7 13h6.6L16 7M10 11v5m4-5v5"
                          stroke="currentColor"
                          stroke-width="1.8"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <span v-else class="text-sm font-medium text-slate-400">
                    {{ t('invoices.finalised') }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>
</template>
