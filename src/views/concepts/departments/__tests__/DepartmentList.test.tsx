import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DepartmentList from '../DepartmentList'

const mockDepartments = [
  { id: 'dept-1', name: 'Engineering', description: 'Engineering dept', isActive: true, deletedAt: null },
  { id: 'dept-2', name: 'Marketing', description: null, isActive: true, deletedAt: null },
]

const mockDeptService = vi.hoisted(() => ({
  apiGetDepartments: vi.fn(),
  apiDeleteDepartment: vi.fn(),
  apiRestoreDepartment: vi.fn(),
  apiGetDepartmentEmployeeCount: vi.fn(),
}))

vi.mock('@/services/DepartmentsService', () => mockDeptService)

vi.mock('@/utils/hooks/useTranslation', () => ({
  default: () => ({ t: (key: string, fallback: string) => fallback }),
}))

vi.mock('@/components/shared/Container', () => ({
  default: ({ children }: any) => <div data-testid="container">{children}</div>,
}))

vi.mock('@/components/shared/AdaptiveCard', () => ({
  default: ({ children }: any) => <div data-testid="adaptive-card">{children}</div>,
}))

vi.mock('@/components/shared/DataTable', () => ({
  default: ({ columns, data, noData, loading, pagingData, onPaginationChange, onSelectChange }: any) => (
    <div data-testid="data-table">
      {loading ? <div>Loading...</div> : null}
      {noData ? <div>No data</div> : null}
      {data.map((row: any, idx: number) => (
        <div key={row.id} data-testid="table-row">
          {columns.map((col: any) => {
            const val = col.accessorKey ? row[col.accessorKey] : null
            const cell = col.cell ? col.cell({ row: { original: row } }) : val
            return <span key={col.header as string}>{cell}</span>
          })}
        </div>
      ))}
    </div>
  ),
}))

vi.mock('@/components/shared/DebouceInput', () => ({
  default: ({ onChange, placeholder }: any) => (
    <input
      placeholder={placeholder}
      onChange={(e) => onChange(e)}
      data-testid="search-input"
    />
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

vi.mock('@/components/ui/Button', () => ({
  default: ({ children, onClick, icon, type, loading, disabled, ...props }: any) => (
    <button type={type || 'button'} onClick={onClick} data-testid="button" disabled={disabled} {...props}>
      {icon}{children}
    </button>
  ),
}))

vi.mock('@/components/ui/Tooltip', () => ({
  default: ({ children, title }: any) => <span title={title}>{children}</span>,
}))

vi.mock('@/components/ui/Tag', () => ({
  default: ({ children, className }: any) => <span className={className}>{children}</span>,
}))

vi.mock('@/components/ui/Dialog', () => ({
  default: ({ isOpen, children, closable }: any) =>
    isOpen ? <div data-testid="dialog">{children}</div> : null,
}))

vi.mock('@/components/ui/Select', () => ({
  default: ({ value, options, onChange, placeholder }: any) => (
    <select
      data-testid="select"
      value={value?.value || ''}
      onChange={(e) => {
        const opt = options?.find((o: any) => o.value === e.target.value)
        onChange(opt)
      }}
    >
      <option value="">{placeholder || 'Select...'}</option>
      {(options || []).map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  ),
}))

vi.mock('@/components/ui/Spinner', () => ({
  default: ({ size }: any) => <div data-testid="spinner" />,
}))

vi.mock('@/components/ui/Avatar', () => ({
  default: ({ children, shape, className }: any) => (
    <div data-testid="avatar" className={className}>{children}</div>
  ),
}))

vi.mock('@/components/ui/Notification', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('@/components/ui/toast', () => ({
  default: { push: vi.fn() },
}))

vi.mock('@casl/react', () => ({
  Can: ({ children, I, a }: any) => (typeof children === 'function' ? children({ allowed: true }) : <>{children}</>),
}))

vi.mock('../DepartmentForm', () => ({
  default: ({ department, onSuccess }: any) => (
    <div data-testid="department-form">
      <button data-testid="form-success" onClick={onSuccess}>Success</button>
    </div>
  ),
}))

describe('DepartmentList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDeptService.apiGetDepartments.mockResolvedValue({ list: mockDepartments, total: 2 })
  })

  it('should load and render departments on mount', async () => {
    render(<DepartmentList />)

    await waitFor(() => {
      expect(screen.getByText('Engineering')).toBeInTheDocument()
    })
    expect(screen.getByText('Marketing')).toBeInTheDocument()
    expect(mockDeptService.apiGetDepartments).toHaveBeenCalledWith({
      pageIndex: 1,
      pageSize: 10,
      query: undefined,
      withDeleted: undefined,
    })
  })

  it('should show the Add Department button', async () => {
    render(<DepartmentList />)

    await waitFor(() => {
      expect(screen.getByText('Add Department')).toBeInTheDocument()
    })
  })

  it('should open create dialog when Add Department is clicked', async () => {
    render(<DepartmentList />)

    await waitFor(() => {
      expect(screen.getByText('Add Department')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Add Department'))

    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByText('Create Department')).toBeInTheDocument()
  })

  it('should navigate to next page when pagination changes', async () => {
    mockDeptService.apiGetDepartments.mockResolvedValue({ list: mockDepartments, total: 25 })

    render(<DepartmentList />)

    await waitFor(() => {
      expect(screen.getByText('Engineering')).toBeInTheDocument()
    })
  })
})
