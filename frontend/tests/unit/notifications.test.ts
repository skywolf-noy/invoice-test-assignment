import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useNotifications } from '~/composables/useNotifications'
import { useLocaleStore } from '~/stores/locale'
import { useNotificationsStore } from '~/stores/notifications'

describe('notifications store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('pushes notification and removes it manually', () => {
    const store = useNotificationsStore()

    const id = store.push({
      type: 'success',
      message: 'Saved',
      duration: 0,
    })

    expect(store.items).toHaveLength(1)
    expect(store.items[0]?.id).toBe(id)
    expect(store.items[0]?.message).toBe('Saved')

    store.remove(id)

    expect(store.items).toHaveLength(0)
  })

  it('auto-removes notification after duration', () => {
    const store = useNotificationsStore()

    store.push({
      type: 'info',
      message: 'Processing',
      duration: 1000,
    })

    expect(store.items).toHaveLength(1)

    vi.advanceTimersByTime(1000)

    expect(store.items).toHaveLength(0)
  })

  it('uses translated messages through useNotifications', () => {
    const localeStore = useLocaleStore()
    const store = useNotificationsStore()
    const {
      notifySuccess,
    } = useNotifications()

    localeStore.setLocale('ua')

    notifySuccess('notifications.created', { duration: 0 })

    expect(store.items).toHaveLength(1)
    expect(store.items[0]?.message).toBe('Рахунок створено.')
  })
})
