<?php

namespace Tests\Feature;

use App\Models\Invoice;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceLifecycleApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_invoice_can_be_created_as_pending_with_calculated_gross_amount(): void
    {
        $response = $this->postJson('/api/invoices', [
            'number' => 'INV-TEST-001',
            'supplier_name' => 'Acme Ltd',
            'supplier_tax_id' => 'TAX-001',
            'net_amount' => '100.00',
            'vat_amount' => '20.00',
            'gross_amount' => '120.00',
            'currency' => 'USD',
            'issue_date' => '2026-06-30',
            'due_date' => '2026-07-30',
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('invoices', [
            'number' => 'INV-TEST-001',
            'status' => 'pending',
            'gross_amount' => '120.00',
        ]);
    }

    public function test_pending_invoice_can_be_updated_and_gross_amount_is_recalculated(): void
    {
        $invoice = $this->createInvoice([
            'number' => 'INV-TEST-002',
            'net_amount' => '100.00',
            'vat_amount' => '20.00',
            'gross_amount' => '120.00',
            'status' => 'pending',
        ]);

        $response = $this->putJson("/api/invoices/{$invoice->id}", [
            'net_amount' => '150.00',
            'vat_amount' => '30.00',
            'gross_amount' => '180.00',
            'due_date' => '2026-08-15',
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('invoices', [
            'id' => $invoice->id,
            'net_amount' => '150.00',
            'vat_amount' => '30.00',
            'gross_amount' => '180.00',
            'due_date' => '2026-08-15',
        ]);
    }

    public function test_finalised_invoice_cannot_be_updated(): void
    {
        $invoice = $this->createInvoice([
            'number' => 'INV-TEST-003',
            'status' => 'approved',
            'net_amount' => '100.00',
            'vat_amount' => '20.00',
            'gross_amount' => '120.00',
        ]);

        $response = $this->putJson("/api/invoices/{$invoice->id}", [
            'net_amount' => '200.00',
            'vat_amount' => '40.00',
            'gross_amount' => '240.00',
            'due_date' => '2026-08-15',
        ]);

        $response->assertUnprocessable();

        $this->assertDatabaseHas('invoices', [
            'id' => $invoice->id,
            'status' => 'approved',
            'net_amount' => '100.00',
            'vat_amount' => '20.00',
            'gross_amount' => '120.00',
        ]);
    }

    public function test_pending_invoice_status_can_be_changed_to_approved(): void
    {
        $invoice = $this->createInvoice([
            'number' => 'INV-TEST-004',
            'status' => 'pending',
        ]);

        $response = $this->patchJson("/api/invoices/{$invoice->id}/status", [
            'status' => 'approved',
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('invoices', [
            'id' => $invoice->id,
            'status' => 'approved',
        ]);
    }

    public function test_finalised_invoice_status_cannot_be_changed_again(): void
    {
        $invoice = $this->createInvoice([
            'number' => 'INV-TEST-005',
            'status' => 'approved',
        ]);

        $response = $this->patchJson("/api/invoices/{$invoice->id}/status", [
            'status' => 'rejected',
        ]);

        $response->assertUnprocessable();

        $this->assertDatabaseHas('invoices', [
            'id' => $invoice->id,
            'status' => 'approved',
        ]);
    }

    public function test_invoice_status_cannot_be_changed_back_to_pending(): void
    {
        $invoice = $this->createInvoice([
            'number' => 'INV-TEST-006',
            'status' => 'pending',
        ]);

        $response = $this->patchJson("/api/invoices/{$invoice->id}/status", [
            'status' => 'pending',
        ]);

        $response->assertUnprocessable();

        $this->assertDatabaseHas('invoices', [
            'id' => $invoice->id,
            'status' => 'pending',
        ]);
    }

    public function test_pending_invoice_can_be_deleted(): void
    {
        $invoice = $this->createInvoice([
            'number' => 'INV-TEST-007',
            'status' => 'pending',
        ]);

        $response = $this->deleteJson("/api/invoices/{$invoice->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('invoices', [
            'id' => $invoice->id,
        ]);
    }

    public function test_finalised_invoice_cannot_be_deleted(): void
    {
        $invoice = $this->createInvoice([
            'number' => 'INV-TEST-008',
            'status' => 'rejected',
        ]);

        $response = $this->deleteJson("/api/invoices/{$invoice->id}");

        $response->assertUnprocessable();

        $this->assertDatabaseHas('invoices', [
            'id' => $invoice->id,
            'status' => 'rejected',
        ]);
    }

    private function createInvoice(array $overrides = []): Invoice
    {
        return Invoice::query()->create(array_merge([
            'number' => 'INV-TEST-' . fake()->unique()->numberBetween(1000, 9999),
            'supplier_name' => 'Acme Ltd',
            'supplier_tax_id' => 'TAX-001',
            'net_amount' => '100.00',
            'vat_amount' => '20.00',
            'gross_amount' => '120.00',
            'currency' => 'USD',
            'status' => 'pending',
            'issue_date' => '2026-06-30',
            'due_date' => '2026-07-30',
        ], $overrides));
    }
}
