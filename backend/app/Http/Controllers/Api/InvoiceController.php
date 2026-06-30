<?php

namespace App\Http\Controllers\Api;

use App\Enums\InvoiceStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Http\Requests\UpdateInvoiceStatusRequest;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use App\Services\InvoiceService;
use Illuminate\Http\JsonResponse;
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

    public function updateStatus(
        UpdateInvoiceStatusRequest $request,
        Invoice $invoice,
        InvoiceService $invoiceService
    ): InvoiceResource {
        $data = $request->validated();

        $invoice = $invoiceService->updateStatus(
            $invoice,
            InvoiceStatus::from($data['status'])
        );

        return InvoiceResource::make($invoice)
            ->additional(['message' => 'Invoice status updated successfully.']);
    }

    public function destroy(Invoice $invoice, InvoiceService $invoiceService): JsonResponse
    {
        if ($invoice->status !== InvoiceStatus::Pending) {
            return response()->json([
                'message' => 'Only pending invoices can be deleted.',
            ], 403);
        }

        $invoiceService->delete($invoice);

        return response()->json([
            'message' => 'Invoice deleted successfully.',
        ]);
    }
}
