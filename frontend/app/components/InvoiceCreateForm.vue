<script setup lang="ts">
import type { Invoice } from '~/types/invoice'

const emit = defineEmits<{
  created: [invoice: Invoice]
}>()

const {
  t,
  number,
  supplierName,
  supplierTaxId,
  netAmount,
  vatAmount,
  currency,
  issueDate,
  dueDate,
  grossAmount,
  errors,
  isCreating,
  createError,
  submitForm,
} = useInvoiceCreateForm((invoice) => emit('created', invoice))
</script>

<template>
  <form
    class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    @submit.prevent="submitForm"
  >
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-slate-950">
        {{ t('forms.invoiceInformation') }}
      </h2>
      <p class="mt-1 text-sm text-slate-500">
        {{ t('forms.requiredServerValidation') }}
      </p>
    </div>

    <div v-if="createError" class="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      {{ createError }}
    </div>

    <div class="grid gap-5 md:grid-cols-2">
      <label class="block">
        <span class="text-sm font-semibold text-slate-700">
          {{ t('fields.number') }}
        </span>
        <input
          v-model="number"
          type="text"
          class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        >
        <span v-if="errors.number" class="mt-1 block text-sm text-rose-600">
          {{ errors.number }}
        </span>
      </label>

      <label class="block">
        <span class="text-sm font-semibold text-slate-700">
          {{ t('fields.currency') }}
        </span>
        <input
          v-model="currency"
          type="text"
          maxlength="3"
          class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm uppercase outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        >
        <span v-if="errors.currency" class="mt-1 block text-sm text-rose-600">
          {{ errors.currency }}
        </span>
      </label>

      <label class="block">
        <span class="text-sm font-semibold text-slate-700">
          {{ t('fields.supplierName') }}
        </span>
        <input
          v-model="supplierName"
          type="text"
          class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        >
        <span v-if="errors.supplier_name" class="mt-1 block text-sm text-rose-600">
          {{ errors.supplier_name }}
        </span>
      </label>

      <label class="block">
        <span class="text-sm font-semibold text-slate-700">
          {{ t('fields.supplierTaxId') }}
        </span>
        <input
          v-model="supplierTaxId"
          type="text"
          class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        >
        <span v-if="errors.supplier_tax_id" class="mt-1 block text-sm text-rose-600">
          {{ errors.supplier_tax_id }}
        </span>
      </label>
    </div>

    <div class="mt-8">
      <h3 class="text-base font-semibold text-slate-950">
        {{ t('forms.financialFields') }}
      </h3>

      <div class="mt-4 grid gap-5 md:grid-cols-3">
        <label class="block">
          <span class="text-sm font-semibold text-slate-700">
            {{ t('fields.netAmount') }}
          </span>
          <input
            v-model="netAmount"
            type="number"
            min="0"
            step="0.01"
            class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
          <span v-if="errors.net_amount" class="mt-1 block text-sm text-rose-600">
            {{ errors.net_amount }}
          </span>
        </label>

        <label class="block">
          <span class="text-sm font-semibold text-slate-700">
            {{ t('fields.vatAmount') }}
          </span>
          <input
            v-model="vatAmount"
            type="number"
            min="0"
            step="0.01"
            class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
          <span v-if="errors.vat_amount" class="mt-1 block text-sm text-rose-600">
            {{ errors.vat_amount }}
          </span>
        </label>

        <div class="rounded-xl bg-slate-50 p-4">
          <span class="text-sm font-semibold text-slate-500">
            {{ t('fields.grossAmount') }}
          </span>
          <p class="mt-2 text-xl font-bold text-slate-950">
            {{ grossAmount }}
          </p>
          <p class="mt-1 text-xs text-slate-500">
            {{ t('forms.calculatedGross') }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-8 grid gap-5 md:grid-cols-2">
      <label class="block">
        <span class="text-sm font-semibold text-slate-700">
          {{ t('fields.issueDate') }}
        </span>
        <input
          v-model="issueDate"
          type="date"
          class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        >
        <span v-if="errors.issue_date" class="mt-1 block text-sm text-rose-600">
          {{ errors.issue_date }}
        </span>
      </label>

      <label class="block">
        <span class="text-sm font-semibold text-slate-700">
          {{ t('fields.dueDate') }}
        </span>
        <input
          v-model="dueDate"
          type="date"
          class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        >
        <span v-if="errors.due_date" class="mt-1 block text-sm text-rose-600">
          {{ errors.due_date }}
        </span>
      </label>
    </div>

    <div class="mt-8 flex justify-end">
      <button
        type="submit"
        class="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="isCreating"
      >
        {{ isCreating ? t('forms.creating') : t('forms.createInvoice') }}
      </button>
    </div>
  </form>
</template>
