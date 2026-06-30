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
use Symfony\Component\HttpFoundation\Response;

class InvoiceController extends Controller
{
    public function __construct(
        private readonly InvoiceService $invoiceService,
    ) {
    }

    public function index(): AnonymousResourceCollection
    {
        return InvoiceResource::collection(
            $this->invoiceService->list(),
        );
    }

    public function show(Invoice $invoice): InvoiceResource
    {
        return new InvoiceResource($invoice);
    }

    public function store(StoreInvoiceRequest $request): JsonResponse
    {
        $invoice = $this->invoiceService->create($request->validated());

        return (new InvoiceResource($invoice))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice): InvoiceResource
    {
        return new InvoiceResource(
            $this->invoiceService->update($invoice, $request->validated()),
        );
    }

    public function updateStatus(UpdateInvoiceStatusRequest $request, Invoice $invoice): InvoiceResource
    {
        $status = InvoiceStatus::from($request->validated('status'));

        return new InvoiceResource(
            $this->invoiceService->changeStatus($invoice, $status),
        );
    }

    public function destroy(Invoice $invoice): JsonResponse
    {
        $this->invoiceService->delete($invoice);

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
