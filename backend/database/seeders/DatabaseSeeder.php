<?php

namespace Database\Seeders;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Invoice::truncate();

        Invoice::create([
            'number' => 'INV-2026-001',
            'supplier_name' => 'Nova Trade LLC',
            'supplier_tax_id' => 'UA12345678',
            'net_amount' => '10000.00',
            'vat_amount' => '2000.00',
            'gross_amount' => '12000.00',
            'currency' => 'UAH',
            'status' => InvoiceStatus::Pending,
            'issue_date' => '2026-06-20',
            'due_date' => '2026-07-20',
        ]);

        Invoice::create([
            'number' => 'INV-2026-002',
            'supplier_name' => 'Kyiv Office Supplies',
            'supplier_tax_id' => 'UA87654321',
            'net_amount' => '4500.00',
            'vat_amount' => '900.00',
            'gross_amount' => '5400.00',
            'currency' => 'UAH',
            'status' => InvoiceStatus::Approved,
            'issue_date' => '2026-06-18',
            'due_date' => '2026-07-18',
        ]);

        Invoice::create([
            'number' => 'INV-2026-003',
            'supplier_name' => 'Tech Service Group',
            'supplier_tax_id' => 'UA99887766',
            'net_amount' => '7800.00',
            'vat_amount' => '1560.00',
            'gross_amount' => '9360.00',
            'currency' => 'UAH',
            'status' => InvoiceStatus::Rejected,
            'issue_date' => '2026-06-15',
            'due_date' => '2026-07-15',
        ]);
    }
}
