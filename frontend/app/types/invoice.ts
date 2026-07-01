export type InvoiceStatus = 'pending' | 'approved' | 'rejected'
export type InvoiceFinalStatus = 'approved' | 'rejected'

export interface Invoice {
  id: number
  number: string
  supplier_name: string
  supplier_tax_id: string
  net_amount: string
  vat_amount: string
  gross_amount: string
  currency: string
  status: InvoiceStatus
  issue_date: string
  due_date: string
  created_at: string
  updated_at: string
}

export interface ApiCollectionResponse<T> {
  data: T[]
}

export interface ApiSingleResponse<T> {
  data: T
  message?: string
}

export interface ApiMessageResponse {
  message: string
}

export interface ApiErrorResponse {
  message?: string
  errors?: Record<string, string[]>
}

export interface CreateInvoicePayload {
  number: string
  supplier_name: string
  supplier_tax_id: string
  net_amount: string
  vat_amount: string
  gross_amount: string
  currency: string
  issue_date: string
  due_date: string
}

export interface UpdateInvoicePayload {
  net_amount: string
  vat_amount: string
  gross_amount: string
  currency: string
  due_date: string
}

export interface UpdateInvoiceStatusPayload {
  status: InvoiceFinalStatus
}
