import { vi } from 'vitest'

vi.stubGlobal('navigateTo', vi.fn())
vi.stubGlobal('useRoute', vi.fn(() => ({
  params: {},
})))
