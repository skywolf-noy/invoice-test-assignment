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
  currencyOptions,
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
  <form class="app-form" @submit.prevent="submitForm">
    <div class="app-form__header">
      <h2 class="app-section-title">
        {{ t('forms.invoiceData') }}
      </h2>
      <p class="app-section-description">
        {{ t('forms.backendValidation') }}
      </p>
    </div>

    <div v-if="createError" class="app-alert app-alert--error">
      {{ createError }}
    </div>

    <div class="app-form__group app-form__group--two">
      <label class="app-field">
        <span class="app-field__label">{{ t('fields.number') }}</span>
        <input
          v-model="number"
          type="text"
          class="app-field__control"
          :disabled="isCreating"
        >
        <span v-if="errors.number" class="app-field__error">{{ errors.number }}</span>
      </label>

      <label class="app-field">
        <span class="app-field__label">{{ t('fields.currency') }}</span>

        <select
          v-model="currency"
          class="app-field__control"
          :disabled="isCreating"
        >
          <option
            v-for="currencyOption in currencyOptions"
            :key="currencyOption"
            :value="currencyOption"
          >
            {{ currencyOption }}
          </option>
        </select>

        <span v-if="errors.currency" class="app-field__error">{{ errors.currency }}</span>
      </label>

      <label class="app-field">
        <span class="app-field__label">{{ t('fields.supplierName') }}</span>
        <input
          v-model="supplierName"
          type="text"
          class="app-field__control"
          :disabled="isCreating"
        >
        <span v-if="errors.supplier_name" class="app-field__error">{{ errors.supplier_name }}</span>
      </label>

      <label class="app-field">
        <span class="app-field__label">{{ t('fields.supplierTaxId') }}</span>
        <input
          v-model="supplierTaxId"
          type="text"
          class="app-field__control"
          :disabled="isCreating"
        >
        <span v-if="errors.supplier_tax_id" class="app-field__error">{{ errors.supplier_tax_id }}</span>
      </label>
    </div>

    <div class="app-form__divider" />

    <div>
      <h2 class="app-section-title">
        {{ t('forms.financialFields') }}
      </h2>
    </div>

    <div class="app-form__group app-form__group--three">
      <label class="app-field">
        <span class="app-field__label">{{ t('fields.netAmount') }}</span>
        <input
          v-model="netAmount"
          type="text"
          inputmode="decimal"
          class="app-field__control"
          :disabled="isCreating"
        >
        <span v-if="errors.net_amount" class="app-field__error">{{ errors.net_amount }}</span>
      </label>

      <label class="app-field">
        <span class="app-field__label">{{ t('fields.vatAmount') }}</span>
        <input
          v-model="vatAmount"
          type="text"
          inputmode="decimal"
          class="app-field__control"
          :disabled="isCreating"
        >
        <span v-if="errors.vat_amount" class="app-field__error">{{ errors.vat_amount }}</span>
      </label>

      <div class="app-computed-box">
        <span class="app-computed-box__label">{{ t('fields.grossAmount') }}</span>
        <p class="app-computed-box__value">{{ grossAmount }}</p>
        <p class="app-computed-box__hint">{{ t('forms.calculatedGross') }}</p>
      </div>
    </div>

    <div class="app-form__group app-form__group--two">
      <label class="app-field">
        <span class="app-field__label">{{ t('fields.issueDate') }}</span>
        <input
          v-model="issueDate"
          type="date"
          class="app-field__control"
          :disabled="isCreating"
        >
        <span v-if="errors.issue_date" class="app-field__error">{{ errors.issue_date }}</span>
      </label>

      <label class="app-field">
        <span class="app-field__label">{{ t('fields.dueDate') }}</span>
        <input
          v-model="dueDate"
          type="date"
          class="app-field__control"
          :disabled="isCreating"
        >
        <span v-if="errors.due_date" class="app-field__error">{{ errors.due_date }}</span>
      </label>
    </div>

    <div class="app-form__actions app-form__actions--end">
      <button
        type="submit"
        class="app-button app-button--primary app-button--full"
        :disabled="isCreating"
      >
        {{ isCreating ? t('forms.creating') : t('invoices.createInvoice') }}
      </button>
    </div>
  </form>
</template>
