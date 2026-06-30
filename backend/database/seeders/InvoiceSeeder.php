<?php

namespace Database\Seeders;

use App\Models\Invoice;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $invoices = [
            [
                'number' => 'INV-2026-001',
                'supplier_name' => 'Nova Trade LLC',
                'supplier_tax_id' => 'UA12345678',
                'net_amount' => 10000.00,
                'vat_amount' => 2000.00,
                'gross_amount' => 12000.00,
                'currency' => 'UAH',
                'status' => 'approved',
                'issue_date' => '2026-06-01',
                'due_date' => '2026-06-15',
            ],
            [
                'number' => 'INV-2026-002',
                'supplier_name' => 'Kyiv Office Supplies',
                'supplier_tax_id' => 'UA87654321',
                'net_amount' => 4500.00,
                'vat_amount' => 900.00,
                'gross_amount' => 5400.00,
                'currency' => 'UAH',
                'status' => 'approved',
                'issue_date' => '2026-06-02',
                'due_date' => '2026-06-18',
            ],
            [
                'number' => 'INV-2026-003',
                'supplier_name' => 'Tech Service Group',
                'supplier_tax_id' => 'UA99887766',
                'net_amount' => 7800.00,
                'vat_amount' => 1560.00,
                'gross_amount' => 9360.00,
                'currency' => 'UAH',
                'status' => 'rejected',
                'issue_date' => '2026-06-03',
                'due_date' => '2026-06-19',
            ],
            [
                'number' => 'INV-2026-004',
                'supplier_name' => 'Dnipro Logistics',
                'supplier_tax_id' => 'UA44556677',
                'net_amount' => 6200.00,
                'vat_amount' => 1240.00,
                'gross_amount' => 7440.00,
                'currency' => 'UAH',
                'status' => 'pending',
                'issue_date' => '2026-06-04',
                'due_date' => '2026-06-20',
            ],
            [
                'number' => 'INV-2026-005',
                'supplier_name' => 'Lviv Printing House',
                'supplier_tax_id' => 'UA33445566',
                'net_amount' => 3100.00,
                'vat_amount' => 620.00,
                'gross_amount' => 3720.00,
                'currency' => 'UAH',
                'status' => 'pending',
                'issue_date' => '2026-06-05',
                'due_date' => '2026-06-21',
            ],
            [
                'number' => 'INV-2026-006',
                'supplier_name' => 'Odessa Import Company',
                'supplier_tax_id' => 'UA11223344',
                'net_amount' => 12500.00,
                'vat_amount' => 2500.00,
                'gross_amount' => 15000.00,
                'currency' => 'UAH',
                'status' => 'approved',
                'issue_date' => '2026-06-06',
                'due_date' => '2026-06-22',
            ],
            [
                'number' => 'INV-2026-007',
                'supplier_name' => 'Kharkiv Parts Hub',
                'supplier_tax_id' => 'UA55667788',
                'net_amount' => 8700.00,
                'vat_amount' => 1740.00,
                'gross_amount' => 10440.00,
                'currency' => 'UAH',
                'status' => 'rejected',
                'issue_date' => '2026-06-07',
                'due_date' => '2026-06-23',
            ],
            [
                'number' => 'INV-2026-008',
                'supplier_name' => 'Poltava Energy Systems',
                'supplier_tax_id' => 'UA66778899',
                'net_amount' => 5400.00,
                'vat_amount' => 1080.00,
                'gross_amount' => 6480.00,
                'currency' => 'UAH',
                'status' => 'pending',
                'issue_date' => '2026-06-08',
                'due_date' => '2026-06-24',
            ],
            [
                'number' => 'INV-2026-009',
                'supplier_name' => 'Vinnytsia Agro Trade',
                'supplier_tax_id' => 'UA77889900',
                'net_amount' => 4300.00,
                'vat_amount' => 860.00,
                'gross_amount' => 5160.00,
                'currency' => 'UAH',
                'status' => 'approved',
                'issue_date' => '2026-06-09',
                'due_date' => '2026-06-25',
            ],
            [
                'number' => 'INV-2026-010',
                'supplier_name' => 'Chernihiv Build Supply',
                'supplier_tax_id' => 'UA88990011',
                'net_amount' => 9600.00,
                'vat_amount' => 1920.00,
                'gross_amount' => 11520.00,
                'currency' => 'UAH',
                'status' => 'pending',
                'issue_date' => '2026-06-10',
                'due_date' => '2026-06-26',
            ],
        ];

        foreach ($invoices as $invoice) {
            Invoice::updateOrCreate(
                ['number' => $invoice['number']],
                $invoice
            );
        }
    }
}
