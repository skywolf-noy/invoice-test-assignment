<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import type { ApiErrorResponse, Invoice } from '~/types/invoice'

interface InvoiceFormValues {
  net_amount: number
  vat_amount: number
  due_date: string
}

const props = defineProps<{
  invoice: Invoice
}>()

const emit = defineEmits<{
  updated: [invoice: Invoice]
}>()

const { updateInvoice } = useInvoicesApi()

const isEditable = computed(() => props.invoice.status === 'pending')
const serverError = ref('')
const serverValidationErrors = ref<Record<string, string[]>>({})

const validationSchema = toTypedSchema(
  z.object({
    net_amount: z.coerce.number().gt(0, 'Net amount must be greater than 0.'),
    vat_amount: z.coerce.number().min(0, 'VAT amount cannot be negative.'),
    due_date: z.string().min(1, 'Due date is required.'),
  }).refine((values) => {
    const issueDate = Date.parse(props.invoice.issue_date)
    const dueDate = Date.parse(values.due_date)

    if (Number.isNaN(issueDate) || Number.isNaN(dueDate)) {
      return false
    }

    return dueDate >= issueDate
  }, {
    path: ['due_date'],
    message: 'Due date must be greater than or equal to issue date.',
  }),
)

const {
  defineField,
  errors,
  handleSubmit,
  isSubmitting,
  setValues,
} = useForm<InvoiceFormValues>({
  validationSchema,
  initialValues: {
    net_amount: Number(props.invoice.net_amount),
    vat_amount: Number(props.invoice.vat_amount),
    due_date: props.invoice.due_date,
  },
})

const [netAmount, netAmountAttrs] = defineField('net_amount')
const [vatAmount, vatAmountAttrs] = defineField('vat_amount')
const [dueDate, dueDateAttrs] = defineField('due_date')

const grossAmount = computed(() => {
  const net = Number(netAmount.value || 0)
  const vat = Number(vatAmount.value || 0)

  return (Math.round((net + vat) * 100) / 100).toFixed(2)
})

watch(
  () => props.invoice,
  (invoice) => {
    setValues({
      net_amount: Number(invoice.net_amount),
      vat_amount: Number(invoice.vat_amount),
      due_date: invoice.due_date,
    })
  },
  { deep: true },
)

const onSubmit = handleSubmit(async (values) => {
  if (!isEditable.value) {
    return
  }

  serverError.value = ''
  serverValidationErrors.value = {}

  try {
    const updatedInvoice = await updateInvoice(props.invoice.id, {
      net_amount: values.net_amount,
      vat_amount: values.vat_amount,
      gross_amount: grossAmount.value,
      due_date: values.due_date,
    })

    emit('updated', updatedInvoice)
  } catch (error) {
    const apiError = error as { data?: ApiErrorResponse }

    serverError.value = apiError.data?.message || 'Failed to update invoice.'
    serverValidationErrors.value = apiError.data?.errors || {}
  }
})
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-950">
          Edit invoice
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Only pending invoices can be updated.
        </p>
      </div>

      <div
        v-if="!isEditable"
        class="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600"
      >
        Editing is disabled for this status.
      </div>
    </div>

    <form class="space-y-5" @submit.prevent="onSubmit">
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

        <div v-if="serverError" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {{ serverError }}
        </div>

        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          :disabled="!isEditable || isSubmitting"
        >
          {{ isSubmitting ? 'Saving...' : 'Save changes' }}
        </button>
      </fieldset>
    </form>
  </section>
</template>
