import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockStatuses, mockMutate, loadStatusesSpy } = vi.hoisted(() => ({
  mockStatuses: [
    { id: 's1', name: 'Active', color: '#00ff00', description: 'Employed', isActive: true, deletedAt: null },
    { id: 's2', name: 'Inactive', color: '#ff0000', description: 'Not working', isActive: false, deletedAt: null },
    { id: 's3', name: 'DeletedStatus', color: '#ccc', description: null, isActive: true, deletedAt: '2025-01-01' },
  ],
  mockMutate: vi.fn(),
  loadStatusesSpy: vi.fn(),
}))

vi.mock('@/components/shared/Container', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('@/components/shared/AdaptiveCard', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('@/components/shared/DataTable', () => ({
  default: ({ columns, data, noData, loading }: any) => (
    <div data-testid="data-table">
      {loading ? <div>Loading...</div> : null}
      {noData ? <div>No data</div> : null}
      {data.map((row: any) => (
        <div key={row.id} data-testid="table-row">
          {columns.map((col: any) => {
            const val = col.accessorKey ? row[col.accessorKey] : null
            const cell = col.cell ? col.cell({ row: { original: row } }) : val
            return <span key={col.id || col.header as string}>{cell}</span>
          })}
        </div>
      ))}
    </div>
  ),
}))

vi.mock('@/components/shared/DebouceInput', () => ({
  default: ({ onChange, placeholder, suffix }: any) => (
    <div>
      {suffix}
      <input data-testid="debounce-input" placeholder={placeholder} onChange={onChange} />
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

vi.mock('@/components/ui/Button', () => ({
  default: ({ children, onClick, ...props }: any) => (
    <button data-testid="button" onClick={onClick} {...props}>{children}</button>
  ),
}))

vi.mock('@/components/ui/Tag', () => ({
  default: ({ children, className }: any) => <span className={className}>{children}</span>,
}))

vi.mock('@/components/ui/Tooltip', () => ({
  default: ({ children, title }: any) => <span title={title}>{children}</span>,
}))

vi.mock('@/components/ui/Avatar', () => ({
  default: ({ children, className, shape }: any) => <div className={className} data-testid="avatar">{children}</div>,
}))

vi.mock('@/components/ui/Select', () => ({
  default: ({ options, value, onChange, placeholder, isSearchable }: any) => (
    <select data-testid="select" value={value?.value || ''} onChange={(e) => {
      const opt = options.find((o: any) => o.value === e.target.value)
      onChange(opt || null)
    }}>
      <option value="">{placeholder}</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  ),
}))

vi.mock('@/components/ui/Spinner', () => ({
  default: ({ size }: any) => <div data-testid="spinner" style={{ width: size, height: size }} />,
}))

vi.mock('@/components/ui/Dialog', () => ({
  default: ({ isOpen, children, closable, onClose }: any) =>
    isOpen ? <div data-testid="dialog">{children}</div> : null,
}))

vi.mock('@/components/ui/toast', () => ({
  default: { push: vi.fn() },
}))

vi.mock('@/components/ui/Notification', () => ({
  default: ({ children, type }: any) => <div data-testid={`notification-${type}`}>{children}</div>,
}))

vi.mock('@casl/react', () => ({
  Can: ({ children }: any) => (typeof children === 'function' ? children({ allowed: true }) : <>{children}</>),
}))

vi.mock('react-icons/tb', () => ({
  TbPencil: () => <span data-testid="icon-pencil">Pencil</span>,
  TbTrash: () => <span data-testid="icon-trash">Trash</span>,
  TbPlus: () => <span data-testid="icon-plus">Plus</span>,
  TbSearch: () => <span data-testid="icon-search">Search</span>,
  TbRestore: () => <span data-testid="icon-restore">Restore</span>,
}))

vi.mock('react-icons/hi', () => ({
  HiOutlineExclamationCircle: () => <span data-testid="icon-exclamation">Exclamation</span>,
}))

vi.mock('@/utils/hooks/useTranslation', () => ({
  default: () => ({ t: (key: string, fallback: string) => fallback }),
}))

vi.mock('@/services/EmployeeStatusesService', () => ({
  apiGetEmployeeStatuses: vi.fn().mockResolvedValue({ list: mockStatuses, total: 3 }),
  apiDeleteEmployeeStatus: vi.fn(),
  apiRestoreEmployeeStatus: vi.fn(),
  apiGetEmployeeStatusCount: vi.fn(),
}))

vi.mock('../EmployeeStatusForm', () => ({
  default: ({ status, onSuccess }: any) => (
    <div data-testid="employee-status-form">
      <span>{status ? `Editing: ${status.name}` : 'Creating'}</span>
      <button data-testid="form-success-btn" onClick={onSuccess}>Save</button>
    </div>
  ),
}))

import EmployeeStatusList from '../EmployeeStatusList'
import { apiRestoreEmployeeStatus } from '@/services/EmployeeStatusesService'

describe('EmployeeStatusList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render statuses in the table', async () => {
    render(<EmployeeStatusList />)

    await waitFor(() => {
      expect(screen.getAllByText('Active').length).toBeGreaterThanOrEqual(1)
    })
    expect(screen.getAllByText('Inactive').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('DeletedStatus')).toBeInTheDocument()
  })

  it('should open create dialog when Add Status is clicked', async () => {
    render(<EmployeeStatusList />)

    await waitFor(() => {
      expect(screen.getByText('Add Status')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Add Status'))

    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByText('Create Status')).toBeInTheDocument()
  })

  it('should open edit dialog when edit icon is clicked', async () => {
    render(<EmployeeStatusList />)

    await waitFor(() => {
      expect(screen.getAllByTestId('icon-pencil').length).toBeGreaterThan(0)
    })

    fireEvent.click(screen.getAllByTestId('icon-pencil')[0])

    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByText('Editing: Active')).toBeInTheDocument()
  })

  it('should close dialog on form success', async () => {
    render(<EmployeeStatusList />)

    await waitFor(() => {
      expect(screen.getAllByTestId('icon-pencil').length).toBeGreaterThan(0)
    })

    fireEvent.click(screen.getAllByTestId('icon-pencil')[0])
    expect(screen.getByTestId('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('form-success-btn'))

    await waitFor(() => {
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
    })
  })

  it('should open delete confirmation on delete icon click', async () => {
    render(<EmployeeStatusList />)

    await waitFor(() => {
      expect(screen.getAllByTestId('icon-trash').length).toBeGreaterThan(0)
    })

    fireEvent.click(screen.getAllByTestId('icon-trash')[0])

    await waitFor(() => {
      expect(screen.getByText('Delete Status')).toBeInTheDocument()
    })
  })

  it('should call restore API on restore click', async () => {
    render(<EmployeeStatusList />)

    await waitFor(() => {
      expect(screen.getByText('DeletedStatus')).toBeInTheDocument()
    })

    fireEvent.click(screen.getAllByTestId('icon-restore')[0])

    await waitFor(() => {
      expect(apiRestoreEmployeeStatus).toHaveBeenCalledWith('s3')
    })
  })

  it('should filter by search query', async () => {
    render(<EmployeeStatusList />)

    await waitFor(() => {
      expect(screen.getByTestId('debounce-input')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByTestId('debounce-input'), { target: { value: 'Active' } })
  })
})
