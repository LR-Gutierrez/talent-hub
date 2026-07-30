import { useCallback, useEffect, useMemo, useState } from 'react'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Button from '@/components/ui/Button'
import DataTable from '@/components/shared/DataTable'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Dialog from '@/components/ui/Dialog'
import { apiGetRolesList, apiDeleteRole } from '@/services/RolesService'
import { TbPencil, TbTrash, TbPlus, TbShield, TbShieldCheck, TbDots } from 'react-icons/tb'
import { Can } from '@casl/react'
import useTranslation from '@/utils/hooks/useTranslation'
import { useSessionUser } from '@/store/authStore'
import RoleForm from './RoleForm'
import type { Role } from './types'
import type { ColumnDef } from '@/components/shared/DataTable'

const actionLabels: Record<string, string> = {
    create: 'C',
    read: 'R',
    update: 'U',
    delete: 'D',
}

const actionColors: Record<string, string> = {
    create: 'bg-emerald-500',
    read: 'bg-blue-500',
    update: 'bg-amber-500',
    delete: 'bg-red-500',
}

const groupColors: Record<string, string> = {
    employees: 'bg-indigo-500',
    'employee-statuses': 'bg-violet-500',
    departments: 'bg-cyan-500',
    users: 'bg-pink-500',
    'company-settings': 'bg-orange-500',
    roles: 'bg-rose-500',
}

const groupLabels: Record<string, string> = {
    employees: 'Emp',
    'employee-statuses': 'Sts',
    departments: 'Dep',
    users: 'Usr',
    'company-settings': 'Cfg',
    roles: 'Rol',
}

