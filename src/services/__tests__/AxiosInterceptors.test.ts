import { describe, it, expect, vi, beforeEach } from 'vitest'
import AxiosRequestIntrceptorConfigCallback from '../axios/AxiosRequestIntrceptorConfigCallback'
import AxiosResponseIntrceptorErrorCallback from '../axios/AxiosResponseIntrceptorErrorCallback'
import { useSessionUser } from '@/store/authStore'

vi.mock('@/store/authStore', () => ({
  useSessionUser: {
    getState: vi.fn(),
  },
}))

describe('AxiosRequestIntrceptorConfigCallback', () => {
  it('should return config unchanged', () => {
    const config = { url: '/test', method: 'GET', headers: {} } as any

    const result = AxiosRequestIntrceptorConfigCallback(config)

    expect(result).toBe(config)
  })
})

describe('AxiosResponseIntrceptorErrorCallback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function mockSessionStore() {
    const setUser = vi.fn()
    const setSessionSignedIn = vi.fn()
    ;(useSessionUser.getState as any).mockReturnValue({ setUser, setSessionSignedIn })
    return { setUser, setSessionSignedIn }
  }

  it('should clear session on 401', () => {
    const { setUser, setSessionSignedIn } = mockSessionStore()

    AxiosResponseIntrceptorErrorCallback({ response: { status: 401 } } as any)

    expect(setUser).toHaveBeenCalledWith({})
    expect(setSessionSignedIn).toHaveBeenCalledWith(false)
  })

  it('should clear session on 419', () => {
    const { setUser } = mockSessionStore()

    AxiosResponseIntrceptorErrorCallback({ response: { status: 419 } } as any)

    expect(setUser).toHaveBeenCalledWith({})
  })

  it('should not clear session on 404', () => {
    const { setUser } = mockSessionStore()

    AxiosResponseIntrceptorErrorCallback({ response: { status: 404 } } as any)

    expect(setUser).not.toHaveBeenCalled()
  })

  it('should not fail when response is undefined', () => {
    AxiosResponseIntrceptorErrorCallback({} as any)
  })
})
