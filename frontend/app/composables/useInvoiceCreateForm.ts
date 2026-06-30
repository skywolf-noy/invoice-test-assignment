import { computed, ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useInvoicesStore } from '~/stores/invoices'
import type { ApiErrorResponse, Invoice } from '~/types/invoice'

interface InvoiceCreateFormValues {
  number: string
  supplier_name: string
  supplier_tax_id: string
  net_amount: number
  vat_amount: number
  currency: string
  issue_date: string
  due_date: string
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function getDateAfterDays(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)

  return date.toISOString().slice(0, 10)
}

export function useInvoiceCreateForm(
  onCreated: (invoice: Invoice) => void,
) {
  const invoicesStore = useInvoicesStore()

  const serverError = ref('')
  const serverValidationErrors = ref<Record<string, string[]>>({})

  const validationSchema = toTypedSchema(
    z.object({
      number: z.string().min(1, 'Invoice number is required.').max(64, 'Invoice number is too long.'),
      supplier_name: z.string().min(1, 'Supplier name is required.').max(255, 'Supplier name is too long.'),
      supplier_tax_id: z.string().min(1, 'Supplier tax ID is required.').max(64, 'Supplier tax ID is too long.'),
      net_amount: z.coerce.number().gt(0, 'Net amount must be greater than 0.'),
      vat_amount: z.coerce.number().min(0, 'VAT amount cannot be negative.'),
      currency: z.string().length(3, 'Currency must contain exactly 3 characters.'),
      issue_date: z.string().min(1, 'Issue date is required.'),
      due_date: z.string().min(1, 'Due date is required.'),
    }).refine((values) => {
      const issueDate = Date.parse(values.issue_date)
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
  } = useForm<InvoiceCreateFormValues>({
    validationSchema,
    initialValues: {
      number: '',
      supplier_name: '',
      supplier_tax_id: '',
      net_amount: 0,
      vat_amount: 0,
      currency: 'UAH',
      issue_date: getTodayDate(),
      due_date: getDateAfterDays(30),
    },
  })

  const [number, numberAttrs] = defineField('number')
  const [supplierName, supplierNameAttrs] = defineField('supplier_name')
  const [supplierTaxId, supplierTaxIdAttrs] = defineField('supplier_tax_id')
  const [netAmount, netAmountAttrs] = defineField('net_amount')
  const [vatAmount, vatAmountAttrs] = defineField('vat_amount')
  const [currency, currencyAttrs] = defineField('currency')
  const [issueDate, issueDateAttrs] = defineField('issue_date')
  const [dueDate, dueDateAttrs] = defineField('due_date')

  const grossAmount = computed(() => {
    const net = Number(netAmount.value || 0)
    const vat = Number(vatAmount.value || 0)

    return (Math.round((net + vat) * 100) / 100).toFixed(2)
  })

  const submitForm = handleSubmit(async (values) => {
    serverError.value = ''
    serverValidationErrors.value = {}

    try {
      const createdInvoice = await invoicesStore.createInvoice({
        number: values.number,
        supplier_name: values.supplier_name,
        supplier_tax_id: values.supplier_tax_id,
        net_amount: values.net_amount,
        vat_amount: values.vat_amount,
        gross_amount: grossAmount.value,
        currency: values.currency,
        issue_date: values.issue_date,
        due_date: values.due_date,
      })

      onCreated(createdInvoice)
    } catch (error) {
      const apiError = error as { data?: ApiErrorResponse }

      serverError.value = apiError.data?.message || invoicesStore.createError || 'Failed to create invoice.'
      serverValidationErrors.value = apiError.data?.errors || {}
    }
  })

  function submit(): void {
    void submitForm()
  }

  return {
    serverError,
    serverValidationErrors,
    errors,
    isSubmitting,
    number,
    numberAttrs,
    supplierName,
    supplierNameAttrs,
    supplierTaxId,
    supplierTaxIdAttrs,
    netAmount,
    netAmountAttrs,
    vatAmount,
    vatAmountAttrs,
    currency,
    currencyAttrs,
    issueDate,
    issueDateAttrs,
    dueDate,
    dueDateAttrs,
    grossAmount,
    submit,
  }
}
