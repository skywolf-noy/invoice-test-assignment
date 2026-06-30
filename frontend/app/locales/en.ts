export const en = {
  app: {
    name: 'Invoice Manager',
    module: 'Invoice module',
    loading: 'Loading...',
    refresh: 'Refresh',
    back: 'Back',
    actions: 'Actions',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    create: 'Create',
    edit: 'Edit',
    language: 'Language',
    ukrainian: 'Ukrainian',
    english: 'English',
  },

  navigation: {
    backToInvoices: 'Back to invoices',
  },

  invoices: {
    title: 'Invoices',
    createTitle: 'Create invoice',
    detailsTitle: 'Invoice details',
    listTitle: 'Invoice list',
    listDescription: 'Sorted by newest records from the backend.',
    moduleDescription: 'Minimal full-stack invoice management module with Laravel API and Nuxt frontend.',
    createDescription: 'Create a new pending invoice with automatic gross amount calculation and server-side validation.',
    noInvoices: 'No invoices found.',
    loadingList: 'Loading invoices...',
    loadingDetails: 'Loading invoice...',
    notFound: 'Invoice not found.',
    refreshDetails: 'Refresh details',
    createInvoice: 'Create invoice',
    deleteInvoice: 'Delete invoice',
    deleteConfirm: 'Delete invoice {number}? This action is allowed only for pending invoices.',
    finalised: 'Finalised',
    finalisedDocument: 'Finalised document',
  },

  fields: {
    number: 'Number',
    supplier: 'Supplier',
    supplierName: 'Supplier name',
    supplierTaxId: 'Supplier Tax ID',
    netAmount: 'Net amount',
    vatAmount: 'VAT amount',
    grossAmount: 'Gross amount',
    currency: 'Currency',
    status: 'Status',
    issueDate: 'Issue date',
    dueDate: 'Due date',
    lastUpdated: 'Last updated',
  },

  status: {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  },

  forms: {
    saveChanges: 'Save changes',
    saving: 'Saving...',
    creating: 'Creating...',
    calculatedGross: 'Gross amount is calculated automatically.',
    lockedInvoice: 'Approved/rejected invoices cannot be edited.',
  },

  validation: {
    required: 'This field is required.',
    invalidNumber: 'Enter a valid number.',
    invalidDate: 'Enter a valid date.',
  },

  errors: {
    loadInvoices: 'Failed to load invoices.',
    loadInvoice: 'Failed to load invoice.',
    createInvoice: 'Failed to create invoice.',
    updateInvoice: 'Failed to update invoice.',
    updateStatus: 'Failed to update invoice status.',
    deleteInvoice: 'Failed to delete invoice.',
    onlyPendingStatus: 'Only pending invoices can change status.',
    onlyPendingDelete: 'Only pending invoices can be deleted.',
  },

  notifications: {
    created: 'Invoice created.',
    updated: 'Invoice updated.',
    statusUpdated: 'Invoice status updated.',
    deleted: 'Invoice deleted.',
    exported: 'File exported.',
    failed: 'Action failed.',
  },

  export: {
    title: 'Export',
    exportAsPdf: 'Export as PDF',
    exportAsExcel: 'Export as Excel',
    exportAsWord: 'Export as Word',
    exportAsCsv: 'Export as CSV',
    invoiceReport: 'Invoice Report',
    generatedAt: 'Generated at',
    totalInvoices: 'Total invoices',
  },
} as const
