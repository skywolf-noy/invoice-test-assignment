import { defineStore } from 'pinia'

export type AppNotificationType = 'success' | 'error' | 'warning' | 'info'

export interface AppNotification {
  id: string
  type: AppNotificationType
  message: string
  createdAt: number
}

interface PushNotificationPayload {
  type: AppNotificationType
  message: string
  duration?: number
}

function createNotificationId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    items: [] as AppNotification[],
  }),

  getters: {
    hasNotifications: (state) => state.items.length > 0,
  },

  actions: {
    push(payload: PushNotificationPayload): string {
      const id = createNotificationId()
      const duration = payload.duration ?? 4500

      this.items = [
        {
          id,
          type: payload.type,
          message: payload.message,
          createdAt: Date.now(),
        },
        ...this.items,
      ].slice(0, 5)

      if ((import.meta.client || typeof window !== 'undefined') && duration > 0) {
        window.setTimeout(() => {
          this.remove(id)
        }, duration)
      }

      return id
    },

    remove(id: string): void {
      this.items = this.items.filter((item) => item.id !== id)
    },

    clear(): void {
      this.items = []
    },
  },
})
