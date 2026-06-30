import { computed } from 'vue'
import type { Invoice, InvoiceFinalStatus } from '~/types/invoice'

interface InvoiceStatusSelectProps {
  invoice: Invoice
  processing?: boolean
  showLockedHint?: boolean
}

type InvoiceStatusSelectEmit = (
  event: 'change-status',
  status: InvoiceFinalStatus
) => void

export function useInvoiceStatusSelect(
  props: InvoiceStatusSelectProps,
  emit: InvoiceStatusSelectEmit,
) {
  const isLocked = computed(() => props.invoice.status !== 'pending')

  function handleChange(event: Event): void {
    const target = event.target as HTMLSelectElement
    const selectedStatus = target.value

    if (selectedStatus !== 'approved' && selectedStatus !== 'rejected') {
      return
    }

    emit('change-status', selectedStatus)
  }

  return {
    isLocked,
    handleChange,
  }
}
