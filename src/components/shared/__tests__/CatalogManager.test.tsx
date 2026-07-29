import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CatalogManager from '../CatalogManager'

const mockItems = [
  { id: '1', name: 'Male', value: 'male', sortOrder: 1, isActive: true, deletedAt: null },
  { id: '2', name: 'Female', value: 'female', sortOrder: 2, isActive: true, deletedAt: null },
]

const mockCatalogsService = vi.hoisted(() => ({
  apiGetCatalogs: vi.fn(),
  apiCreateCatalog: vi.fn(),
  apiUpdateCatalog: vi.fn(),
  apiDeleteCatalog: vi.fn(),
  apiRestoreCatalog: vi.fn(),
  apiUploadFlag: vi.fn(),
  apiDeleteFlag: vi.fn(),
}))

vi.mock('@/services/CatalogsService', () => mockCatalogsService)

vi.mock('@/utils/hooks/useTranslation', () => ({
  default: () => ({ t: (key: string, fallback: string) => fallback, i18n: { language: 'en' } }),
}))

vi.mock('@/components/shared/Container', () => ({
  default: ({ children }: any) => <div data-testid="container">{children}</div>,
}))

vi.mock('@/components/shared/AdaptiveCard', () => ({
  default: ({ children }: any) => <div data-testid="adaptive-card">{children}</div>,
}))

vi.mock('@/components/shared/ConfirmDialog', () => ({
  default: ({ isOpen, title, onConfirm, onCancel }: any) =>
    isOpen ? (
      <div data-testid="confirm-dialog">
        <div>{title}</div>
        <button data-testid="confirm-delete" onClick={onConfirm}>Delete</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null,
}))

vi.mock('@/components/shared/DebouceInput', () => ({
  default: ({ onChange, placeholder }: any) => (
    <div data-testid="debounce-input">
      <input
        placeholder={placeholder}
        onChange={(e) => onChange(e)}
        data-testid="search-input"
      />
    </div>
  ),
}))

vi.mock('@/components/shared/ShowDeletedToggle', () => ({
  default: ({ checked, onChange }: any) => (
    <label data-testid="show-deleted-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      Show deleted
    </label>
  ),
}))

vi.mock('@/components/ui/Table', () => {
  const THead = ({ children }: any) => <thead>{children}</thead>
  const TBody = ({ children }: any) => <tbody>{children}</tbody>
  const Tr = ({ children }: any) => <tr>{children}</tr>
  const Th = ({ children }: any) => <th>{children}</th>
  const Td = ({ children }: any) => <td>{children}</td>
  const Table = ({ children }: any) => <table data-testid="table">{children}</table>
  Table.THead = THead
  Table.TBody = TBody
  Table.Tr = Tr
  Table.Th = Th
  Table.Td = Td
  return { default: Table }
})

vi.mock('@/components/ui/Button', () => ({
  default: ({ children, onClick, icon, type, ...props }: any) => (
    <button type={type || 'button'} onClick={onClick} data-testid="button" {...props}>
      {icon}{children}
    </button>
  ),
}))

vi.mock('@/components/ui/Tooltip', () => ({
  default: ({ children, title }: any) => <span title={title}>{children}</span>,
}))

vi.mock('@/components/ui/Notification', () => ({
  default: ({ children }: any) => <div data-testid="notification">{children}</div>,
}))

vi.mock('@/components/ui/toast', () => ({
  default: { push: vi.fn() },
}))

vi.mock('@/components/ui/Dialog', () => ({
  default: ({ isOpen, children }: any) =>
    isOpen ? <div data-testid="dialog">{children}</div> : null,
}))

vi.mock('@/components/ui/Form', () => ({
  Form: ({ children, onSubmit }: any) => (
    <form onSubmit={onSubmit} data-testid="form">
      {children}
    </form>
  ),
  FormItem: ({ children, label, invalid, errorMessage }: any) => (
    <div data-testid="form-item" data-invalid={invalid}>
      {label && <label>{label}</label>}
      {children}
      {errorMessage && <span data-testid="form-error">{errorMessage}</span>}
    </div>
  ),
}))

vi.mock('@/components/ui/Input', () => ({
  default: ({ placeholder, value, onChange, onBlur }: any) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      data-testid="input"
    />
  ),
}))

