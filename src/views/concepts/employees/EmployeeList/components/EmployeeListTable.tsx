import { useMemo, useState, useEffect } from 'react'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Dropdown from '@/components/ui/Dropdown'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import DataTable from '@/components/shared/DataTable'
import useEmployeeList from '../hooks/useEmployeeList'
import { apiChangeEmployeeStatus, apiBulkChangeEmployeeStatus } from '@/services/EmployeesService'
import { apiGetEmployeeStatuses } from '@/services/EmployeeStatusesService'
import { Link, useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import Avatar from '@/components/ui/Avatar'
import { TbPencil, TbEye, TbChevronDown } from 'react-icons/tb'
import { Can } from '@casl/react'
import useTranslation from '@/utils/hooks/useTranslation'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Employee } from '../types'
import type { TableQueries } from '@/@types/common'

type StatusOption = { value: string; label: string; color?: string }

const ActionColumn = ({ onEdit, onViewDetail }: { onEdit: () => void; onViewDetail: () => void }) => {
    const { t } = useTranslation()

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
    const [changingStatusId, setChangingStatusId] = useState<string | null>(null)
    const [bulkStatusId, setBulkStatusId] = useState<string>('')
    const [bulkChanging, setBulkChanging] = useState(false)

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

    const handleBulkStatusChange = async () => {
        if (!bulkStatusId || selectedEmployee.length === 0) return
        setBulkChanging(true)
        try {
            await apiBulkChangeEmployeeStatus({
                employeeIds: selectedEmployee.map((e) => e.id),
                statusId: bulkStatusId,
            })
            setSelectAllEmployee([])
            setBulkStatusId('')
            mutate()
            toast.push(<Notification type="success">{t('employeeList.bulkStatusChanged', 'Status updated for {{count}} employees', { count: selectedEmployee.length })}</Notification>, {
                placement: 'top-center',
            })
        } catch {
            toast.push(<Notification type="danger">{t('employeeList.failedToChangeStatus', 'Failed to update status')}</Notification>, {
                placement: 'top-center',
            })
        }
        setBulkChanging(false)
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
                        <Link
                            className={`hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100`}
                            style={{ textAlign: 'left' }}
                            to={`/employees/${row.id}`}
                        >
                            {row.fullName}
                        </Link>
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
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onViewDetail={() => handleViewDetails(props.row.original)}
                    />
                ),
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
        <div>
            {selectedEmployee.length > 0 && (
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        {t('employeeList.selected', '{{count}} selected', { count: selectedEmployee.length })}
                    </span>
                    <div className="flex items-center gap-2">
                        <Select
                            options={statusOptions}
                            value={statusOptions.find((o) => o.value === bulkStatusId) || null}
                            onChange={(option) => setBulkStatusId(option?.value || '')}
                            placeholder={t('employeeList.changeStatusTo', 'Change status to...')}
                            isSearchable={false}
                            className="min-w-[200px]"
                        />
                        <Can I="update" a="Employee">
                            <Button
                                variant="solid"
                                size="sm"
                                disabled={!bulkStatusId || bulkChanging}
                                loading={bulkChanging}
                                onClick={handleBulkStatusChange}
                            >
                                {t('common.apply', 'Apply')}
                            </Button>
                        </Can>
                    </div>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => setSelectAllEmployee([])}
                    >
                        {t('common.cancel', 'Cancel')}
                    </Button>
                </div>
            )}
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
    )
}

export default EmployeeListTable
