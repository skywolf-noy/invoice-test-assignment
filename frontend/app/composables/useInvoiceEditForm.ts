import { storeToRefs } from 'pinia'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { z } from 'zod'
import { useInvoiceMutationsStore } from '~/stores/invoiceMutations'
import type { Invoice } from '~/types/invoice'

interface EditInvoiceFormValues {
  net_amount: string
  vat_amount: string
  due_date: string
}

interface EditInvoiceFormProps {
  invoice: Invoice
}

function isValidAmount(value: string): boolean {
  const numericValue = Number(value)

  return Number.isFinite(numericValue) && numericValue >= 0
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))
}

function getInitialValues(invoice: Invoice): EditInvoiceFormValues {
  return {
    net_amount: invoice.net_amount,
    vat_amount: invoice.vat_amount,
    due_date: invoice.due_date,
  }
}

export function useInvoiceEditForm(
  props: EditInvoiceFormProps,
  onUpdated: (invoice: Invoice) => void,
) {
  const invoiceMutationsStore = useInvoiceMutationsStore()

  const {
    isUpdating,
    updateError,
  } = storeToRefs(invoiceMutationsStore)

  const {
    t,
  } = useAppI18n()

  const isLocked = computed(() => props.invoice.status !== 'pending')

  const validationSchema = toTypedSchema(
    z.object({
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
      due_date: z
        .string()
        .trim()
        .min(1, t('validation.required'))
        .refine(isValidDate, t('validation.invalidDate')),
    }).superRefine((values, context) => {
      if (
        isValidDate(props.invoice.issue_date) &&
        isValidDate(values.due_date) &&
        values.due_date < props.invoice.issue_date
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
    resetForm,
    values,
  } = useForm<EditInvoiceFormValues>({
    validationSchema,
    initialValues: getInitialValues(props.invoice),
  })

  const [netAmount] = defineField('net_amount')
  const [vatAmount] = defineField('vat_amount')
  const [dueDate] = defineField('due_date')

  const grossAmount = computed(() => {
    const net = Number(values.net_amount)
    const vat = Number(values.vat_amount)

    const safeNet = Number.isFinite(net) ? net : 0
    const safeVat = Number.isFinite(vat) ? vat : 0

    return (safeNet + safeVat).toFixed(2)
  })

  watch(
    () => props.invoice,
    (invoice) => {
      resetForm({
        values: getInitialValues(invoice),
      })
    },
    { deep: true },
  )

  const submitForm = handleSubmit(async (formValues) => {
    if (isLocked.value) {
      return
    }

    const updatedInvoice = await invoiceMutationsStore.updateInvoice(props.invoice.id, {
      net_amount: Number(formValues.net_amount).toFixed(2),
      vat_amount: Number(formValues.vat_amount).toFixed(2),
      gross_amount: grossAmount.value,
      due_date: formValues.due_date,
    })

    onUpdated(updatedInvoice)
  })

  return {
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
  }
}
