import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import getInitials, { getAvatarColor } from '@/utils/getInitials'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useUserList from '../hooks/useUserList'
import { apiDeleteUser, apiRestoreUser } from '@/services/UsersService'
import { Link, useNavigate } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye, TbRestore, TbTrash } from 'react-icons/tb'
import { Can } from '@casl/react'
import useAuth from '@/auth/useAuth'
import useTranslation from '@/utils/hooks/useTranslation'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { User } from '../types'
import type { TableQueries } from '@/@types/common'

const roleColor: Record<string, string> = {
    admin: 'bg-purple-200 dark:bg-purple-200 text-gray-900 dark:text-gray-900',
    supervisor: 'bg-blue-200 dark:bg-blue-200 text-gray-900 dark:text-gray-900',
    monitor: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
}

const statusColor: Record<string, string> = {
    active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    inactive: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const NameColumn = ({ row }: { row: User }) => {
    const { t } = useTranslation()
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
            <div className="flex items-center gap-2 ml-2 rtl:mr-2">
                <Link
                    className={`hover:text-primary font-semibold text-gray-900 dark:text-gray-100 ${row.deletedAt ? 'line-through opacity-60' : ''}`}
                    to={`/users/${row.id}`}
                >
                    {row.displayName || row.email}
                </Link>
                {row.deletedAt && (
                    <Tag className="bg-red-100 text-red-600 border-red-200 text-xs shrink-0">
                        {t('common.deleted', 'Deleted')}
                    </Tag>
                )}
            </div>
        </div>
    )
}

const ActionColumn = ({ onEdit, onViewDetail, onDelete, onRestore, isDeleted, isSelf }: { onEdit: () => void; onViewDetail: () => void; onDelete: () => void; onRestore: () => void; isDeleted: boolean; isSelf?: boolean }) => {
    const { t } = useTranslation()

    if (isDeleted) {
        return (
            <Can I="update" a="User">
                <Tooltip title={t('common.restore', 'Restore')}>
                    <span
                        className="inline-flex items-center text-xl cursor-pointer select-none font-semibold text-emerald-600 hover:text-emerald-700"
                        role="button"
                        onClick={onRestore}
                    >
                        <TbRestore />
                    </span>
                </Tooltip>
            </Can>
        )
    }

    return (
        <div className="flex items-center gap-3">
            <Can I="update" a="User">
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
            {!isSelf && (
                <Can I="delete" a="User">
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
            )}
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

const UserListTable = () => {
    const navigate = useNavigate()
    const { user: currentUser } = useAuth()

    const { userList, userListTotal, tableData, isLoading, setTableData, setSelectAllUser, setSelectedUser, selectedUser, mutate } =
        useUserList()

    const [deleteUser, setDeleteUser] = useState<User | null>(null)

    const handleEdit = (user: User) => {
        navigate(`/users/${user.id}/edit`)
    }

    const handleViewDetails = (user: User) => {
        navigate(`/users/${user.id}`)
    }

    const handleDelete = (user: User) => {
        if (user.id === currentUser?.userId) {
            toast.push(<Notification type="danger">{t('userList.cannotDeleteSelf', 'You cannot delete your own account.')}</Notification>, {
                placement: 'top-center',
            })
            return
        }
        setDeleteUser(user)
    }

    const confirmDelete = async () => {
        if (!deleteUser) return
        try {
            await apiDeleteUser(deleteUser.id)
            mutate()
            toast.push(<Notification type="success">{t('userList.deleted', 'User deleted!')}</Notification>, {
                placement: 'top-center',
            })
        } catch (err: any) {
            const msg = err?.response?.data?.message || t('userList.failedToDelete', 'Failed to delete user')
            toast.push(<Notification type="danger">{msg}</Notification>, {
                placement: 'top-center',
            })
        }
        setDeleteUser(null)
    }

    const handleRestore = async (user: User) => {
        try {
            await apiRestoreUser(user.id)
            mutate()
            toast.push(<Notification type="success">{t('userList.userRestored', 'User restored!')}</Notification>, {
                placement: 'top-center',
            })
        } catch {
            toast.push(<Notification type="danger">{t('userList.failedToRestore', 'Failed to restore user')}</Notification>, {
                placement: 'top-center',
            })
        }
    }

    const { t } = useTranslation()

    const columns: ColumnDef<User>[] = useMemo(
        () => [
            {
                header: t('userList.name', 'Name'),
                accessorKey: 'displayName',
                cell: (props) => {
                    const row = props.row.original
                    return <NameColumn row={row} />
                },
            },
            {
                header: t('userList.email', 'Email'),
                accessorKey: 'email',
            },
            {
                header: t('userList.role', 'Role'),
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
                header: t('userList.status', 'Status'),
                accessorKey: 'isActive',
                cell: (props) => {
                    const row = props.row.original
                    const status = row.isActive ? 'active' : 'inactive'
                    return (
                        <Tag className={statusColor[status]}>
                            <span className="capitalize">{t('userDetails.' + status, status)}</span>
                        </Tag>
                    )
                },
            },
            {
                header: t('userList.created', 'Created'),
                accessorKey: 'createdAt',
                cell: (props) => {
                    return <span>{new Date(props.row.original.createdAt).toLocaleDateString()}</span>
                },
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
                            isSelf={row.id === currentUser?.userId}
                        />
                    )
                },
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
        <>
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
        <ConfirmDialog
            isOpen={deleteUser !== null}
            type="danger"
            title={t('userList.confirmDeleteTitle', 'Delete User')}
            confirmText={t('common.delete', 'Delete')}
            cancelText={t('common.cancel', 'Cancel')}
            confirmButtonProps={{ className: 'bg-red-500 hover:bg-red-600' }}
            onCancel={() => setDeleteUser(null)}
            onConfirm={confirmDelete}
        >
            <p>{t('userList.confirmDeleteMessage', 'Are you sure you want to delete user "{{name}}"?', { name: deleteUser?.displayName || deleteUser?.email || '' })}</p>
        </ConfirmDialog>
        </>
    )
}

export default UserListTable
