import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { computed } from 'vue'
import { z } from 'zod'
import { useAppI18n } from '~/composables/useAppI18n'
import { useInvoiceMutationsStore } from '~/stores/invoiceMutations'
import { useNotificationsStore } from '~/stores/notifications'
import type { Invoice } from '~/types/invoice'

type CreateInvoiceFormSubmitHandler = (invoice: Invoice) => void

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

function normalizeTextInput(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }

  return String(value).trim()
}

function normalizeTaxId(value: unknown): string {
  return normalizeTextInput(value).toUpperCase()
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

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function getDefaultDueDate(): string {
  const date = new Date()

  date.setDate(date.getDate() + 14)

  return date.toISOString().slice(0, 10)
}

function generateInvoiceNumber(): string {
  const randomPart = Math.floor(100000 + Math.random() * 900000)

  return `INV-${randomPart}`
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

export function useInvoiceCreateForm(onCreated: CreateInvoiceFormSubmitHandler) {
  const {
    t,
  } = useAppI18n()

  const invoiceMutationsStore = useInvoiceMutationsStore()
  const notificationsStore = useNotificationsStore()

  const validationSchema = toTypedSchema(
    z.object({
      number: z.preprocess(
        normalizeTextInput,
        z.string().min(1, t('validation.required')),
      ),
      supplier_name: z.preprocess(
        normalizeTextInput,
        z.string().min(1, t('validation.required')),
      ),
      supplier_tax_id: z.preprocess(
        normalizeTaxId,
        z.string().min(1, t('validation.required')),
      ),
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
      issue_date: z.string().min(1, t('validation.invalidDate')),
      due_date: z.string().min(1, t('validation.invalidDate')),
    }),
  )

  const {
    handleSubmit,
    errors,
    resetForm,
  } = useForm({
    validationSchema,
    initialValues: {
      number: generateInvoiceNumber(),
      supplier_name: '',
      supplier_tax_id: '',
      net_amount: '0.00',
      vat_amount: '0.00',
      currency: 'UAH',
      issue_date: getTodayDate(),
      due_date: getDefaultDueDate(),
    },
  })

  const {
    value: number,
  } = useField<string>('number')

  const {
    value: supplierName,
  } = useField<string>('supplier_name')

  const {
    value: supplierTaxId,
  } = useField<string>('supplier_tax_id')

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
    value: issueDate,
  } = useField<string>('issue_date')

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

  const submitForm = handleSubmit(async (values) => {
    try {
      const invoice = await invoiceMutationsStore.createInvoice({
        number: normalizeTextInput(values.number),
        supplier_name: normalizeTextInput(values.supplier_name),
        supplier_tax_id: normalizeTaxId(values.supplier_tax_id),
        net_amount: formatAmount(values.net_amount),
        vat_amount: formatAmount(values.vat_amount),
        gross_amount: grossAmount.value,
        currency: values.currency,
        issue_date: values.issue_date,
        due_date: values.due_date,
      })

      notificationsStore.push({
        type: 'success',
        message: t('notifications.created'),
      })

      resetForm()
      onCreated(invoice)
    } catch (error) {
      notificationsStore.push({
        type: 'error',
        message: getServerErrorMessage(error, t('errors.createInvoice')),
      })
    }
  })

  return {
    t,
    currencyOptions,
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
    isCreating: computed(() => invoiceMutationsStore.isCreating),
    createError: computed(() => invoiceMutationsStore.createError),
    submitForm,
  }
}
