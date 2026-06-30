<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use Illuminate\Database\Eloquent\Collection;

class InvoiceService
{
    public function __construct(
        private readonly InvoiceLifecycleService $invoiceLifecycleService,
    ) {
    }

    /**
     * @return Collection<int, Invoice>
     */
    public function list(): Collection
    {
        return Invoice::query()
            ->latest('created_at')
            ->latest('id')
            ->get();
    }

    public function create(array $data): Invoice
    {
        $data['status'] = 'pending';
        $data['gross_amount'] = $this->calculateGrossAmount($data);

        return Invoice::query()
            ->create($data)
            ->refresh();
    }

    public function update(Invoice $invoice, array $data): Invoice
    {
        $this->invoiceLifecycleService->assertCanUpdate($invoice);

        $data['gross_amount'] = $this->calculateGrossAmount($data, $invoice);

        $invoice->update($data);

        return $invoice->refresh();
    }

    public function changeStatus(Invoice $invoice, InvoiceStatus $status): Invoice
    {
        return $this->invoiceLifecycleService->changeStatus($invoice, $status);
    }

    public function delete(Invoice $invoice): void
    {
        $this->invoiceLifecycleService->delete($invoice);
    }

    private function calculateGrossAmount(array $data, ?Invoice $invoice = null): string
    {
        $netAmount = $data['net_amount'] ?? $invoice?->net_amount ?? 0;
        $vatAmount = $data['vat_amount'] ?? $invoice?->vat_amount ?? 0;

        return number_format(
            (float) $netAmount + (float) $vatAmount,
            2,
            '.',
            '',
        );
    }
}
