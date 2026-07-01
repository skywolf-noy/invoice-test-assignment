import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { computed, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { z } from 'zod'
import { useAppI18n } from '~/composables/useAppI18n'
import { useInvoiceMutationsStore } from '~/stores/invoiceMutations'
import { useNotificationsStore } from '~/stores/notifications'
import type { Invoice } from '~/types/invoice'

type InvoiceEditFormSubmitHandler = (invoice: Invoice) => void

const currencyOptions = [
  'UAH',
  'USD',
  'EUR',
  'GBP',
  'PLN',
] as const

function normalizeNumberInput(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  return String(value).replace(',', '.').trim()
}

function isValidAmount(value: string): boolean {
  if (value === '') {
    return false
  }

  const amount = Number(value)

  return Number.isFinite(amount) && amount >= 0
}

function formatAmount(value: unknown): string {
  const normalizedValue = normalizeNumberInput(value)
  const amount = Number(normalizedValue)

  if (!Number.isFinite(amount)) {
    return '0.00'
  }

  return amount.toFixed(2)
}

function getServerErrorMessage(error: unknown, fallbackMessage: string): string {
  const responseData = (error as {
    data?: {
      message?: string
      errors?: Record<string, string[]>
    }
  })?.data

  const firstValidationMessage = responseData?.errors
    ? Object.values(responseData.errors).flat()[0]
    : undefined

  return firstValidationMessage || responseData?.message || fallbackMessage
}

function toFormValues(invoice: Invoice) {
  return {
    net_amount: invoice.net_amount,
    vat_amount: invoice.vat_amount,
    currency: invoice.currency as (typeof currencyOptions)[number],
    due_date: invoice.due_date,
  }
}

export function useInvoiceEditForm(
  invoiceRef: MaybeRefOrGetter<Invoice>,
  onUpdated: InvoiceEditFormSubmitHandler,
) {
  const {
    t,
  } = useAppI18n()

  const invoiceMutationsStore = useInvoiceMutationsStore()
  const notificationsStore = useNotificationsStore()

  const currentInvoice = computed(() => toValue(invoiceRef))

  const validationSchema = toTypedSchema(
    z.object({
      net_amount: z.preprocess(
        normalizeNumberInput,
        z.string()
          .min(1, t('validation.required'))
          .refine(isValidAmount, t('validation.invalidNumber')),
      ),
      vat_amount: z.preprocess(
        normalizeNumberInput,
        z.string()
          .min(1, t('validation.required'))
          .refine(isValidAmount, t('validation.invalidNumber')),
      ),
      currency: z.enum(currencyOptions),
      due_date: z.string().min(1, t('validation.invalidDate')),
    }),
  )

  const {
    handleSubmit,
    errors,
    resetForm,
  } = useForm({
    validationSchema,
    initialValues: toFormValues(currentInvoice.value),
  })

  const {
    value: netAmount,
  } = useField<string | number>('net_amount')

  const {
    value: vatAmount,
  } = useField<string | number>('vat_amount')

  const {
    value: currency,
  } = useField<(typeof currencyOptions)[number]>('currency')

  const {
    value: dueDate,
  } = useField<string>('due_date')

  const grossAmount = computed(() => {
    const net = Number(normalizeNumberInput(netAmount.value))
    const vat = Number(normalizeNumberInput(vatAmount.value))

    if (!Number.isFinite(net) || !Number.isFinite(vat)) {
      return '0.00'
    }

    return (net + vat).toFixed(2)
  })

  watch(
    currentInvoice,
    (invoice) => {
      resetForm({
        values: toFormValues(invoice),
      })
    },
    {
      immediate: true,
    },
  )

  const submitForm = handleSubmit(async (values) => {
    try {
      const invoice = currentInvoice.value

      const updatedInvoice = await invoiceMutationsStore.updateInvoice(invoice.id, {
        net_amount: formatAmount(values.net_amount),
        vat_amount: formatAmount(values.vat_amount),
        gross_amount: grossAmount.value,
        currency: values.currency,
        due_date: values.due_date,
      })

      notificationsStore.push({
        type: 'success',
        message: t('notifications.updated'),
      })

      onUpdated(updatedInvoice)
    } catch (error) {
      notificationsStore.push({
        type: 'error',
        message: getServerErrorMessage(error, t('errors.updateInvoice')),
      })
    }
  })

  return {
    t,
    currencyOptions,
    netAmount,
    vatAmount,
    currency,
    dueDate,
    grossAmount,
    errors,
    isSaving: computed(() => invoiceMutationsStore.isUpdating(currentInvoice.value.id)),
    updateError: computed(() => invoiceMutationsStore.updateError),
    submitForm,
  }
}
