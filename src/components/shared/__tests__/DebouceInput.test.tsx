import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

const { mockDebounce } = vi.hoisted(() => ({
  mockDebounce: vi.fn((fn: Function) => {
    let timer: any
    return (...args: any[]) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), 0)
    }
  }),
}))

vi.mock('@/utils/hooks/useDebounce', () => ({
  default: mockDebounce,
}))

import DebouceInput from '../DebouceInput'

vi.mock('@/components/ui/Input', () => ({
  default: ({ onChange, ref, ...rest }: any) => (
    <input data-testid="input" onChange={onChange} {...rest} />
  ),
}))

describe('DebouceInput', () => {
  it('should render an input element', () => {
    render(<DebouceInput />)
    expect(screen.getByTestId('input')).toBeInTheDocument()
  })

  it('should pass placeholder prop to input', () => {
    render(<DebouceInput placeholder="Search..." />)
    expect(screen.getByTestId('input')).toHaveAttribute('placeholder', 'Search...')
  })

  it('should call useDebounce with default wait of 500ms', () => {
    render(<DebouceInput />)
    expect(mockDebounce).toHaveBeenCalledWith(expect.any(Function), 500)
  })

  it('should call useDebounce with custom wait prop', () => {
    render(<DebouceInput wait={1000} />)
    expect(mockDebounce).toHaveBeenCalledWith(expect.any(Function), 1000)
  })

  it('should call onChange after debounce delay when typing', async () => {
    const onChange = vi.fn()
    render(<DebouceInput onChange={onChange} wait={0} />)
    const input = screen.getByTestId('input')

    fireEvent.change(input, { target: { value: 'hello' } })

    await new Promise((r) => setTimeout(r, 10))
    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls[0][0].target.value).toBe('hello')
  })
})
