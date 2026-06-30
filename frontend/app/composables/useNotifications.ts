import { storeToRefs } from 'pinia'
import { useAppI18n } from '~/composables/useAppI18n'
import { useNotificationsStore, type AppNotificationType } from '~/stores/notifications'

type TranslationParams = Record<string, string | number>

interface NotifyOptions {
  duration?: number
  params?: TranslationParams
}

export function useNotifications() {
  const notificationsStore = useNotificationsStore()

  const {
    items: notifications,
    hasNotifications,
  } = storeToRefs(notificationsStore)

  const {
    t,
  } = useAppI18n()

  function notify(
    type: AppNotificationType,
    translationKey: string,
    options: NotifyOptions = {},
  ): string {
    return notificationsStore.push({
      type,
      message: t(translationKey, options.params),
      duration: options.duration,
    })
  }

  function notifySuccess(translationKey: string, options?: NotifyOptions): string {
    return notify('success', translationKey, options)
  }

  function notifyError(translationKey: string, options?: NotifyOptions): string {
    return notify('error', translationKey, options)
  }

  function notifyWarning(translationKey: string, options?: NotifyOptions): string {
    return notify('warning', translationKey, options)
  }

  function notifyInfo(translationKey: string, options?: NotifyOptions): string {
    return notify('info', translationKey, options)
  }

  function removeNotification(id: string): void {
    notificationsStore.remove(id)
  }

  return {
    notifications,
    hasNotifications,
    notify,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    removeNotification,
  }
}
