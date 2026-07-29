import { useMemo, useState, useEffect } from 'react'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import Dropdown from '@/components/ui/Dropdown'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useEmployeeList from '../hooks/useEmployeeList'
import { apiChangeEmployeeStatus, apiDeleteEmployee, apiRestoreEmployee } from '@/services/EmployeesService'
import { apiGetEmployeeStatuses } from '@/services/EmployeeStatusesService'
import { Link, useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import Avatar from '@/components/ui/Avatar'
import { TbPencil, TbEye, TbChevronDown, TbRestore, TbTrash } from 'react-icons/tb'
import { Can } from '@casl/react'
import useTranslation from '@/utils/hooks/useTranslation'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Employee } from '../types'
import type { TableQueries } from '@/@types/common'

type StatusOption = { value: string; label: string; color?: string }

const ActionColumn = ({ onEdit, onViewDetail, onDelete, onRestore, isDeleted }: { onEdit: () => void; onViewDetail: () => void; onDelete: () => void; onRestore: () => void; isDeleted: boolean }) => {
    const { t } = useTranslation()

    if (isDeleted) {
        return (
            <div className="flex items-center gap-3">
                <Can I="update" a="Employee">
                    <Tooltip title={t('common.restore', 'Restore')}>
                        <div
                            className="text-xl cursor-pointer select-none font-semibold text-emerald-600 hover:text-emerald-700"
                            role="button"
                            onClick={onRestore}
                        >
                            <TbRestore />
                        </div>
                    </Tooltip>
                </Can>
                <Tooltip title={t('common.view', 'View')}>
                    <div
                        className="text-xl cursor-pointer select-none font-semibold"
                        role="button"
                        onClick={onViewDetail}
                    >
                        <TbEye />
                    </div>
                </Tooltip>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-3">
            <Can I="update" a="Employee">
                <Tooltip title={t('common.edit', 'Edit')}>
                    <div
                        className={`text-xl cursor-pointer select-none font-semibold`}
                        role="button"
                        onClick={onEdit}
                    >
                        <TbPencil />
                    </div>
                </Tooltip>
            </Can>
            <Can I="delete" a="Employee">
                <Tooltip title={t('common.delete', 'Delete')}>
                    <div
                        className="text-xl cursor-pointer select-none font-semibold text-red-500"
                        role="button"
                        onClick={onDelete}
                    >
                        <TbTrash />
                    </div>
                </Tooltip>
            </Can>
            <Tooltip title={t('common.view', 'View')}>
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onViewDetail}
                >
                    <TbEye />
                </div>
            </Tooltip>
        </div>
    )
}

