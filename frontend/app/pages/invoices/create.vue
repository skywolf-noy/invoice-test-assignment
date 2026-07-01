<script setup lang="ts">
const {
  t,
  handleCreated,
} = useInvoiceCreatePage()
</script>

<template>
  <main class="app-page">
    <div class="app-container app-container--md">
      <div class="app-stack">
        <section class="app-details-hero app-create-hero">
          <div class="app-details-hero__toolbar">
            <NuxtLink
              to="/invoices"
              class="app-button app-button--secondary"
            >
              {{ t('navigation.backToInvoices') }}
            </NuxtLink>

            <div class="app-details-hero__toolbar-actions">
              <LanguageSwitcher />
            </div>
          </div>

          <div class="app-create-hero__content">
            <p class="app-eyebrow">
              {{ t('app.module') }}
            </p>

            <h1 class="app-title">
              {{ t('invoices.createTitle') }}
            </h1>

            <p class="app-details-hero__meta">
              {{ t('invoices.createDescription') }}
            </p>
          </div>
        </section>

        <section class="app-card">
          <InvoiceCreateForm @created="handleCreated" />
        </section>
      </div>
    </div>
  </main>
</template>
