<script setup lang="ts">
const {
  invoice,
  isLoading,
  error,
  actionError,
  formatMoney,
  formatDate,
  formatDateTime,
  t,
  goBack,
  refreshDetails,
  handleUpdated,
  canDelete,
  isActionProcessing,
  changeInvoiceStatus,
  deleteInvoice,
} = useInvoiceDetailsPage()

definePageMeta({
  validate: (route) => /^\d+$/.test(String(route.params.id)),
})
</script>

<template>
  <main class="app-page">
    <div class="app-container app-container--md">
      <div v-if="isLoading" class="app-card">
        <div class="app-state">
          {{ t('invoices.loadingDetails') }}
        </div>
      </div>

      <div v-else-if="error" class="app-alert app-alert--error">
        {{ error }}
      </div>

      <div v-else-if="!invoice" class="app-card">
        <div class="app-state">
          {{ t('invoices.notFound') }}
        </div>
      </div>

      <div v-else class="app-stack">
        <section class="app-details-hero">
          <div class="app-details-hero__toolbar">
            <button
              type="button"
              class="app-button app-button--secondary"
              @click="goBack"
            >
              {{ t('navigation.backToInvoices') }}
            </button>

            <div class="app-details-hero__toolbar-actions">
              <LanguageSwitcher />

              <InvoiceExportMenu
                mode="details"
                :invoice="invoice"
              />
            </div>
          </div>

          <div class="app-details-hero__top">
            <div>
              <p class="app-eyebrow">
                {{ t('invoices.detailsTitle') }}
              </p>
              <h1 class="app-title">
                {{ invoice.number }}
              </h1>
              <p class="app-details-hero__meta">
                {{ invoice.supplier_name }} · {{ t('fields.supplierTaxId') }}: {{ invoice.supplier_tax_id }}
              </p>
            </div>

            <div class="app-details-hero__status">
              <InvoiceStatusBadge :status="invoice.status" />
            </div>
          </div>

          <dl class="app-grid app-grid--three">
            <div class="app-metric-card">
              <dt class="app-metric-card__label">
                {{ t('fields.netAmount') }}
              </dt>
              <dd class="app-metric-card__value">
                {{ formatMoney(invoice.net_amount, invoice.currency) }}
              </dd>
            </div>

            <div class="app-metric-card">
              <dt class="app-metric-card__label">
                {{ t('fields.vatAmount') }}
              </dt>
              <dd class="app-metric-card__value">
                {{ formatMoney(invoice.vat_amount, invoice.currency) }}
              </dd>
            </div>

            <div class="app-metric-card">
              <dt class="app-metric-card__label">
                {{ t('fields.grossAmount') }}
              </dt>
              <dd class="app-metric-card__value">
                {{ formatMoney(invoice.gross_amount, invoice.currency) }}
              </dd>
            </div>

            <div class="app-metric-card">
              <dt class="app-metric-card__label">
                {{ t('fields.issueDate') }}
              </dt>
              <dd class="app-metric-card__value">
                {{ formatDate(invoice.issue_date) }}
              </dd>
            </div>

            <div class="app-metric-card">
              <dt class="app-metric-card__label">
                {{ t('fields.dueDate') }}
              </dt>
              <dd class="app-metric-card__value">
                {{ formatDate(invoice.due_date) }}
              </dd>
            </div>

            <div class="app-metric-card">
              <dt class="app-metric-card__label">
                {{ t('fields.lastUpdated') }}
              </dt>
              <dd class="app-metric-card__value">
                {{ formatDateTime(invoice.updated_at) }}
              </dd>
            </div>
          </dl>

          <div class="app-inline-actions">
            <button
              type="button"
              class="app-button app-button--secondary"
              @click="refreshDetails"
            >
              {{ t('invoices.refreshDetails') }}
            </button>
          </div>
        </section>

        <InvoiceEditForm
          :invoice="invoice"
          :lifecycle-error="actionError"
          :lifecycle-processing="isActionProcessing(invoice.id)"
          :delete-processing="isActionProcessing(invoice.id, 'delete')"
          :show-delete="canDelete(invoice)"
          @updated="handleUpdated"
          @change-status="changeInvoiceStatus"
          @delete="deleteInvoice"
        />
      </div>
    </div>
  </main>
</template>
