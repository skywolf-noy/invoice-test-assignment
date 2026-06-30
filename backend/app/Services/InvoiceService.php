<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;

class InvoiceService
{
    public function create(array $data): Invoice
    {
        $data['status'] = $data['status'] ?? InvoiceStatus::Pending->value;
        $data['gross_amount'] = $this->calculateGrossAmount(
            (string) $data['net_amount'],
            (string) $data['vat_amount']
        );

        return Invoice::create($data);
    }

    public function update(Invoice $invoice, array $data): Invoice
    {
        $invoice->update([
            'net_amount' => $data['net_amount'],
            'vat_amount' => $data['vat_amount'],
            'gross_amount' => $this->calculateGrossAmount(
                (string) $data['net_amount'],
                (string) $data['vat_amount']
            ),
            'due_date' => $data['due_date'],
        ]);

        return $invoice->refresh();
    }

    public function updateStatus(Invoice $invoice, InvoiceStatus $status): Invoice
    {
        $invoice->update([
            'status' => $status->value,
        ]);

        return $invoice->refresh();
    }

    public function delete(Invoice $invoice): void
    {
        $invoice->delete();
    }

    private function calculateGrossAmount(string $netAmount, string $vatAmount): string
    {
        return bcadd($netAmount, $vatAmount, 2);
    }
}
