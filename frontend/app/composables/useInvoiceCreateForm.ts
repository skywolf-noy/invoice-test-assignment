import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { computed } from 'vue'
import { z } from 'zod'
import { useAppI18n } from '~/composables/useAppI18n'
import { useNotifications } from '~/composables/useNotifications'
import { useInvoiceMutationsStore } from '~/stores/invoiceMutations'
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

  return String(value).replace(',', '.')
}

function normalizeTextInput(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }

  return String(value).trim()
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

export function useInvoiceCreateForm(onCreated: CreateInvoiceFormSubmitHandler) {
  const {
    t,
  } = useAppI18n()

  const invoiceMutationsStore = useInvoiceMutationsStore()

  const {
    showSuccess,
    showError,
  } = useNotifications()

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
        normalizeTextInput,
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
        number: values.number,
        supplier_name: values.supplier_name,
        supplier_tax_id: values.supplier_tax_id,
        net_amount: formatAmount(values.net_amount),
        vat_amount: formatAmount(values.vat_amount),
        gross_amount: grossAmount.value,
        currency: values.currency,
        issue_date: values.issue_date,
        due_date: values.due_date,
      })

      showSuccess(t('notifications.created'))
      resetForm()
      onCreated(invoice)
    } catch {
      showError(t('errors.createInvoice'))
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
