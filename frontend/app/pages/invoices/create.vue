<script setup lang="ts">
const {
  t,
  goBack,
  handleCreated,
} = useInvoiceCreatePage()
</script>

<template>
  <main class="app-page">
    <div class="app-container app-container--md">
      <div class="app-toolbar app-toolbar--between app-toolbar--center">
        <button
          type="button"
          class="app-button app-button--secondary"
          @click="goBack"
        >
          {{ t('navigation.backToInvoices') }}
        </button>

        <LanguageSwitcher />
      </div>

      <header class="app-page-header">
        <div class="app-page-header__content">
          <p class="app-eyebrow">
            {{ t('app.module') }}
          </p>
          <h1 class="app-title">
            {{ t('invoices.createTitle') }}
          </h1>
          <p class="app-description">
            {{ t('invoices.createDescription') }}
          </p>
        </div>
      </header>

      <InvoiceCreateForm @created="handleCreated" />
    </div>
  </main>
</template>
