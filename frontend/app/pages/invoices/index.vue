<script setup lang="ts">
const {
  invoices,
  isLoading,
  error,
  actionError,
  formatMoney,
  formatDate,
  t,
  refreshInvoices,
  openInvoice,
  openCreateInvoice,
  canChangeStatus,
  canDelete,
  isActionProcessing,
  changeInvoiceStatus,
  deleteInvoice,
} = useInvoicesPage()
</script>

<template>
  <main class="app-page">
    <div class="app-container">
      <header class="app-page-header">
        <div class="app-page-header__content">
          <p class="app-eyebrow">
            {{ t('app.module') }}
          </p>
          <h1 class="app-title">
            {{ t('invoices.title') }}
          </h1>
          <p class="app-description">
            {{ t('invoices.moduleDescription') }}
          </p>
        </div>

        <div class="app-page-header__actions">
          <LanguageSwitcher />

          <InvoiceExportMenu
            mode="list"
            :invoices="invoices"
          />

          <button
            type="button"
            class="app-button app-button--primary"
            @click="openCreateInvoice"
          >
            {{ t('invoices.createInvoice') }}
          </button>
        </div>
      </header>

      <section class="app-section">
        <div class="app-section__header">
          <div>
            <h2 class="app-section-title">
              {{ t('invoices.listTitle') }}
            </h2>
            <p class="app-section-description">
              {{ t('invoices.listDescription') }}
            </p>
          </div>

          <button
            type="button"
            class="app-button app-button--secondary"
            @click="refreshInvoices"
          >
            {{ t('app.refresh') }}
          </button>
        </div>

        <div v-if="actionError" class="app-section__body">
          <div class="app-alert app-alert--error">
            {{ actionError }}
          </div>
        </div>

        <div v-if="isLoading" class="app-state">
          {{ t('invoices.loadingList') }}
        </div>

        <div v-else-if="error" class="app-section__body">
          <div class="app-alert app-alert--error">
            {{ error }}
          </div>
        </div>

        <div v-else-if="!invoices.length" class="app-state">
          {{ t('invoices.noInvoices') }}
        </div>

        <div v-else class="app-table-wrap">
          <table class="app-table">
            <thead>
              <tr>
                <th>{{ t('fields.number') }}</th>
                <th>{{ t('fields.supplier') }}</th>
                <th>{{ t('fields.grossAmount') }}</th>
                <th>{{ t('fields.status') }}</th>
                <th>{{ t('fields.dueDate') }}</th>
                <th>{{ t('app.actions') }}</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="invoice in invoices"
                :key="invoice.id"
                class="app-table__row"
                tabindex="0"
                role="button"
                @click="openInvoice(invoice)"
                @keydown.enter="openInvoice(invoice)"
              >
                <td class="app-table__cell--strong">
                  {{ invoice.number }}
                </td>

                <td class="app-table__cell--muted">
                  {{ invoice.supplier_name }}
                </td>

                <td class="app-table__cell--amount">
                  {{ formatMoney(invoice.gross_amount, invoice.currency) }}
                </td>

                <td>
                  <InvoiceStatusBadge :status="invoice.status" />
                </td>

                <td class="app-table__cell--muted">
                  {{ formatDate(invoice.due_date) }}
                </td>

                <td @click.stop @keydown.stop>
                  <div v-if="canChangeStatus(invoice)" class="app-table__actions">
                    <InvoiceStatusSelect
                      :invoice="invoice"
                      :processing="isActionProcessing(invoice.id)"
                      @change-status="changeInvoiceStatus(invoice, $event)"
                    />

                    <button
                      v-if="canDelete(invoice)"
                      type="button"
                      class="app-button app-button--danger app-button--icon"
                      :disabled="isActionProcessing(invoice.id)"
                      :title="t('invoices.deleteInvoice')"
                      :aria-label="t('invoices.deleteInvoice')"
                      @click="deleteInvoice(invoice)"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M9 3h6m-8 4h10m-9 0 .7 13h6.6L16 7M10 11v5m4-5v5"
                          stroke="currentColor"
                          stroke-width="1.8"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <span v-else class="app-table__finalised">
                    {{ t('invoices.finalised') }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>
</template>
