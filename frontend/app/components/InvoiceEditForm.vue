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
  t,
  netAmount,
  vatAmount,
  currency,
  currencyOptions,
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
  <form class="app-form" @submit.prevent="submitForm">
    <div class="app-toolbar app-toolbar--between app-toolbar--center app-form__header">
      <div>
        <h2 class="app-section-title">
          {{ t('forms.editableFields') }}
        </h2>
        <p class="app-section-description">
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

    <div v-if="isLocked" class="app-alert app-alert--warning">
      {{ t('forms.lockedInvoice') }}
    </div>

    <div v-if="updateError" class="app-alert app-alert--error">
      {{ updateError }}
    </div>

    <div v-if="lifecycleError" class="app-alert app-alert--error">
      {{ lifecycleError }}
    </div>

    <div class="app-form__group app-form__group--three">
      <label class="app-field">
        <span class="app-field__label">{{ t('fields.netAmount') }}</span>
        <input
          v-model="netAmount"
          type="number"
          min="0"
          step="0.01"
          class="app-field__control"
          :disabled="isLocked || isUpdating"
        >
        <span v-if="errors.net_amount" class="app-field__error">{{ errors.net_amount }}</span>
      </label>

      <label class="app-field">
        <span class="app-field__label">{{ t('fields.vatAmount') }}</span>
        <input
          v-model="vatAmount"
          type="number"
          min="0"
          step="0.01"
          class="app-field__control"
          :disabled="isLocked || isUpdating"
        >
        <span v-if="errors.vat_amount" class="app-field__error">{{ errors.vat_amount }}</span>
      </label>

      <label class="app-field">
        <span class="app-field__label">{{ t('fields.dueDate') }}</span>
        <input
          v-model="dueDate"
          type="date"
          class="app-field__control"
          :disabled="isLocked || isUpdating"
        >
        <span v-if="errors.due_date" class="app-field__error">{{ errors.due_date }}</span>
      </label>

      <div class="app-computed-box">
        <span class="app-computed-box__label">{{ t('fields.grossAmount') }}</span>
        <p class="app-computed-box__value">{{ grossAmount }}</p>
        <p class="app-computed-box__hint">{{ t('forms.calculatedGross') }}</p>
      </div>
    </div>

    <div class="app-form__actions">
      <button
        v-if="showDelete"
        type="button"
        class="app-button app-button--danger app-button--full"
        :disabled="deleteProcessing"
        @click="handleDelete"
      >
        {{ deleteProcessing ? t('app.loading') : t('invoices.deleteInvoice') }}
      </button>

      <span v-else />

      <button
        type="submit"
        class="app-button app-button--primary app-button--full"
        :disabled="isLocked || isUpdating"
      >
        {{ isUpdating ? t('forms.saving') : t('forms.saveChanges') }}
      </button>
    </div>
  </form>
</template>
