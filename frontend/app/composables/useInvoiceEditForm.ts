import { computed, ref, watch, type Ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import type { ApiErrorResponse, Invoice } from '~/types/invoice'

interface InvoiceEditFormValues {
  net_amount: number
  vat_amount: number
  due_date: string
}

export function useInvoiceEditForm(
  invoice: Ref<Invoice>,
  onUpdated: (invoice: Invoice) => void,
) {
  const { updateInvoice } = useInvoicesApi()

  const isEditable = computed(() => invoice.value.status === 'pending')
  const serverError = ref('')
  const serverValidationErrors = ref<Record<string, string[]>>({})

  const validationSchema = toTypedSchema(
    z.object({
      net_amount: z.coerce.number().gt(0, 'Net amount must be greater than 0.'),
      vat_amount: z.coerce.number().min(0, 'VAT amount cannot be negative.'),
      due_date: z.string().min(1, 'Due date is required.'),
    }).refine((values) => {
      const issueDate = Date.parse(invoice.value.issue_date)
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
  } = useForm<InvoiceEditFormValues>({
    validationSchema,
    initialValues: {
      net_amount: Number(invoice.value.net_amount),
      vat_amount: Number(invoice.value.vat_amount),
      due_date: invoice.value.due_date,
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
    invoice,
    (updatedInvoice) => {
      setValues({
        net_amount: Number(updatedInvoice.net_amount),
        vat_amount: Number(updatedInvoice.vat_amount),
        due_date: updatedInvoice.due_date,
      })
    },
    { deep: true },
  )

  const submitForm = handleSubmit(async (values) => {
    if (!isEditable.value) {
      return
    }

    serverError.value = ''
    serverValidationErrors.value = {}

    try {
      const updatedInvoice = await updateInvoice(invoice.value.id, {
        net_amount: values.net_amount,
        vat_amount: values.vat_amount,
        gross_amount: grossAmount.value,
        due_date: values.due_date,
      })

      onUpdated(updatedInvoice)
    } catch (error) {
      const apiError = error as { data?: ApiErrorResponse }

      serverError.value = apiError.data?.message || 'Failed to update invoice.'
      serverValidationErrors.value = apiError.data?.errors || {}
    }
  })

  function submit(): void {
    void submitForm()
  }

  return {
    isEditable,
    serverError,
    serverValidationErrors,
    errors,
    isSubmitting,
    netAmount,
    netAmountAttrs,
    vatAmount,
    vatAmountAttrs,
    dueDate,
    dueDateAttrs,
    grossAmount,
    submit,
  }
}