vi.mock('@/components/ui/Pagination', () => ({
  default: ({ currentPage, total, onChange }: any) => (
    <div data-testid="pagination">
      <button onClick={() => onChange(currentPage + 1)}>Next</button>
    </div>
  ),
}))

vi.mock('@/components/ui/Select', () => ({
  default: ({ value, options, onChange }: any) => (
    <select data-testid="select" value={value?.value} onChange={(e) => {
      const opt = options.find((o: any) => o.value === e.target.value)
      onChange(opt)
    }}>
      {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  ),
}))

vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form')
  const originalUseForm = actual.useForm
  return {
    ...actual,
    useForm: (options?: any) => {
      const result = originalUseForm(options)
      return {
        ...result,
        handleSubmit: (callback: any) => (e: any) => {
          e?.preventDefault?.()
          callback(options?.defaultValues || {})
        },
      }
    },
  }
})

describe('CatalogManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCatalogsService.apiGetCatalogs.mockResolvedValue({ list: mockItems, total: 2 })
  })

  it('should load and display catalog items on mount', async () => {
    render(<CatalogManager title="Genders" endpoint="/genders" />)

    await waitFor(() => {
      expect(screen.getByText('Male')).toBeInTheDocument()
    })
    expect(screen.getByText('Female')).toBeInTheDocument()
    expect(mockCatalogsService.apiGetCatalogs).toHaveBeenCalledWith('/genders', expect.any(Object))
  })

  it('should show empty state when no items', async () => {
    mockCatalogsService.apiGetCatalogs.mockResolvedValue({ list: [], total: 0 })

    render(<CatalogManager title="Genders" endpoint="/genders" />)

    await waitFor(() => {
      expect(screen.getByText('No items')).toBeInTheDocument()
    })
  })

  it('should reload items when search query changes', async () => {
    render(<CatalogManager title="Genders" endpoint="/genders" />)

    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument()
    })

    mockCatalogsService.apiGetCatalogs.mockClear()
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'Male' } })

    await waitFor(() => {
      expect(mockCatalogsService.apiGetCatalogs).toHaveBeenCalledWith(
        '/genders',
        expect.objectContaining({ query: 'Male' }),
      )
    })
  })

  it('should open create dialog when Add button is clicked', async () => {
    render(<CatalogManager title="Genders" endpoint="/genders" />)

    await waitFor(() => {
      expect(screen.getByText('Add')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Add'))

    expect(screen.getByTestId('dialog')).toBeInTheDocument()
  })

  it('should open edit dialog when edit button is clicked', async () => {
    render(<CatalogManager title="Genders" endpoint="/genders" />)

    await waitFor(() => {
      expect(screen.getByText('Male')).toBeInTheDocument()
    })

    fireEvent.click(screen.getAllByTitle('Edit')[0].querySelector('button')!)

    expect(screen.getByTestId('dialog')).toBeInTheDocument()
  })

  it('should call delete API when confirmed', async () => {
    mockCatalogsService.apiDeleteCatalog.mockResolvedValue(undefined)

    render(<CatalogManager title="Genders" endpoint="/genders" />)

    await waitFor(() => {
      expect(screen.getByText('Male')).toBeInTheDocument()
    })

    fireEvent.click(screen.getAllByTitle('Delete')[0].querySelector('button')!)

    await waitFor(() => {
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('confirm-delete'))

    await waitFor(() => {
      expect(mockCatalogsService.apiDeleteCatalog).toHaveBeenCalledWith('/genders', '1')
    })
  })

  it('should call restore API when restore is clicked on deleted item', async () => {
    mockCatalogsService.apiGetCatalogs.mockResolvedValue({
      list: [{ id: '3', name: 'Deleted Item', value: 'del', sortOrder: 3, isActive: true, deletedAt: '2025-01-01' }],
      total: 1,
    })

    render(<CatalogManager title="Genders" endpoint="/genders" />)

    await waitFor(() => {
      expect(screen.getByText('Deleted Item')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTitle('Restore').querySelector('button')!)

    await waitFor(() => {
      expect(mockCatalogsService.apiRestoreCatalog).toHaveBeenCalledWith('/genders', '3')
    })
  })

  it('should show value column when showValue is true', async () => {
    render(<CatalogManager title="Genders" endpoint="/genders" showValue={true} />)

    await waitFor(() => {
      expect(screen.getByText('Value')).toBeInTheDocument()
    })
  })
})
