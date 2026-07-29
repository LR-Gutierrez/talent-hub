import { describe, it, expect, vi, beforeEach } from 'vitest'
import ApiService from '../ApiService'

const mockAxiosBase = vi.hoisted(() => vi.fn())

vi.mock('../axios/AxiosBase', () => ({
  default: mockAxiosBase,
}))

describe('ApiService', () => {
  beforeEach(() => {
    mockAxiosBase.mockReset()
  })

  it('should resolve with response.data on success', async () => {
    const responseData = { id: 1, name: 'test' }
    mockAxiosBase.mockResolvedValue({ data: responseData })

    const result = await ApiService.fetchDataWithAxios({
      url: '/test',
      method: 'GET',
    })

    expect(result).toEqual(responseData)
    expect(mockAxiosBase).toHaveBeenCalledWith({
      url: '/test',
      method: 'GET',
    })
  })

  it('should reject on error', async () => {
    const error = new Error('Network error')
    mockAxiosBase.mockRejectedValue(error)

    await expect(
      ApiService.fetchDataWithAxios({ url: '/test', method: 'GET' }),
    ).rejects.toThrow('Network error')
  })
})
