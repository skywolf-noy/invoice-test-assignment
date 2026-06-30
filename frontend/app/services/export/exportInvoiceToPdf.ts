import type { Invoice } from '~/types/invoice'
import {
  createExportFilename,
  getInvoiceDetailsExportRows,
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

export async function exportInvoiceToPdf(
  invoice: Invoice,
  context: InvoiceExportContext,
): Promise<void> {
  const pdfMake = await getPdfMake()
  const rows = getInvoiceDetailsExportRows(invoice, context)

  const definition = {
    pageSize: 'A4',
    pageMargins: [40, 44, 40, 44],
    defaultStyle: {
      fontSize: 10,
    },
    content: [
      {
        text: context.t('export.invoiceDocument'),
        style: 'title',
      },
      {
        text: invoice.number,
        style: 'subtitle',
      },
      {
        text: `${context.t('export.generatedAt')}: ${context.formatDateTime(new Date().toISOString())}`,
        style: 'meta',
      },
      {
        table: {
          widths: ['35%', '*'],
          body: rows.map((row) => [
            {
              text: row.label,
              bold: true,
              fillColor: '#f8fafc',
            },
            row.value,
          ]),
        },
        layout: 'lightHorizontalLines',
        margin: [0, 18, 0, 0],
      },
    ],
    styles: {
      title: {
        fontSize: 20,
        bold: true,
        margin: [0, 0, 0, 6],
      },
      subtitle: {
        fontSize: 14,
        color: '#334155',
        margin: [0, 0, 0, 8],
      },
      meta: {
        fontSize: 9,
        color: '#64748b',
      },
    },
  }

  pdfMake
    .createPdf(definition)
    .download(createExportFilename('invoice', 'pdf', invoice.number))
}
