<script setup lang="ts">
import { toRef } from 'vue'
import type { Invoice, InvoiceFinalStatus } from '~/types/invoice'

const props = defineProps<{
  invoice: Invoice
  lifecycleError?: string
  lifecycleProcessing?: boolean
  deleteProcessing?: boolean
  showDelete?: boolean
}>()

const emit = defineEmits<{
  updated: [invoice: Invoice]
  'change-status': [status: InvoiceFinalStatus]
  delete: []
}>()

const invoiceRef = toRef(props, 'invoice')

const {
  isEditable,
  serverError,
  serverValidationErrors,
  errors,
  isSubmitting,
  netAmount,
  netAmountAttrs,
  vatAmount,
  vatAmountAttrs,
  dueDate,
  dueDateAttrs,
  grossAmount,
  submit,
} = useInvoiceEditForm(invoiceRef, (updatedInvoice) => {
  emit('updated', updatedInvoice)
})

function handleStatusChange(status: InvoiceFinalStatus): void {
  emit('change-status', status)
}

function handleDelete(): void {
  emit('delete')
}
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-950">
          Edit invoice
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Pending invoices can be edited, approved, rejected or deleted. Final invoices are locked.
        </p>
      </div>

      <div
        v-if="!isEditable"
        class="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600"
      >
        Editing is disabled for this status.
      </div>
    </div>

    <form class="space-y-5" @submit.prevent="submit">
      <fieldset :disabled="!isEditable || isSubmitting" class="space-y-5 disabled:opacity-60">
        <div class="grid gap-5 md:grid-cols-3">
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700">Net amount</span>
            <input
              v-model="netAmount"
              v-bind="netAmountAttrs"
              type="number"
              step="0.01"
              min="0"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            >
            <span v-if="errors.net_amount" class="mt-1 block text-sm text-rose-600">
              {{ errors.net_amount }}
            </span>
            <span v-if="serverValidationErrors.net_amount?.[0]" class="mt-1 block text-sm text-rose-600">
              {{ serverValidationErrors.net_amount[0] }}
            </span>
          </label>

          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700">VAT amount</span>
            <input
              v-model="vatAmount"
              v-bind="vatAmountAttrs"
              type="number"
              step="0.01"
              min="0"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            >
            <span v-if="errors.vat_amount" class="mt-1 block text-sm text-rose-600">
              {{ errors.vat_amount }}
            </span>
            <span v-if="serverValidationErrors.vat_amount?.[0]" class="mt-1 block text-sm text-rose-600">
              {{ serverValidationErrors.vat_amount[0] }}
            </span>
          </label>

          <div class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700">Gross amount</span>
            <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-950">
              {{ grossAmount }} {{ invoice.currency }}
            </div>
            <p class="mt-1 text-xs text-slate-500">
              Calculated as net amount + VAT amount.
            </p>
            <span v-if="serverValidationErrors.gross_amount?.[0]" class="mt-1 block text-sm text-rose-600">
              {{ serverValidationErrors.gross_amount[0] }}
            </span>
          </div>
        </div>

        <label class="block max-w-sm">
          <span class="mb-1 block text-sm font-medium text-slate-700">Due date</span>
          <input
            v-model="dueDate"
            v-bind="dueDateAttrs"
            type="date"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
          <span v-if="errors.due_date" class="mt-1 block text-sm text-rose-600">
            {{ errors.due_date }}
          </span>
          <span v-if="serverValidationErrors.due_date?.[0]" class="mt-1 block text-sm text-rose-600">
            {{ serverValidationErrors.due_date[0] }}
          </span>
        </label>
      </fieldset>

      <div v-if="serverError" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ serverError }}
      </div>

      <div v-if="lifecycleError" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ lifecycleError }}
      </div>

      <div class="border-t border-slate-200 pt-5">
        <div class="mb-4 grid gap-4 md:grid-cols-3">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">
              Status
            </label>
            <InvoiceStatusSelect
              :invoice="invoice"
              :processing="lifecycleProcessing"
              show-locked-hint
              @change-status="handleStatusChange"
            />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            :disabled="!isEditable || isSubmitting"
          >
            {{ isSubmitting ? 'Saving...' : 'Save changes' }}
          </button>

          <button
            v-if="showDelete"
            type="button"
            class="inline-flex items-center justify-center rounded-xl border border-rose-300 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="deleteProcessing"
            @click="handleDelete"
          >
            {{ deleteProcessing ? 'Deleting...' : 'Delete invoice' }}
          </button>
        </div>
      </div>
    </form>
  </section>
</template>
