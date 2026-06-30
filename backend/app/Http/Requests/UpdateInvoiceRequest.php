<?php

namespace App\Http\Requests;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'net_amount' => ['required', 'numeric', 'gt:0'],
            'vat_amount' => ['required', 'numeric', 'min:0'],
            'gross_amount' => ['required', 'numeric', 'min:0'],
            'due_date' => ['required', 'date'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $invoice = $this->route('invoice');

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

            if ($invoice instanceof Invoice) {
                $dueDate = Carbon::parse($this->input('due_date'));
                $issueDate = Carbon::parse($invoice->issue_date);

                if ($dueDate->lt($issueDate)) {
                    $validator->errors()->add(
                        'due_date',
                        'The due date must be greater than or equal to the issue date.'
                    );
                }
            }
        });
    }

    protected function failedAuthorization(): void
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Only pending invoices can be updated.',
        ], 403));
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Validation failed.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
