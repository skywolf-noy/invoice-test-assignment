<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'net_amount' => ['required', 'numeric', 'min:0'],
            'vat_amount' => ['required', 'numeric', 'min:0'],
            'gross_amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'required', 'string', 'size:3'],
            'due_date' => ['required', 'date'],
        ];
    }

    /**
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $netAmount = (float) $this->input('net_amount', 0);
                $vatAmount = (float) $this->input('vat_amount', 0);
                $grossAmount = (float) $this->input('gross_amount', 0);

                $expectedGrossAmount = (float) number_format(
                    $netAmount + $vatAmount,
                    2,
                    '.',
                    '',
                );

                if (abs($grossAmount - $expectedGrossAmount) > 0.01) {
                    $validator->errors()->add(
                        'gross_amount',
                        'The gross amount must be equal to net amount plus VAT amount.',
                    );
                }
            },
        ];
    }
}
