import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockEmployees, mockStatuses, mockMutate, mockNavigate } = vi.hoisted(() => ({
  mockEmployees: [
    { id: 'emp-1', fullName: 'Alice Johnson', email: 'alice@test.com', statusId: 'status-1', department: { id: 'dept-1', name: 'Engineering' }, position: 'Developer', address: '123 Main St', phoneExtension: '101', photoUrl: null, deletedAt: null },
    { id: 'emp-2', fullName: 'Bob Smith', email: 'bob@test.com', statusId: 'status-2', department: null, position: 'Designer', address: null, phoneExtension: null, photoUrl: null, deletedAt: null },
  ],
  mockStatuses: [
    { id: 'status-1', name: 'Active', color: '#00ff00', isActive: true },
    { id: 'status-2', name: 'Inactive', color: '#ff0000', isActive: true },
  ],
  mockMutate: vi.fn(),
  mockNavigate: vi.fn(),
}))

vi.mock('../hooks/useEmployeeList', () => ({
  default: () => ({
    employeeList: mockEmployees,
    employeeListTotal: 2,
    isLoading: false,
    tableData: { pageIndex: 1, pageSize: 10, sort: { order: '', key: '' }, query: '', total: 2 },
    mutate: mockMutate,
    setTableData: vi.fn(),
    setSelectAllEmployee: vi.fn(),
    setSelectedEmployee: vi.fn(),
    selectedEmployee: [],
  }),
}))

vi.mock('@/services/EmployeesService', () => ({
  apiChangeEmployeeStatus: vi.fn(),
  apiDeleteEmployee: vi.fn(),
  apiRestoreEmployee: vi.fn(),
}))

vi.mock('@/services/EmployeeStatusesService', () => ({
  apiGetEmployeeStatuses: vi.fn().mockResolvedValue({ list: mockStatuses }),
}))

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

vi.mock('@/utils/hooks/useTranslation', () => ({
  default: () => ({ t: (key: string, fallback: string) => fallback }),
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

vi.mock('@/components/ui/Tag', () => ({
  default: ({ children, style, className }: any) => (
    <span style={style} className={className}>{children}</span>
  ),
}))

vi.mock('@/components/ui/Tooltip', () => ({
  default: ({ children, title }: any) => <span title={title}>{children}</span>,
}))

vi.mock('@/components/ui/Dropdown', () => {
  const Item = ({ children, eventKey, onClick }: any) => (
    <div data-testid="dropdown-item" onClick={onClick}>{children}</div>
  )
  const DropdownMock = ({ children, renderTitle }: any) => (
    <div data-testid="dropdown">
      {renderTitle}
      <div data-testid="dropdown-items">{children}</div>
    </div>
  )
  DropdownMock.Item = Item
  return { default: DropdownMock }
})

vi.mock('@/components/ui/Avatar', () => ({
  default: ({ children, src, size, shape }: any) => (
    <div data-testid="avatar">{children}</div>
  ),
}))

vi.mock('@/components/ui/Notification', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('@/components/ui/toast', () => ({
  default: { push: vi.fn() },
}))

vi.mock('@casl/react', () => ({
  Can: ({ children }: any) => (typeof children === 'function' ? children({ allowed: true }) : <>{children}</>),
}))

import EmployeeListTable from '../components/EmployeeListTable'
import { apiDeleteEmployee } from '@/services/EmployeesService'

describe('EmployeeListTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render employees in the table', async () => {
    render(<EmployeeListTable />)

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    })
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
  })

  it('should display department name', async () => {
    render(<EmployeeListTable />)

    await waitFor(() => {
      expect(screen.getByText('Engineering')).toBeInTheDocument()
    })
  })

  it('should show dash for missing department', async () => {
    render(<EmployeeListTable />)

    await waitFor(() => {
      expect(screen.getAllByText('-').length).toBeGreaterThan(0)
    })
  })

  it('should navigate to edit on edit click', async () => {
    render(<EmployeeListTable />)

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    })

    fireEvent.click(screen.getAllByTitle('Edit')[0].querySelector('div[role="button"]')!)
    expect(mockNavigate).toHaveBeenCalledWith('/employees/emp-1/edit')
  })

  it('should navigate to details on view click', async () => {
    render(<EmployeeListTable />)

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    })

    fireEvent.click(screen.getAllByTitle('View')[0].querySelector('div[role="button"]')!)
    expect(mockNavigate).toHaveBeenCalledWith('/employees/emp-1')
  })

  it('should call delete API when confirmed', async () => {
    render(<EmployeeListTable />)

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    })

    fireEvent.click(screen.getAllByTitle('Delete')[0].querySelector('div[role="button"]')!)

    await waitFor(() => {
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('confirm-delete'))

    await waitFor(() => {
      expect(apiDeleteEmployee).toHaveBeenCalledWith('emp-1')
    })
    expect(mockMutate).toHaveBeenCalled()
  })
})
