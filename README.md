# Invoice Test Assignment

Full-stack test assignment: invoice management module.

## Stack

- Backend: Laravel 12, PHP 8.4 in Docker (requirement: PHP 8.2+)
- Database: PostgreSQL
- Frontend: Nuxt 4, Vue 3.5, TypeScript
- Styling: TailwindCSS 4
- Environment: Docker Compose

## Project Structure

- backend/  - Laravel REST API
- frontend/ - Nuxt frontend application
- docker-compose.yml - local development environment

## Local Run

Start all services:

docker compose up --build

Available URLs:

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- PostgreSQL: localhost:5432

Stop services:

docker compose down


## API Endpoints

- GET /api/invoices - list invoices
- GET /api/invoices/{id} - show one invoice
- POST /api/invoices - create invoice
- PUT /api/invoices/{id} - update pending invoice

## Backend Decisions

- Invoice ID uses auto increment because the assignment allows uuid or auto increment.
- gross_amount is validated against net_amount + vat_amount.
- gross_amount is recalculated on the backend before persistence.
- Invoice update is allowed only for pending invoices.
- Authentication is intentionally not implemented because it is not required.

## Current Status

Backend invoice API implementation is in progress.
