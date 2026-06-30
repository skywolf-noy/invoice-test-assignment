<script setup lang="ts">
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

const {
  t,
  netAmount,
  vatAmount,
  dueDate,
  grossAmount,
  errors,
  isLocked,
  isUpdating,
  updateError,
  submitForm,
} = useInvoiceEditForm(props, (invoice) => emit('updated', invoice))

function handleStatusChange(status: InvoiceFinalStatus): void {
  emit('change-status', status)
}

function handleDelete(): void {
  emit('delete')
}
</script>

<template>
  <form
    class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    @submit.prevent="submitForm"
  >
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-950">
          {{ t('forms.editableFields') }}
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ isLocked ? t('forms.pendingOnly') : t('forms.calculatedGross') }}
        </p>
      </div>

      <InvoiceStatusSelect
        :invoice="invoice"
        :processing="lifecycleProcessing"
        :show-locked-hint="true"
        @change-status="handleStatusChange"
      />
    </div>

    <div v-if="isLocked" class="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
      {{ t('forms.lockedInvoice') }}
    </div>

    <div v-if="updateError" class="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      {{ updateError }}
    </div>

    <div v-if="lifecycleError" class="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      {{ lifecycleError }}
    </div>

    <div class="grid gap-5 md:grid-cols-4">
      <label class="block">
        <span class="text-sm font-semibold text-slate-700">
          {{ t('fields.netAmount') }}
        </span>
        <input
          v-model="netAmount"
          type="number"
          min="0"
          step="0.01"
          class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          :disabled="isLocked || isUpdating"
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
          class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          :disabled="isLocked || isUpdating"
        >
        <span v-if="errors.vat_amount" class="mt-1 block text-sm text-rose-600">
          {{ errors.vat_amount }}
        </span>
      </label>

      <label class="block">
        <span class="text-sm font-semibold text-slate-700">
          {{ t('fields.dueDate') }}
        </span>
        <input
          v-model="dueDate"
          type="date"
          class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          :disabled="isLocked || isUpdating"
        >
        <span v-if="errors.due_date" class="mt-1 block text-sm text-rose-600">
          {{ errors.due_date }}
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

    <div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        v-if="showDelete"
        type="button"
        class="inline-flex items-center justify-center rounded-xl border border-rose-300 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="deleteProcessing"
        @click="handleDelete"
      >
        {{ deleteProcessing ? t('app.loading') : t('invoices.deleteInvoice') }}
      </button>

      <div v-else />

      <button
        type="submit"
        class="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="isLocked || isUpdating"
      >
        {{ isUpdating ? t('forms.saving') : t('forms.saveChanges') }}
      </button>
    </div>
  </form>
</template>
