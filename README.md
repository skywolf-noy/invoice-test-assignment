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

## Current Status

Project skeleton is prepared. Invoice module implementation is in progress.
