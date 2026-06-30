<?php

use App\Http\Controllers\Api\InvoiceController;
use Illuminate\Support\Facades\Route;

Route::patch('invoices/{invoice}/status', [InvoiceController::class, 'updateStatus'])
    ->name('invoices.update-status');

Route::apiResource('invoices', InvoiceController::class)
    ->only(['index', 'show', 'store', 'update', 'destroy']);
