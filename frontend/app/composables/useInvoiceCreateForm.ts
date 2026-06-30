import { storeToRefs } from 'pinia'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { z } from 'zod'
import { useInvoiceMutationsStore } from '~/stores/invoiceMutations'
import type { Invoice } from '~/types/invoice'

interface CreateInvoiceFormValues {
  number: string
  supplier_name: string
  supplier_tax_id: string
  net_amount: string
  vat_amount: string
  currency: string
  issue_date: string
  due_date: string
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function isValidAmount(value: string): boolean {
  const numericValue = Number(value)

  return Number.isFinite(numericValue) && numericValue >= 0
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))
}

function normalizeCurrency(value: string): string {
  return value.trim().toUpperCase()
}

export function useInvoiceCreateForm(onCreated: (invoice: Invoice) => void) {
  const invoiceMutationsStore = useInvoiceMutationsStore()

  const {
    isCreating,
    createError,
  } = storeToRefs(invoiceMutationsStore)

  const {
    t,
  } = useAppI18n()

  const validationSchema = toTypedSchema(
    z.object({
      number: z.string().trim().min(1, t('validation.required')),
      supplier_name: z.string().trim().min(1, t('validation.required')),
      supplier_tax_id: z.string().trim().min(1, t('validation.required')),
      net_amount: z
        .string()
        .trim()
        .min(1, t('validation.required'))
        .refine(isValidAmount, t('validation.minAmount')),
      vat_amount: z
        .string()
        .trim()
        .min(1, t('validation.required'))
        .refine(isValidAmount, t('validation.minAmount')),
      currency: z
        .string()
        .trim()
        .min(1, t('validation.required'))
        .regex(/^[A-Za-z]{3}$/, t('validation.invalidCurrency')),
      issue_date: z
        .string()
        .trim()
        .min(1, t('validation.required'))
        .refine(isValidDate, t('validation.invalidDate')),
      due_date: z
        .string()
        .trim()
        .min(1, t('validation.required'))
        .refine(isValidDate, t('validation.invalidDate')),
    }).superRefine((values, context) => {
      if (
        isValidDate(values.issue_date) &&
        isValidDate(values.due_date) &&
        values.due_date < values.issue_date
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.dueDateAfterIssueDate'),
          path: ['due_date'],
        })
      }
    }),
  )

  const {
    defineField,
    errors,
    handleSubmit,
    values,
  } = useForm<CreateInvoiceFormValues>({
    validationSchema,
    initialValues: {
      number: '',
      supplier_name: '',
      supplier_tax_id: '',
      net_amount: '',
      vat_amount: '',
      currency: 'USD',
      issue_date: today(),
      due_date: today(),
    },
  })

  const [number] = defineField('number')
  const [supplierName] = defineField('supplier_name')
  const [supplierTaxId] = defineField('supplier_tax_id')
  const [netAmount] = defineField('net_amount')
  const [vatAmount] = defineField('vat_amount')
  const [currency] = defineField('currency')
  const [issueDate] = defineField('issue_date')
  const [dueDate] = defineField('due_date')

  const grossAmount = computed(() => {
    const net = Number(values.net_amount)
    const vat = Number(values.vat_amount)

    const safeNet = Number.isFinite(net) ? net : 0
    const safeVat = Number.isFinite(vat) ? vat : 0

    return (safeNet + safeVat).toFixed(2)
  })

  const submitForm = handleSubmit(async (formValues) => {
    const createdInvoice = await invoiceMutationsStore.createInvoice({
      number: formValues.number.trim(),
      supplier_name: formValues.supplier_name.trim(),
      supplier_tax_id: formValues.supplier_tax_id.trim(),
      net_amount: Number(formValues.net_amount).toFixed(2),
      vat_amount: Number(formValues.vat_amount).toFixed(2),
      gross_amount: grossAmount.value,
      currency: normalizeCurrency(formValues.currency),
      issue_date: formValues.issue_date,
      due_date: formValues.due_date,
    })

    onCreated(createdInvoice)
  })

  return {
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
  }
}
