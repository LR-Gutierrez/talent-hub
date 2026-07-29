import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockFetchDataWithAxios } = vi.hoisted(() => ({
  mockFetchDataWithAxios: vi.fn(),
}))

vi.mock('@/services/ApiService', () => ({
  default: { fetchDataWithAxios: mockFetchDataWithAxios },
}))

vi.mock('@/configs/endpoint.config', () => ({
  default: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    signOut: '/auth/sign-out',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    me: '/auth/me',
  },
}))

import { apiSignIn, apiSignUp, apiSignOut, apiForgotPassword, apiResetPassword, apiGetMe } from '../AuthService'

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('apiSignIn calls fetchDataWithAxios with sign-in endpoint', async () => {
    mockFetchDataWithAxios.mockResolvedValue({ data: { token: 'abc' } })
    const credentials = { email: 'test@test.com', password: 'pass123' }

    const result = await apiSignIn(credentials)

    expect(mockFetchDataWithAxios).toHaveBeenCalledWith({
      url: '/auth/sign-in',
      method: 'post',
      data: credentials,
    })
    expect(result).toEqual({ data: { token: 'abc' } })
  })

  it('apiSignUp calls fetchDataWithAxios with sign-up endpoint', async () => {
    mockFetchDataWithAxios.mockResolvedValue({ data: { id: '1' } })
    const data = { email: 'new@test.com', password: 'pass123', name: 'New User' }

    const result = await apiSignUp(data)

    expect(mockFetchDataWithAxios).toHaveBeenCalledWith({
      url: '/auth/sign-up',
      method: 'post',
      data,
    })
    expect(result).toEqual({ data: { id: '1' } })
  })

  it('apiSignOut calls fetchDataWithAxios with sign-out endpoint', async () => {
    mockFetchDataWithAxios.mockResolvedValue(undefined)

    await apiSignOut()

    expect(mockFetchDataWithAxios).toHaveBeenCalledWith({
      url: '/auth/sign-out',
      method: 'post',
    })
  })

  it('apiForgotPassword calls fetchDataWithAxios with forgot-password endpoint', async () => {
    mockFetchDataWithAxios.mockResolvedValue({ message: 'ok' })
    const data = { email: 'test@test.com' }

    const result = await apiForgotPassword(data)

    expect(mockFetchDataWithAxios).toHaveBeenCalledWith({
      url: '/auth/forgot-password',
      method: 'post',
      data,
    })
    expect(result).toEqual({ message: 'ok' })
  })

  it('apiResetPassword calls fetchDataWithAxios with reset-password endpoint', async () => {
    mockFetchDataWithAxios.mockResolvedValue({ message: 'ok' })
    const data = { token: 'xyz', password: 'newPass123' }

    const result = await apiResetPassword(data)

    expect(mockFetchDataWithAxios).toHaveBeenCalledWith({
      url: '/auth/reset-password',
      method: 'post',
      data,
    })
    expect(result).toEqual({ message: 'ok' })
  })

  it('apiGetMe calls fetchDataWithAxios with me endpoint', async () => {
    mockFetchDataWithAxios.mockResolvedValue({ data: { id: '1', email: 'test@test.com' } })

    const result = await apiGetMe()

    expect(mockFetchDataWithAxios).toHaveBeenCalledWith({
      url: '/auth/me',
      method: 'get',
    })
    expect(result).toEqual({ data: { id: '1', email: 'test@test.com' } })
  })
})
