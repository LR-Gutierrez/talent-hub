import { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import getInitials, { getAvatarColor } from '@/utils/getInitials'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import useUserList from '../hooks/useUserList'
import { Link, useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import { Can } from '@casl/react'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { User } from '../types'
import type { TableQueries } from '@/@types/common'

const roleColor: Record<string, string> = {
    admin: 'bg-purple-200 dark:bg-purple-200 text-gray-900 dark:text-gray-900',
    recruiter: 'bg-blue-200 dark:bg-blue-200 text-gray-900 dark:text-gray-900',
    candidate: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
}

const statusColor: Record<string, string> = {
    active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    inactive: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const NameColumn = ({ row }: { row: User }) => {
    return (
        <div className="flex items-center">
            <Avatar
                size={40}
                shape="circle"
                className={!row.photoUrl ? getAvatarColor(row.displayName || row.email) : ''}
                src={row.photoUrl || undefined}
            >
                {!row.photoUrl ? getInitials(row.displayName || row.email) : undefined}
            </Avatar>
            <Link
                className={`hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100`}
                to={`/users/${row.id}`}
            >
                {row.displayName || row.email}
            </Link>
        </div>
    )
}

const ActionColumn = ({ onEdit, onViewDetail }: { onEdit: () => void; onViewDetail: () => void }) => {
    return (
        <div className="flex items-center gap-3">
            <Can I="update" a="User">
                <Tooltip title="Edit">
                    <div
                        className={`text-xl cursor-pointer select-none font-semibold`}
                        role="button"
                        onClick={onEdit}
                    >
                        <TbPencil />
                    </div>
                </Tooltip>
            </Can>
            <Tooltip title="View">
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

const UserListTable = () => {
    const navigate = useNavigate()

    const { userList, userListTotal, tableData, isLoading, setTableData, setSelectAllUser, setSelectedUser, selectedUser } =
        useUserList()

    const handleEdit = (user: User) => {
        navigate(`/users/${user.id}/edit`)
    }

    const handleViewDetails = (user: User) => {
        navigate(`/users/${user.id}`)
    }

    const columns: ColumnDef<User>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'displayName',
                cell: (props) => {
                    const row = props.row.original
                    return <NameColumn row={row} />
                },
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'Role',
                accessorKey: 'role',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <Tag className={roleColor[row.role]}>
                            <span className="capitalize">{row.role}</span>
                        </Tag>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'isActive',
                cell: (props) => {
                    const row = props.row.original
                    const status = row.isActive ? 'active' : 'inactive'
                    return (
                        <Tag className={statusColor[status]}>
                            <span className="capitalize">{status}</span>
                        </Tag>
                    )
                },
            },
            {
                header: 'Created',
                accessorKey: 'createdAt',
                cell: (props) => {
                    return <span>{new Date(props.row.original.createdAt).toLocaleDateString()}</span>
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
        if (selectedUser.length > 0) {
            setSelectAllUser([])
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

    const handleRowSelect = (checked: boolean, row: User) => {
        setSelectedUser(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<User>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllUser(originalRows)
        } else {
            setSelectAllUser([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={userList}
            noData={!isLoading && userList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: userListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) => selectedUser.some((selected) => selected.id === row.id)}
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default UserListTable
