<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use App\Services\InvoiceService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class InvoiceController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $invoices = Invoice::query()
            ->orderByDesc('created_at')
            ->get();

        return InvoiceResource::collection($invoices);
    }

    public function show(Invoice $invoice): InvoiceResource
    {
        return InvoiceResource::make($invoice);
    }

    public function store(StoreInvoiceRequest $request, InvoiceService $invoiceService): InvoiceResource
    {
        $invoice = $invoiceService->create($request->validated());

        return InvoiceResource::make($invoice)
            ->additional(['message' => 'Invoice created successfully.']);
    }

    public function update(
        UpdateInvoiceRequest $request,
        Invoice $invoice,
        InvoiceService $invoiceService
    ): InvoiceResource {
        $invoice = $invoiceService->update($invoice, $request->validated());

        return InvoiceResource::make($invoice)
            ->additional(['message' => 'Invoice updated successfully.']);
    }
}
