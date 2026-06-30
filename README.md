# Invoice Test Assignment

Full-stack test assignment: invoice management module.

## Stack

- Backend: Laravel 12, PHP 8.4 in Docker (requirement: PHP 8.2+)
- Database: PostgreSQL 16
- Frontend: Nuxt 4, Vue 3.5, TypeScript
- Styling: TailwindCSS 4
- Frontend validation: vee-validate + zod
- Environment: Docker Compose

## Project Structure

- backend/ - Laravel REST API
- frontend/ - Nuxt frontend application
- docker-compose.yml - local development environment

## How to Run

Start all services:

    docker compose up --build

Available URLs:

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API: http://localhost:8000/api/invoices
- PostgreSQL: localhost:5432

Seed demo data:

    docker compose exec backend php artisan db:seed --force

If the database needs to be recreated:

    docker compose exec backend php artisan migrate:fresh --seed --force

Stop services:

    docker compose down

## API Endpoints

- GET /api/invoices - list invoices
- GET /api/invoices/{id} - show one invoice
- POST /api/invoices - create invoice
- PUT /api/invoices/{id} - update pending invoice

Authentication is not implemented because it is not required by the assignment.

## Backend Structure

Backend code is split into:

- Model: App\Models\Invoice
- Enum: App\Enums\InvoiceStatus
- Controller: App\Http\Controllers\Api\InvoiceController
- Requests: StoreInvoiceRequest, UpdateInvoiceRequest
- Resource: InvoiceResource
- Service: InvoiceService
- Seeder: DatabaseSeeder

Controller handles HTTP-level interaction.
FormRequest classes handle server-side validation.
InvoiceService contains business logic for create/update operations.
InvoiceResource controls the JSON response shape.

## Frontend Structure

Frontend code is split into:

- pages/invoices/index.vue - invoice list page
- pages/invoices/create.vue - invoice creation page
- pages/invoices/[id].vue - invoice details page
- components/InvoiceCreateForm.vue - create form UI
- components/InvoiceEditForm.vue - edit form UI
- components/InvoiceStatusBadge.vue - visual status badge
- composables/useInvoices.ts - API client logic
- composables/useInvoiceList.ts - invoice list state and actions
- composables/useInvoiceDetails.ts - invoice details state and actions
- composables/useInvoiceCreateForm.ts - create form state, validation and submit logic
- composables/useInvoiceEditForm.ts - edit form state, validation and submit logic
- composables/useInvoiceFormatters.ts - money and date formatting helpers
- types/invoice.ts - TypeScript API contracts

Pages describe user flows.
Components isolate reusable UI pieces.
Composables keep API calls, page state, form state, validation and submit logic out of UI components.
Types keep frontend/backend data contracts explicit.

The frontend uses composition functions instead of Pinia because invoice list, details, create form and edit form state are local to this module and do not require a global store.

## Business Rules

Invoice fields:

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

Validation rules:

- number is required and unique
- net_amount must be greater than 0
- vat_amount cannot be negative
- gross_amount must equal net_amount + vat_amount
- due_date must be greater than or equal to issue_date
- only pending invoices can be updated

gross_amount is calculated on the frontend for UX, but validated and recalculated on the backend before persistence.

## Decisions and Trade-offs

- I used auto increment IDs because the assignment allows uuid or auto increment. For a production system, UUID or ULID could be better if public sequential IDs are not acceptable.
- I did not implement authentication because the assignment explicitly says it is not required.
- Pagination is not implemented because it is optional in the assignment and the test module is intentionally minimal.
- The UI is intentionally simple. The focus is on clean flow, validation, API integration, and edge cases rather than visual complexity.
- Laravel runs through artisan serve in Docker for development simplicity. In production I would use PHP-FPM with Nginx, Caddy, or FrankenPHP.
- Demo data is created through the seeder, not hardcoded in the frontend.

## UX Edge Cases Covered

- Create invoice form with automatic gross amount calculation
- Loading state on invoice list and invoice details pages
- Error state when backend API is unavailable
- Empty invoice list state
- Clickable invoice row to open details
- Status badge with different colors
- Date formatting in readable form
- Currency formatting
- Edit form disabled for approved and rejected invoices
- Gross amount preview recalculated automatically
- Frontend validation for amount and due date rules
- Backend validation errors displayed in the form
- Refresh action on list and details pages

## What I Would Improve in Production

- Add authentication and authorization
- Add pagination, search and filtering
- Add audit log for invoice changes
- Add automated backend and frontend tests
- Add OpenAPI/Swagger documentation
- Add CI pipeline
- Store money values as integer minor units or use a dedicated Money value object
- Add invoice history and status transition rules
- Improve error reporting and logging
- Add role-based access control
- Add better production Docker setup with PHP-FPM and web server

<!-- invoice-lifecycle-start -->
## Invoice lifecycle rules

The module supports a minimal accounting-oriented invoice lifecycle:

- New invoices are created with `pending` status.
- Pending invoices can be edited.
- Pending invoices can be approved or rejected.
- Approved and rejected invoices are treated as final records.
- Final invoices cannot be edited, deleted or moved back to another status.
- Deletion is allowed only for pending invoices.

This mirrors a basic accounting constraint: finalized financial documents should stay immutable for consistency and auditability.

### Lifecycle API endpoints

- `PATCH /api/invoices/{id}/status` - changes a pending invoice to `approved` or `rejected`.
- `DELETE /api/invoices/{id}` - deletes only pending invoices.

Both lifecycle actions are validated on the backend and reflected in the frontend list and details pages.

### Frontend architecture note

The frontend uses composables instead of Pinia for this assignment because invoice list state, details state, creation form state, edit form state and lifecycle action state are local to the invoice module. This keeps components mostly presentational without introducing unnecessary global state.
<!-- invoice-lifecycle-end -->
