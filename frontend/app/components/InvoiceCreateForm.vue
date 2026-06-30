<script setup lang="ts">
import type { Invoice } from '~/types/invoice'

const emit = defineEmits<{
  created: [invoice: Invoice]
}>()

const {
  serverError,
  serverValidationErrors,
  errors,
  isSubmitting,
  number,
  numberAttrs,
  supplierName,
  supplierNameAttrs,
  supplierTaxId,
  supplierTaxIdAttrs,
  netAmount,
  netAmountAttrs,
  vatAmount,
  vatAmountAttrs,
  currency,
  currencyAttrs,
  issueDate,
  issueDateAttrs,
  dueDate,
  dueDateAttrs,
  grossAmount,
  submit,
} = useInvoiceCreateForm((createdInvoice) => {
  emit('created', createdInvoice)
})
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-slate-950">
        Create invoice
      </h2>
      <p class="mt-1 text-sm text-slate-500">
        Fill in supplier, dates and financial values. Gross amount is calculated automatically.
      </p>
    </div>

    <form class="space-y-6" @submit.prevent="submit">
      <div class="grid gap-5 md:grid-cols-3">
        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700">Invoice number</span>
          <input
            v-model="number"
            v-bind="numberAttrs"
            type="text"
            placeholder="INV-2026-004"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
          <span v-if="errors.number" class="mt-1 block text-sm text-rose-600">
            {{ errors.number }}
          </span>
          <span v-if="serverValidationErrors.number?.[0]" class="mt-1 block text-sm text-rose-600">
            {{ serverValidationErrors.number[0] }}
          </span>
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700">Supplier name</span>
          <input
            v-model="supplierName"
            v-bind="supplierNameAttrs"
            type="text"
            placeholder="Supplier LLC"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
          <span v-if="errors.supplier_name" class="mt-1 block text-sm text-rose-600">
            {{ errors.supplier_name }}
          </span>
          <span v-if="serverValidationErrors.supplier_name?.[0]" class="mt-1 block text-sm text-rose-600">
            {{ serverValidationErrors.supplier_name[0] }}
          </span>
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700">Supplier tax ID</span>
          <input
            v-model="supplierTaxId"
            v-bind="supplierTaxIdAttrs"
            type="text"
            placeholder="UA12345678"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
          <span v-if="errors.supplier_tax_id" class="mt-1 block text-sm text-rose-600">
            {{ errors.supplier_tax_id }}
          </span>
          <span v-if="serverValidationErrors.supplier_tax_id?.[0]" class="mt-1 block text-sm text-rose-600">
            {{ serverValidationErrors.supplier_tax_id[0] }}
          </span>
        </label>
      </div>

      <div class="grid gap-5 md:grid-cols-4">
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

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700">Currency</span>
          <select
            v-model="currency"
            v-bind="currencyAttrs"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
            <option value="UAH">UAH</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
          <span v-if="errors.currency" class="mt-1 block text-sm text-rose-600">
            {{ errors.currency }}
          </span>
          <span v-if="serverValidationErrors.currency?.[0]" class="mt-1 block text-sm text-rose-600">
            {{ serverValidationErrors.currency[0] }}
          </span>
        </label>

        <div class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700">Gross amount</span>
          <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-950">
            {{ grossAmount }} {{ currency }}
          </div>
          <p class="mt-1 text-xs text-slate-500">
            Calculated as net amount + VAT amount.
          </p>
          <span v-if="serverValidationErrors.gross_amount?.[0]" class="mt-1 block text-sm text-rose-600">
            {{ serverValidationErrors.gross_amount[0] }}
          </span>
        </div>
      </div>

      <div class="grid gap-5 md:grid-cols-2">
        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700">Issue date</span>
          <input
            v-model="issueDate"
            v-bind="issueDateAttrs"
            type="date"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
          <span v-if="errors.issue_date" class="mt-1 block text-sm text-rose-600">
            {{ errors.issue_date }}
          </span>
          <span v-if="serverValidationErrors.issue_date?.[0]" class="mt-1 block text-sm text-rose-600">
            {{ serverValidationErrors.issue_date[0] }}
          </span>
        </label>

        <label class="block">
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
      </div>

      <div v-if="serverError" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ serverError }}
      </div>

      <button
        type="submit"
        class="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Creating...' : 'Create invoice' }}
      </button>
    </form>
  </section>
</template>
