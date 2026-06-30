<script setup lang="ts">
import type { AppNotificationType } from '~/stores/notifications'

const {
  notifications,
  removeNotification,
} = useNotifications()

const {
  t,
} = useAppI18n()

function getToastClass(type: AppNotificationType): string {
  return {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    error: 'border-rose-200 bg-rose-50 text-rose-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    info: 'border-sky-200 bg-sky-50 text-sky-900',
  }[type]
}

function getIndicatorClass(type: AppNotificationType): string {
  return {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
  }[type]
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed right-4 top-4 z-50 flex w-[min(calc(100vw-2rem),24rem)] flex-col gap-3"
      aria-live="polite"
      aria-atomic="true"
    >
      <TransitionGroup
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-2 opacity-0"
      >
        <article
          v-for="notification in notifications"
          :key="notification.id"
          class="flex items-start gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur"
          :class="getToastClass(notification.type)"
        >
          <span
            class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
            :class="getIndicatorClass(notification.type)"
            aria-hidden="true"
          />

          <p class="min-w-0 flex-1 text-sm font-semibold leading-5">
            {{ notification.message }}
          </p>

          <button
            type="button"
            class="rounded-lg px-2 text-lg leading-none opacity-60 transition hover:opacity-100"
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
