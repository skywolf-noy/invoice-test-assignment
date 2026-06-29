<?php

namespace App\Http\Requests;

use App\Enums\InvoiceStatus;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class StoreInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'number' => ['required', 'string', 'max:64', Rule::unique('invoices', 'number')],
            'supplier_name' => ['required', 'string', 'max:255'],
            'supplier_tax_id' => ['required', 'string', 'max:64'],
            'net_amount' => ['required', 'numeric', 'gt:0'],
            'vat_amount' => ['required', 'numeric', 'min:0'],
            'gross_amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'size:3'],
            'status' => ['sometimes', 'string', Rule::in(InvoiceStatus::values())],
            'issue_date' => ['required', 'date'],
            'due_date' => ['required', 'date', 'after_or_equal:issue_date'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $expectedGrossAmount = bcadd(
                (string) $this->input('net_amount'),
                (string) $this->input('vat_amount'),
                2
            );

            $providedGrossAmount = number_format((float) $this->input('gross_amount'), 2, '.', '');

            if (bccomp($expectedGrossAmount, $providedGrossAmount, 2) !== 0) {
                $validator->errors()->add(
                    'gross_amount',
                    'The gross amount must be equal to net amount plus VAT amount.'
                );
            }
        });
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Validation failed.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