const EmployeeListTable = () => {
    const navigate = useNavigate()

    const { employeeList, employeeListTotal, tableData, isLoading, setTableData, setSelectAllEmployee, setSelectedEmployee, selectedEmployee, mutate } =
        useEmployeeList()

    const [statusOptions, setStatusOptions] = useState<StatusOption[]>([])
    const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null)
    const [changingStatusId, setChangingStatusId] = useState<string | null>(null)

    useEffect(() => {
        apiGetEmployeeStatuses<{ list: { id: string; name: string; color: string; isActive: boolean }[] }>().then((res) => {
            setStatusOptions(
                res.list.filter((s) => s.isActive).map((s) => ({ value: s.id, label: s.name, color: s.color })),
            )
        })
    }, [])

    const handleEdit = (employee: Employee) => {
        navigate(`/employees/${employee.id}/edit`)
    }

    const handleViewDetails = (employee: Employee) => {
        navigate(`/employees/${employee.id}`)
    }

    const handleDelete = (employee: Employee) => {
        setDeleteEmployee(employee)
    }

    const confirmDelete = async () => {
        if (!deleteEmployee) return
        try {
            await apiDeleteEmployee(deleteEmployee.id)
            mutate()
            toast.push(<Notification type="success">{t('employeeList.deleted', 'Employee deleted!')}</Notification>, {
                placement: 'top-center',
            })
        } catch (err: any) {
            const msg = err?.response?.data?.message || t('employeeList.failedToDelete', 'Failed to delete employee')
            toast.push(<Notification type="danger">{msg}</Notification>, {
                placement: 'top-center',
            })
        }
        setDeleteEmployee(null)
    }

    const handleRestore = async (employee: Employee) => {
        try {
            await apiRestoreEmployee(employee.id)
            mutate()
            toast.push(<Notification type="success">{t('employeeList.employeeRestored', 'Employee restored!')}</Notification>, {
                placement: 'top-center',
            })
        } catch {
            toast.push(<Notification type="danger">{t('employeeList.failedToRestore', 'Failed to restore employee')}</Notification>, {
                placement: 'top-center',
            })
        }
    }

    const handleStatusChange = async (employeeId: string, statusId: string) => {
        setChangingStatusId(employeeId)
        try {
            await apiChangeEmployeeStatus(employeeId, { statusId })
            mutate()
            toast.push(<Notification type="success">{t('employeeList.statusChanged', 'Status updated!')}</Notification>, {
                placement: 'top-center',
            })
        } catch {
            toast.push(<Notification type="danger">{t('employeeList.failedToChangeStatus', 'Failed to update status')}</Notification>, {
                placement: 'top-center',
            })
        }
        setChangingStatusId(null)
    }

    const { t } = useTranslation()

    const columns: ColumnDef<Employee>[] = useMemo(
        () => [
            {
                header: '',
                id: 'avatar',
                size: 60,
                cell: (props) => (
                    <Avatar size={32} shape="circle" src={props.row.original.photoUrl || ''}>
                        {!props.row.original.photoUrl && props.row.original.fullName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                ),
            },
            {
                header: t('employeeList.fullName', 'Full Name'),
                accessorKey: 'fullName',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center gap-2 ml-2 rtl:mr-2">
                            <Link
                                className={`hover:text-primary font-semibold text-gray-900 dark:text-gray-100 ${row.deletedAt ? 'line-through opacity-60' : ''}`}
                                style={{ textAlign: 'left' }}
                                to={`/employees/${row.id}`}
                            >
                                {row.fullName}
                            </Link>
                            {row.deletedAt && (
                                <Tag className="bg-red-100 text-red-600 border-red-200 text-xs shrink-0">
                                    {t('common.deleted', 'Deleted')}
                                </Tag>
                            )}
                        </div>
                    )
                },
            },
            {
                header: t('employeeList.location', 'Location'),
                accessorKey: 'address',
            },
            {
                header: t('employeeList.department', 'Department'),
                accessorKey: 'department',
                cell: (props) => {
                    const row = props.row.original
                    return <span>{row.department?.name || '-'}</span>
                },
            },
            {
                header: t('employeeList.position', 'Position'),
                accessorKey: 'position',
            },
            {
                header: t('employeeList.status', 'Status'),
                accessorKey: 'status',
                size: 70,
                cell: (props) => {
                    const row = props.row.original
                    const currentOption = statusOptions.find((o) => o.value === row.statusId)
                    return (
                        <Dropdown
                            renderTitle={
                                <div
                                    className="inline-flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                    role="button"
                                >
                                    {currentOption && (
                                        <Tag
                                            style={currentOption.color ? { backgroundColor: currentOption.color + '30', color: currentOption.color, borderColor: currentOption.color } : {}}
                                        >
                                            <span className="capitalize">{currentOption.label}</span>
                                        </Tag>
                                    )}
                                    <TbChevronDown />
                                </div>
                            }
                        >
                            {statusOptions
                                .filter((option) => option.value !== row.statusId)
                                .map((option) => (
                                    <Dropdown.Item
                                        key={option.value}
                                        eventKey={option.value}
                                        onClick={() => handleStatusChange(row.id, option.value)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {option.color && (
                                                <div
                                                    className="w-3 h-3 rounded-full shrink-0"
                                                    style={{ backgroundColor: option.color }}
                                                />
                                            )}
                                            <span>{option.label}</span>
                                        </div>
                                    </Dropdown.Item>
                                ))}
                        </Dropdown>
                    )
                },
            },
            {
                header: t('employeeList.phoneExtension', 'Phone Extension'),
                accessorKey: 'phoneExtension',
            },
            {
                header: '',
                id: 'action',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <ActionColumn
                            onEdit={() => handleEdit(row)}
                            onViewDetail={() => handleViewDetails(row)}
                            onDelete={() => handleDelete(row)}
                            onRestore={() => handleRestore(row)}
                            isDeleted={Boolean(row.deletedAt)}
                        />
                    )
                },
            },
        ],
        [statusOptions, changingStatusId],
    )

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        if (selectedEmployee.length > 0) {
            setSelectAllEmployee([])
        }
    }

    const handlePaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        handleSetTableData(newTableData)
    }

    const handleSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        handleSetTableData(newTableData)
    }

    const handleSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        handleSetTableData(newTableData)
    }

    const handleRowSelect = (checked: boolean, row: Employee) => {
        setSelectedEmployee(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Employee>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllEmployee(originalRows)
        } else {
            setSelectAllEmployee([])
        }
    }

    return (
        <>
            <div>
                <DataTable
                    selectable
                    columns={columns}
                    data={employeeList}
                    noData={!isLoading && employeeList.length === 0}
                    skeletonAvatarColumns={[0]}
                    skeletonAvatarProps={{ width: 28, height: 28 }}
                    loading={isLoading}
                    pagingData={{
                        total: employeeListTotal,
                        pageIndex: tableData.pageIndex as number,
                        pageSize: tableData.pageSize as number,
                    }}
                    checkboxChecked={(row) => selectedEmployee.some((selected) => selected.id === row.id)}
                    onPaginationChange={handlePaginationChange}
                    onSelectChange={handleSelectChange}
                    onSort={handleSort}
                    onCheckBoxChange={handleRowSelect}
                    onIndeterminateCheckBoxChange={handleAllRowSelect}
                />
            </div>
            <ConfirmDialog
                isOpen={deleteEmployee !== null}
                type="danger"
                title={t('employeeList.confirmDeleteTitle', 'Delete Employee')}
                confirmText={t('common.delete', 'Delete')}
                cancelText={t('common.cancel', 'Cancel')}
                confirmButtonProps={{ className: 'bg-red-500 hover:bg-red-600' }}
                onCancel={() => setDeleteEmployee(null)}
                onConfirm={confirmDelete}
            >
                <p>{t('employeeList.confirmDeleteMessage', 'Are you sure you want to delete employee "{{name}}"?', { name: deleteEmployee?.fullName || '' })}</p>
            </ConfirmDialog>
        </>
    )
}

export default EmployeeListTable
