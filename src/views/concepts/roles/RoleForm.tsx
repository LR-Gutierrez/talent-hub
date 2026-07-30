import { useState, useEffect, useMemo } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Tooltip from '@/components/ui/Tooltip'
import { FormItem, Form } from '@/components/ui/Form'
import { apiCreateRole, apiUpdateRole, apiGetPermissionsList } from '@/services/RolesService'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Can } from '@casl/react'
import { TbChecks, TbEye, TbEyeOff, TbLock } from 'react-icons/tb'
import useTranslation from '@/utils/hooks/useTranslation'
import type { Permission } from './types'

type Props = {
    role?: {
        id: string
        name: string
        description: string
        isSystem: boolean
        permissions: Permission[]
    } | null
    onSuccess: () => void
}

type FormSchema = {
    name: string
    description: string
    permissionIds: string[]
}

const groupLabels: Record<string, string> = {
    employees: 'Employees',
    'employee-statuses': 'Employee Statuses',
    departments: 'Departments',
    users: 'Users',
    'company-settings': 'Company Settings',
    catalogs: 'Catalogs',
    roles: 'Roles',
}

const groupIcons: Record<string, string> = {
    employees: '👤',
    'employee-statuses': '🏷️',
    departments: '🏢',
    users: '👥',
    'company-settings': '⚙️',
    catalogs: '📋',
    roles: '🛡️',
}

const actionLabels: Record<string, string> = {
    create: 'Create',
    read: 'Read',
    update: 'Update',
    delete: 'Delete',
}

