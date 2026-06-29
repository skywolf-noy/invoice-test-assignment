<?php

namespace App\Http\Resources;

use App\Enums\InvoiceStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $status = $this->status instanceof InvoiceStatus
            ? $this->status->value
            : $this->status;

        return [
            'id' => $this->id,
            'number' => $this->number,
            'supplier_name' => $this->supplier_name,
            'supplier_tax_id' => $this->supplier_tax_id,
            'net_amount' => $this->net_amount,
            'vat_amount' => $this->vat_amount,
            'gross_amount' => $this->gross_amount,
            'currency' => $this->currency,
            'status' => $status,
            'issue_date' => $this->issue_date?->toDateString(),
            'due_date' => $this->due_date?->toDateString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
