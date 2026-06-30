# Invoice Test Assignment

Full-stack invoice management module built with Laravel API, Nuxt frontend, PostgreSQL, Docker Compose, translated UI, notifications, export actions, automated tests, and GitHub Actions CI.

## Tech Stack

### Backend

- PHP 8.2+
- Laravel 12
- PostgreSQL 16
- REST API
- Form Requests for validation
- Service layer for business logic
- API Resources for JSON responses
- Feature tests for invoice lifecycle behavior

### Frontend

- Nuxt 4
- Vue 3.5
- TypeScript
- Pinia
- vee-validate
- zod
- TailwindCSS 4
- SCSS design system
- Vitest
- Vue Test Utils

### Infrastructure

- Docker Compose
- GitHub Actions CI
- Separate backend, frontend, and PostgreSQL services

## Main Features

- Invoice list page
- Invoice details page
- Invoice creation form
- Pending invoice edit form
- Strict invoice lifecycle rules
- Status badges
- Status change controls
- Delete action for pending invoices
- Ukrainian and English UI translations
- Language switcher
- Toast notifications
- PDF, Excel, Word, and CSV export actions
- Backend feature tests
- Frontend unit and component tests
- Docker-based local environment
- CI workflow for tests and build

## Invoice Fields

The invoice entity contains:

- id
- number
- supplier_name
- supplier_tax_id
- net_amount
- vat_amount
- gross_amount
- currency
- status
- issue_date
- due_date
- created_at
- updated_at

Supported statuses:

- pending
- approved
- rejected

## Invoice Lifecycle Rules

The invoice lifecycle is intentionally strict:

- Newly created invoices are always pending.
- Only pending invoices can be edited.
- Only pending invoices can be approved or rejected.
- Approved and rejected invoices are final.
- Only pending invoices can be deleted.
- Gross amount is calculated as net amount plus VAT amount.

Lifecycle rules are handled in:

    backend/app/Services/InvoiceLifecycleService.php

General invoice operations are handled in:

    backend/app/Services/InvoiceService.php

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/invoices | List invoices |
| GET | /api/invoices/{id} | Show invoice details |
| POST | /api/invoices | Create invoice |
| PUT | /api/invoices/{id} | Update pending invoice |
| PATCH | /api/invoices/{id}/status | Approve or reject pending invoice |
| DELETE | /api/invoices/{id} | Delete pending invoice |

Authentication is not implemented because it is outside the assignment scope.

## Frontend Routes

| Route | Description |
|---|---|
| /invoices | Invoice list |
| /invoices/create | Create invoice |
| /invoices/[id] | Invoice details and edit form |

## Localization

The frontend has a custom lightweight localization layer.

Files:

    frontend/app/locales/ua.ts
    frontend/app/locales/en.ts
    frontend/app/locales/index.ts
    frontend/app/composables/useAppI18n.ts
    frontend/app/stores/locale.ts

Default locale:

    ua

The selected locale is stored in localStorage.

## Notifications

Translated toast notifications are shown after user actions.

Files:

    frontend/app/stores/notifications.ts
    frontend/app/composables/useNotifications.ts
    frontend/app/components/AppToastViewport.vue

Covered actions:

- invoice created
- invoice updated
- invoice status updated
- invoice deleted
- file exported
- action failed

## Export Actions

Invoice list exports:

- PDF
- Excel
- CSV

Invoice details exports:

- PDF
- Word

Export files:

    frontend/app/services/export/exportInvoicesToPdf.ts
    frontend/app/services/export/exportInvoicesToExcel.ts
    frontend/app/services/export/exportInvoicesToCsv.ts
    frontend/app/services/export/exportInvoiceToPdf.ts
    frontend/app/services/export/exportInvoiceToDocx.ts
    frontend/app/services/export/invoiceExportData.ts
    frontend/app/composables/useInvoiceExport.ts
    frontend/app/components/InvoiceExportMenu.vue

Export libraries are loaded through dynamic imports.

## SCSS Design System

SCSS entry point:

    frontend/app/assets/styles/index.scss

Structure:

    frontend/app/assets/styles/
      abstracts/
      base/
      layout/
      components/

The UI uses semantic SCSS classes such as:

- app-page
- app-container
- app-section
- app-button
- app-form
- app-field
- app-table
- app-badge
- app-toast
- app-export-menu

## Project Structure

    .
    ├── backend/
    │   ├── app/
    │   ├── database/
    │   ├── routes/
    │   └── tests/
    ├── frontend/
    │   ├── app/
    │   └── tests/
    ├── .github/workflows/
    └── docker-compose.yml

## Installation

Clone the repository:

    git clone git@github.com:skywolf-noy/invoice-test-assignment.git
    cd invoice-test-assignment

Start services:

    docker compose up -d postgres backend frontend

Install dependencies if needed:

    docker compose exec backend composer install
    docker compose exec frontend npm install

Run migrations and seeders:

    docker compose exec backend php artisan migrate --seed

## Local URLs

Frontend:

    http://localhost:3000/invoices

Backend API:

    http://localhost:8000/api/invoices

## Useful Commands

Start services:

    docker compose up -d postgres backend frontend

Stop services:

    docker compose down

Rebuild services:

    docker compose build
    docker compose up -d postgres backend frontend

Recreate database:

    docker compose exec backend php artisan migrate:fresh --seed

Show invoice API routes:

    docker compose exec backend php artisan route:list --path=api/invoices

## Testing

Backend tests:

    docker compose exec backend php artisan test

Frontend tests:

    docker compose exec frontend npm run test

Frontend production build:

    docker compose exec frontend npm run build

Full local verification:

    docker compose exec backend php artisan test
    docker compose exec frontend npm run test
    docker compose exec frontend npm run build

## GitHub Actions CI

Workflow file:

    .github/workflows/ci.yml

The workflow runs on:

- push to main
- push to feature/production-polish
- pull request to main

CI checks:

- Docker services build
- Backend tests
- Frontend tests
- Frontend production build

## Testing Coverage Summary

Backend coverage includes:

- invoice creation
- pending invoice update
- finalized invoice update restriction
- status change from pending
- finalized status change restriction
- blocking return to pending
- pending invoice deletion
- finalized invoice deletion restriction

Frontend coverage includes:

- formatters
- i18n helpers
- Pinia stores
- notifications
- export data helpers
- language switcher
- status badge
- status select
- export menu
- toast viewport

## Notes

This project focuses on invoice management, validation, frontend state, UI flow, clean architecture, tests, Docker-based development, and CI readiness.
