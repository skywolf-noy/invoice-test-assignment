import type { Invoice } from '~/types/invoice'
import {
  createExportFilename,
  getInvoiceListExportRows,
  type InvoiceExportContext,
} from './invoiceExportData'

interface PdfMakeInstance {
  vfs?: Record<string, string>
  createPdf: (definition: unknown) => {
    download: (filename: string) => void
  }
}

interface PdfFontsModule {
  vfs?: Record<string, string>
  pdfMake?: {
    vfs?: Record<string, string>
  }
}

async function getPdfMake(): Promise<PdfMakeInstance> {
  const pdfMakeModule = await import('pdfmake/build/pdfmake')
  const pdfFontsModule = await import('pdfmake/build/vfs_fonts')

  const pdfMake = (pdfMakeModule.default || pdfMakeModule) as PdfMakeInstance
  const pdfFonts = (pdfFontsModule.default || pdfFontsModule) as PdfFontsModule

  pdfMake.vfs = pdfFonts.pdfMake?.vfs || pdfFonts.vfs

  return pdfMake
}

export async function exportInvoicesToPdf(
  invoices: Invoice[],
  context: InvoiceExportContext,
): Promise<void> {
  const pdfMake = await getPdfMake()
  const rows = getInvoiceListExportRows(invoices, context)

  const definition = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [32, 40, 32, 40],
    defaultStyle: {
      fontSize: 9,
    },
    content: [
      {
        text: context.t('export.invoiceReport'),
        style: 'title',
      },
      {
        text: `${context.t('export.generatedAt')}: ${context.formatDateTime(new Date().toISOString())}`,
        style: 'meta',
      },
      {
        text: `${context.t('export.totalInvoices')}: ${invoices.length}`,
        style: 'meta',
        margin: [0, 0, 0, 16],
      },
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', 'auto'],
          body: [
            [
              context.t('fields.number'),
              context.t('fields.supplier'),
              context.t('fields.grossAmount'),
              context.t('fields.status'),
              context.t('fields.dueDate'),
            ],
            ...rows.map((invoice) => [
              invoice.number,
              invoice.supplier,
              invoice.grossAmount,
              invoice.status,
              invoice.dueDate,
            ]),
          ],
        },
        layout: 'lightHorizontalLines',
      },
    ],
    styles: {
      title: {
        fontSize: 20,
        bold: true,
        margin: [0, 0, 0, 8],
      },
      meta: {
        fontSize: 9,
        color: '#64748b',
        margin: [0, 0, 0, 4],
      },
    },
  }

  pdfMake
    .createPdf(definition)
    .download(createExportFilename('invoice-report', 'pdf'))
}
