import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import AppToastViewport from '~/components/AppToastViewport.vue'
import { useNotificationsStore } from '~/stores/notifications'

describe('AppToastViewport', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders notification message through teleport', async () => {
    const store = useNotificationsStore()

    store.push({
      type: 'success',
      message: 'Saved successfully',
      duration: 0,
    })

    mount(AppToastViewport, {
      attachTo: document.body,
    })

    await nextTick()

    expect(document.body.textContent).toContain('Saved successfully')
  })

  it('removes notification after close click', async () => {
    const store = useNotificationsStore()

    store.push({
      type: 'error',
      message: 'Failed',
      duration: 0,
    })

    mount(AppToastViewport, {
      attachTo: document.body,
    })

    await nextTick()

    const closeButton = document.body.querySelector('button')

    expect(closeButton).not.toBeNull()

    closeButton?.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
    }))

    await nextTick()

    expect(store.items).toHaveLength(0)
  })
})
