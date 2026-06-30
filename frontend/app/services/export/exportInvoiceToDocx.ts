import type { Invoice } from '~/types/invoice'
import {
  createExportFilename,
  getInvoiceDetailsExportRows,
  type InvoiceExportContext,
} from './invoiceExportData'

export async function exportInvoiceToDocx(
  invoice: Invoice,
  context: InvoiceExportContext,
): Promise<void> {
  const {
    AlignmentType,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    TextRun,
    WidthType,
  } = await import('docx')
  const {
    saveAs,
  } = await import('file-saver')

  const rows = getInvoiceDetailsExportRows(invoice, context)

  const document = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: context.t('export.invoiceDocument'),
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: invoice.number,
                bold: true,
                size: 28,
              }),
            ],
            spacing: {
              after: 240,
            },
          }),
          new Paragraph({
            text: `${context.t('export.generatedAt')}: ${context.formatDateTime(new Date().toISOString())}`,
            alignment: AlignmentType.LEFT,
            spacing: {
              after: 280,
            },
          }),
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: rows.map((row) => {
              return new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 35,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: row.label,
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: {
                      size: 65,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [
                      new Paragraph({
                        text: row.value,
                      }),
                    ],
                  }),
                ],
              })
            }),
          }),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(document)

  saveAs(blob, createExportFilename('invoice', 'docx', invoice.number))
}
