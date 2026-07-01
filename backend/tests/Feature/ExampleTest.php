<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_invoices_endpoint_returns_successful_response(): void
    {
        $response = $this->getJson('/api/invoices');

        $response->assertSuccessful();
    }
}
