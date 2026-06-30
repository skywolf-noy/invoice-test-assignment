<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use Illuminate\Validation\ValidationException;

class InvoiceLifecycleService
{
    public function assertCanUpdate(Invoice $invoice): void
    {
        if (! $this->isPending($invoice)) {
            throw ValidationException::withMessages([
                'status' => ['Only pending invoices can be updated.'],
            ]);
        }
    }

    public function assertCanChangeStatus(Invoice $invoice): void
    {
        if (! $this->isPending($invoice)) {
            throw ValidationException::withMessages([
                'status' => ['Only pending invoices can change status.'],
            ]);
        }
    }

    public function assertCanDelete(Invoice $invoice): void
    {
        if (! $this->isPending($invoice)) {
            throw ValidationException::withMessages([
                'status' => ['Only pending invoices can be deleted.'],
            ]);
        }
    }

    public function changeStatus(Invoice $invoice, InvoiceStatus $status): Invoice
    {
        $this->assertCanChangeStatus($invoice);

        if ($status->value === 'pending') {
            throw ValidationException::withMessages([
                'status' => ['Invoice status can only be changed to approved or rejected.'],
            ]);
        }

        $invoice->forceFill([
            'status' => $status->value,
        ])->save();

        return $invoice->refresh();
    }

    public function delete(Invoice $invoice): void
    {
        $this->assertCanDelete($invoice);

        $invoice->delete();
    }

    private function isPending(Invoice $invoice): bool
    {
        return $this->statusValue($invoice) === 'pending';
    }

    private function statusValue(Invoice $invoice): string
    {
        $status = $invoice->status;

        if ($status instanceof InvoiceStatus) {
            return $status->value;
        }

        return (string) $status;
    }
}
