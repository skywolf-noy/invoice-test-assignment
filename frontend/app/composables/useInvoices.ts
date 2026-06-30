import type {
  ApiCollectionResponse,
  ApiSingleResponse,
  CreateInvoicePayload,
  Invoice,
  UpdateInvoicePayload,
} from '~/types/invoice'

function getApiBaseUrl(): string {
  const config = useRuntimeConfig()

  return String(config.public.apiBaseUrl || 'http://localhost:8000/api').replace(/\/$/, '')
}

export function useInvoicesApi() {
  const apiBaseUrl = getApiBaseUrl()

  async function listInvoices(): Promise<Invoice[]> {
    const response = await $fetch<ApiCollectionResponse<Invoice>>(`${apiBaseUrl}/invoices`)

    return response.data
  }

  async function showInvoice(id: number): Promise<Invoice> {
    const response = await $fetch<ApiSingleResponse<Invoice>>(`${apiBaseUrl}/invoices/${id}`)

    return response.data
  }

  async function createInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
    const response = await $fetch<ApiSingleResponse<Invoice>>(`${apiBaseUrl}/invoices`, {
      method: 'POST',
      body: payload,
    })

    return response.data
  }

  async function updateInvoice(id: number, payload: UpdateInvoicePayload): Promise<Invoice> {
    const response = await $fetch<ApiSingleResponse<Invoice>>(`${apiBaseUrl}/invoices/${id}`, {
      method: 'PUT',
      body: payload,
    })

    return response.data
  }

  return {
    listInvoices,
    showInvoice,
    createInvoice,
    updateInvoice,
  }
}