const RoleForm = ({ role, onSuccess }: Props) => {
    const { t } = useTranslation()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [permissions, setPermissions] = useState<Permission[]>([])
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set(Object.keys(groupLabels)))

    useEffect(() => {
        apiGetPermissionsList<{ list: Permission[] }>().then((res) => {
            setPermissions(res.list)
        })
    }, [])

    const validationSchema = z.object({
        name: z.string().min(1, { message: 'Name is required' }),
        description: z.string().optional().or(z.literal('')),
        permissionIds: z.array(z.string()).optional(),
    })

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        watch,
    } = useForm<FormSchema>({
        defaultValues: {
            name: role?.name || '',
            description: role?.description || '',
            permissionIds: role?.permissions?.map((p) => p.id) || [],
        },
        resolver: zodResolver(validationSchema) as any,
    })

    const selectedIds = watch('permissionIds')

    const grouped = useMemo(() => {
        const groups: Record<string, Permission[]> = {}
        for (const p of permissions) {
            if (!groups[p.group]) groups[p.group] = []
            groups[p.group].push(p)
        }
        return groups
    }, [permissions])

    const selectedCount = useMemo(() => {
        const ids = selectedIds || []
        return ids.length
    }, [selectedIds])

    const handleToggleGroup = (groupPerms: Permission[], checked: boolean) => {
        const groupIds = groupPerms.map((p) => p.id)
        const current = new Set(selectedIds || [])
        for (const id of groupIds) {
            if (checked) current.add(id)
            else current.delete(id)
        }
        setValue('permissionIds', Array.from(current), { shouldValidate: true })
    }

    const handleTogglePermission = (id: string, checked: boolean) => {
        const current = new Set(selectedIds || [])
        if (checked) current.add(id)
        else current.delete(id)
        setValue('permissionIds', Array.from(current), { shouldValidate: true })
    }

    const groupCheckedState = (groupPerms: Permission[]): boolean | 'indeterminate' => {
        const selected = selectedIds || []
        const allChecked = groupPerms.every((p) => selected.includes(p.id))
        const someChecked = groupPerms.some((p) => selected.includes(p.id))
        if (allChecked) return true
        if (someChecked) return 'indeterminate'
        return false
    }

    const onSubmit = async (values: FormSchema) => {
        setIsSubmitting(true)
        try {
            if (role) {
                await apiUpdateRole(role.id, values)
            } else {
                await apiCreateRole(values)
            }
            onSuccess()
        } catch {
            // error handled by interceptor
        }
        setIsSubmitting(false)
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem
                        label={t('roles.name', 'Name')}
                        invalid={Boolean(errors.name)}
                        errorMessage={errors.name?.message}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <div className="relative">
                                    <Input
                                        placeholder={t('roles.name', 'Role name')}
                                        {...field}
                                        disabled={role?.isSystem}
                                        className="pr-8"
                                    />
                                    {role?.isSystem && (
                                        <Tooltip title={t('roles.systemRoleReadonly', 'System role name cannot be changed')}>
                                            <TbLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        </Tooltip>
                                    )}
                                </div>
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={t('roles.description', 'Description')}
                        invalid={Boolean(errors.description)}
                        errorMessage={errors.description?.message}
                    >
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder={t('roles.description', 'Brief description of this role')}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {t('roles.permissions', 'Permissions')}
                            </span>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                {selectedCount} / {permissions.length}
                            </span>
                        </div>
                        <Button
                            size="sm"
                            variant="plain"
                            type="button"
                            icon={expandedGroups.size === Object.keys(grouped).length ? <TbEyeOff /> : <TbEye />}
                            onClick={() => {
                                if (expandedGroups.size === Object.keys(grouped).length) {
                                    setExpandedGroups(new Set())
                                } else {
                                    setExpandedGroups(new Set(Object.keys(grouped)))
                                }
                            }}
                        >
                            {expandedGroups.size === Object.keys(grouped).length
                                ? t('roles.collapseAll', 'Collapse all')
                                : t('roles.expandAll', 'Expand all')}
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {Object.entries(grouped).map(([group, perms]) => {
                            const checkedState = groupCheckedState(perms)
                            const isFullyChecked = checkedState === true
                            const isPartiallyChecked = checkedState === 'indeterminate'
                            const groupSelectedCount = (selectedIds || []).filter((id) =>
                                perms.some((p) => p.id === id),
                            ).length
                            const isExpanded = expandedGroups.has(group)

                            return (
                                <div
                                    key={group}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                                >
                                    <div
                                        className={`flex items-center justify-between px-4 py-3 select-none transition-colors duration-150 ${
                                            isFullyChecked
                                                ? 'bg-primary/5 dark:bg-primary/10'
                                                : isPartiallyChecked
                                                  ? 'bg-amber-50 dark:bg-amber-500/5'
                                                  : 'bg-gray-50 dark:bg-gray-800/50'
                                        }`}
                                    >
                                        <div
                                            className="flex items-center gap-3 cursor-pointer"
                                            onClick={() => handleToggleGroup(perms, !isFullyChecked)}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150 ${
                                                    isFullyChecked
                                                        ? 'bg-primary border-primary text-white'
                                                        : isPartiallyChecked
                                                          ? 'border-amber-400 bg-amber-50 dark:bg-amber-500/10'
                                                          : 'border-gray-300 dark:border-gray-600'
                                                }`}
                                            >
                                                {isFullyChecked && (
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                                {isPartiallyChecked && (
                                                    <div className="w-2 h-0.5 bg-amber-500 rounded" />
                                                )}
                                            </div>
                                            <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                                {t(`roles.group.${group}`, groupLabels[group] || group)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                                groupSelectedCount === 0
                                                    ? 'text-gray-400 bg-gray-100 dark:bg-gray-700'
                                                    : groupSelectedCount === perms.length
                                                      ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10'
                                                      : 'text-amber-600 bg-amber-50 dark:bg-amber-500/10'
                                            }`}>
                                                {groupSelectedCount}/{perms.length}
                                            </span>
                                            <button
                                                type="button"
                                                className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    const next = new Set(expandedGroups)
                                                    if (isExpanded) next.delete(group)
                                                    else next.add(group)
                                                    setExpandedGroups(next)
                                                }}
                                            >
                                                <svg
                                                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                                        isExpanded ? 'rotate-0' : '-rotate-90'
                                                    }`}
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="px-4 py-2 space-y-1 bg-white dark:bg-gray-800">
                                            {perms.map((perm) => {
                                                const action = perm.name.split(':')[1] as string
                                                const isSelected = (selectedIds || []).includes(perm.id)
                                                return (
                                                    <div
                                                        key={perm.id}
                                                        className={`flex items-center gap-3 px-2 py-1.5 rounded-md cursor-pointer select-none transition-all duration-150 ${
                                                            isSelected
                                                                ? 'bg-primary/5 dark:bg-primary/10'
                                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                                        }`}
                                                        onClick={() => handleTogglePermission(perm.id, !isSelected)}
                                                    >
                                                        <div
                                                            className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${
                                                                isSelected
                                                                    ? 'bg-primary border-primary text-white'
                                                                    : 'border-gray-300 dark:border-gray-600'
                                                            }`}
                                                        >
                                                            {isSelected && (
                                                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span className={`text-xs font-medium uppercase tracking-wider min-w-[3.5rem] ${
                                                            isSelected
                                                                ? 'text-primary'
                                                                : 'text-gray-500 dark:text-gray-400'
                                                        }`}>
                                                            {actionLabels[action] || action}
                                                        </span>
                                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                                            {perm.description}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t('roles.selectedPermissions', '{{count}} permissions selected', { count: selectedCount })}
                    </span>
                    <Can I={role ? 'update' : 'create'} a="Role">
                        <Button variant="solid" type="submit" loading={isSubmitting}>
                            {role ? t('common.save', 'Save') : t('common.create', 'Create')}
                        </Button>
                    </Can>
                </div>
            </div>
        </Form>
    )
}

export default RoleForm
