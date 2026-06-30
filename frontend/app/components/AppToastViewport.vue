<script setup lang="ts">
import { useAppI18n } from '~/composables/useAppI18n'
import { useNotifications } from '~/composables/useNotifications'
import type { AppNotificationType } from '~/stores/notifications'

const {
  notifications,
  removeNotification,
} = useNotifications()

const {
  t,
} = useAppI18n()

function getToastClass(type: AppNotificationType): string {
  return `app-toast--${type}`
}

function getIndicatorClass(type: AppNotificationType): string {
  return `app-toast__indicator--${type}`
}
</script>

<template>
  <Teleport to="body">
    <div
      class="app-toast-viewport"
      aria-live="polite"
      aria-atomic="true"
    >
      <TransitionGroup name="app-toast-list">
        <article
          v-for="notification in notifications"
          :key="notification.id"
          class="app-toast"
          :class="getToastClass(notification.type)"
        >
          <span
            class="app-toast__indicator"
            :class="getIndicatorClass(notification.type)"
            aria-hidden="true"
          />

          <p class="app-toast__message">
            {{ notification.message }}
          </p>

          <button
            type="button"
            class="app-toast__close"
            :aria-label="t('app.close')"
            @click="removeNotification(notification.id)"
          >
            ×
          </button>
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