const PermissionMiniTag = ({ name }: { name: string }) => {
    const [group, action] = name.split(':')
    return (
        <Tooltip title={name}>
            <span
                className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold text-white ${actionColors[action] || 'bg-gray-500'} ${groupColors[group] || 'bg-gray-500'}`}
                style={{ background: `linear-gradient(135deg, ${actionColors[action]?.replace('bg-', '').replace('-', '') || '#6b7280'} 50%, ${groupColors[group]?.replace('bg-', '').replace('-', '') || '#6b7280'} 50%)` }}
            >
                {/* Fallback to simpler display */}
            </span>
        </Tooltip>
    )
}

const RoleList = () => {
    const { t } = useTranslation()
    const [roles, setRoles] = useState<Role[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<Role | null>(null)
    const [deleteRole, setDeleteRole] = useState<Role | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const loadRoles = useCallback(() => {
        setIsLoading(true)
        apiGetRolesList<{ list: Role[] }>()
            .then((res) => setRoles(res.list))
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        loadRoles()
    }, [loadRoles])

    const handleEdit = (role: Role) => {
        setEditingRole(role)
        setDialogOpen(true)
    }

    const handleCreate = () => {
        setEditingRole(null)
        setDialogOpen(true)
    }

    const handleDelete = (role: Role) => {
        setDeleteRole(role)
    }

    const confirmDelete = async () => {
        if (!deleteRole) return
        setIsDeleting(true)
        try {
            await apiDeleteRole(deleteRole.id)
            toast.push(
                <Notification type="success">
                    {t('roles.deleted', 'Role deleted!')}
                </Notification>,
                { placement: 'top-center' },
            )
            loadRoles()
        } catch (err: any) {
            const msg = err?.response?.data?.message || t('roles.failedToDelete', 'Failed to delete role')
            toast.push(
                <Notification type="danger">{msg}</Notification>,
                { placement: 'top-center' },
            )
        }
        setIsDeleting(false)
        setDeleteRole(null)
    }

    const refreshUser = useSessionUser((state) => state.refreshUser)

    const handleSuccess = () => {
        setDialogOpen(false)
        setEditingRole(null)
        loadRoles()
        refreshUser()
    }

    const columns: ColumnDef<Role>[] = useMemo(
        () => [
            {
                header: t('roles.name', 'Name'),
                accessorKey: 'name',
                cell: (props) => {
                    const role = props.row.original
                    return (
                        <div className="flex items-center gap-3">
                            <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${role.isSystem ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                                {role.isSystem ? <TbShieldCheck className="text-lg" /> : <TbShield className="text-lg" />}
                            </div>
                            <div>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    {role.name}
                                </span>
                                {role.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1 max-w-[200px]">
                                        {role.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    )
                },
            },
            {
                header: t('roles.permissions', 'Permissions'),
                accessorKey: 'permissions',
                cell: (props) => {
                    const perms = props.row.original.permissions

                    const grouped = perms.reduce<Record<string, string[]>>((acc, p) => {
                        const [group, action] = p.name.split(':')
                        if (!acc[group]) acc[group] = []
                        acc[group].push(action)
                        return acc
                    }, {})

                    const entries = Object.entries(grouped)
                    const visibleMax = 3
                    const visible = entries.slice(0, visibleMax)
                    const rest = entries.slice(visibleMax)
                    const hasMore = rest.length > 0

                    return (
                        <div className="flex flex-wrap gap-1.5">
                            {visible.map(([group, actions]) => (
                                <Tooltip
                                    key={group}
                                    title={`${t(`roles.group.${group}`, groupLabels[group] || group)}: ${actions.map((a) => actionLabels[a] || a).join(', ')}`}
                                >
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider text-white ${groupColors[group] || 'bg-gray-500'}`}>
                                        {t(`roles.group.${group}`, groupLabels[group] || group)}
                                        <span className="opacity-80">({actions.length})</span>
                                    </span>
                                </Tooltip>
                            ))}
                            {hasMore && (
                                <Tooltip
                                    title={
                                        <div className="flex flex-col gap-1">
                                            {rest.map(([group, actions]) => (
                                                <span key={group}>
                                                    <strong>{t(`roles.group.${group}`, groupLabels[group] || group)}:</strong>{' '}
                                                    {actions.map((a) => actionLabels[a] || a).join(', ')}
                                                </span>
                                            ))}
                                        </div>
                                    }
                                >
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-help">
                                        +{rest.reduce((sum, [, a]) => sum + a.length, 0)}
                                    </span>
                                </Tooltip>
                            )}
                            {perms.length === 0 && (
                                <span className="text-xs text-gray-400 italic">
                                    {t('roles.noPermissions', 'No permissions')}
                                </span>
                            )}
                        </div>
                    )
                },
            },
            {
                header: t('roles.type', 'Type'),
                id: 'type',
                cell: (props) => {
                    const isSystem = props.row.original.isSystem
                    return (
                        <Tag
                            className={
                                isSystem
                                    ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                                    : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                            }
                        >
                            <div className="flex items-center gap-1.5">
                                {isSystem ? <TbShieldCheck className="text-xs" /> : <TbShield className="text-xs" />}
                                <span className="text-xs font-medium">
                                    {isSystem ? t('roles.system', 'System') : t('roles.custom', 'Custom')}
                                </span>
                            </div>
                        </Tag>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => {
                    const role = props.row.original
                    return (
                        <div className="flex items-center gap-2">
                            <Can I="update" a="Role">
                                <Tooltip title={t('common.edit', 'Edit')}>
                                    <Button
                                        size="sm"
                                        variant="plain"
                                        icon={<TbPencil className="text-lg" />}
                                        onClick={() => handleEdit(role)}
                                    />
                                </Tooltip>
                            </Can>
                            {!role.isSystem && (
                                <Can I="delete" a="Role">
                                    <Tooltip title={t('common.delete', 'Delete')}>
                                        <Button
                                            size="sm"
                                            variant="plain"
                                            icon={<TbTrash className="text-lg text-red-500" />}
                                            onClick={() => handleDelete(role)}
                                        />
                                    </Tooltip>
                                </Can>
                            )}
                        </div>
                    )
                },
            },
        ],
        [t],
    )

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h3 className="text-gray-900 dark:text-gray-100">
                                {t('roles.management', 'Role Management')}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {t('roles.managementDesc', 'Define roles and configure their permissions across the system')}
                            </p>
                        </div>
                        <Can I="create" a="Role">
                            <Button variant="solid" icon={<TbPlus />} onClick={handleCreate}>
                                {t('roles.addNew', 'Add Role')}
                            </Button>
                        </Can>
                    </div>
                    <DataTable
                        columns={columns}
                        data={roles}
                        noData={!isLoading && roles.length === 0}
                        loading={isLoading}
                    />
                </div>
            </AdaptiveCard>
            <Dialog
                isOpen={dialogOpen}
                onClose={() => { setDialogOpen(false); setEditingRole(null) }}
                onRequestClose={() => { setDialogOpen(false); setEditingRole(null) }}
                width={800}
                contentClassName="overflow-y-auto max-h-[90vh]"
            >
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h5 className="text-gray-900 dark:text-gray-100">
                        {editingRole ? (
                            <div className="flex items-center gap-2">
                                <span>{t('roles.editRole', 'Edit Role')}</span>
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                    — {editingRole.name}
                                </span>
                            </div>
                        ) : (
                            t('roles.createRole', 'Create Role')
                        )}
                    </h5>
                </div>
                <div className="mt-4">
                    <RoleForm role={editingRole} onSuccess={handleSuccess} />
                </div>
            </Dialog>
            <Dialog
                isOpen={deleteRole !== null}
                closable={!isDeleting}
                onClose={() => { if (!isDeleting) setDeleteRole(null) }}
                onRequestClose={() => { if (!isDeleting) setDeleteRole(null) }}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 shrink-0">
                            <TbTrash className="text-xl" />
                        </div>
                        <div>
                            <h5 className="text-gray-900 dark:text-gray-100">
                                {t('roles.confirmDeleteTitle', 'Delete Role')}
                            </h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                {t('roles.confirmDeleteMessage', 'Are you sure you want to delete role "{{name}}"?', {
                                    name: deleteRole?.name || '',
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button size="sm" disabled={isDeleting} onClick={() => setDeleteRole(null)}>
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button
                            size="sm"
                            variant="solid"
                            className="bg-red-500 hover:bg-red-600"
                            loading={isDeleting}
                            onClick={confirmDelete}
                        >
                            {t('common.delete', 'Delete')}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </Container>
    )
}

export default RoleList
