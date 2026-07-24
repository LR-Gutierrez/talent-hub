import { useMemo } from 'react'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import useEmployeeList from '../hooks/useEmployeeList'
import { Link, useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import Avatar from '@/components/ui/Avatar'
import { TbPencil, TbEye } from 'react-icons/tb'
import { Can } from '@casl/react'
import useTranslation from '@/utils/hooks/useTranslation'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Employee } from '../types'
import type { TableQueries } from '@/@types/common'

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

    const { employeeList, employeeListTotal, tableData, isLoading, setTableData, setSelectAllEmployee, setSelectedEmployee, selectedEmployee } =
        useEmployeeList()

    const handleEdit = (employee: Employee) => {
        navigate(`/employees/${employee.id}/edit`)
    }

    const handleViewDetails = (employee: Employee) => {
        navigate(`/employees/${employee.id}`)
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
                            to={`/employees/${row.id}`}
                        >
                            {row.fullName}
                        </Link>
                    )
                },
            },
            {
                header: t('employeeList.email', 'Email'),
                accessorKey: 'email',
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
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <Tag className={row.status?.color ? '' : ''}
                            style={row.status?.color ? { backgroundColor: row.status.color + '30', color: row.status.color, borderColor: row.status.color } : {}}
                        >
                            <span className="capitalize">{row.status?.name || '-'}</span>
                        </Tag>
                    )
                },
            },
            {
                header: t('employeeList.supervisor', 'Supervisor'),
                accessorKey: 'supervisor',
                cell: (props) => {
                    const row = props.row.original
                    return <span>{row.supervisor?.fullName || '-'}</span>
                },
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
        [],
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
    )
}

export default EmployeeListTable
