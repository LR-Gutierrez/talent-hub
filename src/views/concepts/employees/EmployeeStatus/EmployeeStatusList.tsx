import { useCallback, useEffect, useMemo, useState } from 'react'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Button from '@/components/ui/Button'
import DataTable from '@/components/shared/DataTable'
import DebouceInput from '@/components/shared/DebouceInput'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import Avatar from '@/components/ui/Avatar'
import Select from '@/components/ui/Select'
import Spinner from '@/components/ui/Spinner'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Dialog from '@/components/ui/Dialog'
import ShowDeletedToggle from '@/components/shared/ShowDeletedToggle'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import {
    apiGetEmployeeStatuses,
    apiDeleteEmployeeStatus,
    apiRestoreEmployeeStatus,
    apiGetEmployeeStatusCount,
} from '@/services/EmployeeStatusesService'
import { TbPencil, TbTrash, TbPlus, TbSearch, TbRestore } from 'react-icons/tb'
import { Can } from '@casl/react'
import useTranslation from '@/utils/hooks/useTranslation'
import EmployeeStatusForm from './EmployeeStatusForm'
import type { EmployeeStatus } from '../EmployeeList/types'
import type { ColumnDef } from '@/components/shared/DataTable'

type StatusOption = { value: string; label: string }

const EmployeeStatusList = () => {
    const { t } = useTranslation()
    const [statuses, setStatuses] = useState<EmployeeStatus[]>([])
    const [total, setTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [query, setQuery] = useState('')
    const [showDeleted, setShowDeleted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingStatus, setEditingStatus] = useState<EmployeeStatus | null>(null)
    const [deleteStatus, setDeleteStatus] = useState<EmployeeStatus | null>(null)
    const [employeeCount, setEmployeeCount] = useState<number | null>(null)
    const [isChecking, setIsChecking] = useState(false)
    const [statusOptions, setStatusOptions] = useState<StatusOption[]>([])
    const [targetStatusId, setTargetStatusId] = useState<string>('')
    const [newStatusName, setNewStatusName] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    const allOptions = useMemo<StatusOption[]>(
        () => [...statusOptions, { value: '__new__', label: t('employeeStatus.createNew', 'Create new status...') }],
        [statusOptions, t],
    )

    const loadStatuses = useCallback(() => {
        setIsLoading(true)
        apiGetEmployeeStatuses<{ list: EmployeeStatus[]; total: number }>({
            pageIndex,
            pageSize,
            query: query || undefined,
            withDeleted: showDeleted ? 'true' : undefined,
        }).then((res) => {
            setStatuses(res.list)
            setTotal(res.total)
        }).finally(() => setIsLoading(false))
    }, [pageIndex, pageSize, query, showDeleted])

    useEffect(() => {
        loadStatuses()
    }, [loadStatuses])

    useEffect(() => {
        if (!deleteStatus) {
            setEmployeeCount(null)
            setStatusOptions([])
            setTargetStatusId('')
            setNewStatusName('')
            return
        }
        setIsChecking(true)
        setEmployeeCount(null)
        setTargetStatusId('')
        Promise.all([
            apiGetEmployeeStatusCount(deleteStatus.id),
            apiGetEmployeeStatuses<{ list: EmployeeStatus[] }>({ pageSize: 200 }),
        ])
            .then(([countRes, statusRes]) => {
                setEmployeeCount(countRes.employeeCount)
                setStatusOptions(
                    statusRes.list
                        .filter((s: EmployeeStatus) => s.isActive && s.id !== deleteStatus.id)
                        .map((s: EmployeeStatus) => ({ value: s.id, label: s.name })),
                )
            })
            .catch(() => setEmployeeCount(0))
            .finally(() => setIsChecking(false))
    }, [deleteStatus])

    const handleEdit = (status: EmployeeStatus) => {
        setEditingStatus(status)
        setDialogOpen(true)
    }

    const handleCreate = () => {
        setEditingStatus(null)
        setDialogOpen(true)
    }

    const handleDelete = (status: EmployeeStatus) => {
        setDeleteStatus(status)
    }

    const confirmDelete = async () => {
        if (!deleteStatus) return
        setIsDeleting(true)
        try {
            if (employeeCount && employeeCount > 0 && targetStatusId) {
                const params: Record<string, string> = { force: 'true' }
                if (targetStatusId === '__new__') {
                    params.newStatusName = newStatusName.trim()
                } else {
                    params.targetStatusId = targetStatusId
                }
                const res = await apiDeleteEmployeeStatus<{ movedCount: number; targetStatusName: string }>(deleteStatus.id, params)
                toast.push(
                    <Notification type="success">
                        {t('employeeStatus.reassignedAndDeleted', 'Status deleted! {{count}} employees moved to "{{name}}"', {
                            name: res.targetStatusName,
                            count: res.movedCount,
                        })}
                    </Notification>,
                    { placement: 'top-center' },
                )
            } else {
                await apiDeleteEmployeeStatus(deleteStatus.id)
                toast.push(<Notification type="success">{t('employeeStatus.deleted', 'Status deleted!')}</Notification>, {
                    placement: 'top-center',
                })
            }
            loadStatuses()
        } catch (err: any) {
            const msg = err?.response?.data?.message || t('employeeStatus.failedToDelete', 'Failed to delete status')
            toast.push(<Notification type="danger">{msg}</Notification>, {
                placement: 'top-center',
            })
        }
        setIsDeleting(false)
        setDeleteStatus(null)
    }

    const handleSuccess = () => {
        setDialogOpen(false)
        setEditingStatus(null)
        loadStatuses()
    }

    const handleRestore = async (status: EmployeeStatus) => {
        try {
            await apiRestoreEmployeeStatus(status.id)
            toast.push(<Notification type="success">{t('employeeStatus.statusRestored', 'Status restored!')}</Notification>, {
                placement: 'top-center',
            })
            loadStatuses()
        } catch {
            toast.push(<Notification type="danger">{t('employeeStatus.failedToRestore', 'Failed to restore status')}</Notification>, {
                placement: 'top-center',
            })
        }
    }

    const columns: ColumnDef<EmployeeStatus>[] = useMemo(
        () => [
            {
                header: t('employeeStatus.color', 'Color'),
                accessorKey: 'color',
                cell: (props) => (
                    <div className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded-full shrink-0"
                            style={{ backgroundColor: props.row.original.color || '#6b7280' }}
                        />
                        <span>{props.row.original.color || '-'}</span>
                    </div>
                ),
            },
            {
                header: t('employeeStatus.name', 'Name'),
                accessorKey: 'name',
                cell: (props) => {
                    const status = props.row.original
                    return (
                        <div className="flex items-center gap-2">
                            <span className={`font-semibold text-gray-900 dark:text-gray-100 ${status.deletedAt ? 'line-through opacity-60' : ''}`}>
                                {status.name}
                            </span>
                            {status.deletedAt && (
                                <Tag className="bg-red-100 text-red-600 border-red-200 text-xs shrink-0">
                                    {t('common.deleted', 'Deleted')}
                                </Tag>
                            )}
                        </div>
                    )
                },
            },
            {
                header: t('employeeStatus.description', 'Description'),
                accessorKey: 'description',
                cell: (props) => <span>{props.row.original.description || '-'}</span>,
            },
            {
                header: t('employeeStatus.status', 'Status'),
                accessorKey: 'isActive',
                cell: (props) => {
                    const active = props.row.original.isActive
                    return (
                        <Tag className={active ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'}>
                            {active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                        </Tag>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => {
                    const status = props.row.original
                    if (status.deletedAt) {
                        return (
                            <Can I="update" a="EmployeeStatus">
                                <Tooltip title={t('common.restore', 'Restore')}>
                                    <span
                                        className="inline-flex items-center text-xl cursor-pointer select-none font-semibold text-emerald-600 hover:text-emerald-700"
                                        role="button"
                                        onClick={() => handleRestore(status)}
                                    >
                                        <TbRestore />
                                    </span>
                                </Tooltip>
                            </Can>
                        )
                    }
                    return (
                        <div className="flex items-center gap-3">
                            <Can I="update" a="EmployeeStatus">
                                <Tooltip title={t('common.edit', 'Edit')}>
                                    <div
                                        className="text-xl cursor-pointer select-none font-semibold"
                                        role="button"
                                        onClick={() => handleEdit(status)}
                                    >
                                        <TbPencil />
                                    </div>
                                </Tooltip>
                            </Can>
                            <Can I="delete" a="EmployeeStatus">
                                <Tooltip title={t('common.delete', 'Delete')}>
                                    <div
                                        className="text-xl cursor-pointer select-none font-semibold text-red-500"
                                        role="button"
                                        onClick={() => handleDelete(status)}
                                    >
                                        <TbTrash />
                                    </div>
                                </Tooltip>
                            </Can>
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
                    <div className="flex justify-between items-center">
                        <ShowDeletedToggle checked={showDeleted} onChange={(checked) => { setShowDeleted(checked); setPageIndex(1) }} />
                        <Can I="create" a="EmployeeStatus">
                            <Button variant="solid" icon={<TbPlus />} onClick={handleCreate}>
                                {t('employeeStatus.addNew', 'Add Status')}
                            </Button>
                        </Can>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <DebouceInput
                            placeholder={t('common.quickSearch', 'Quick search...')}
                            suffix={<TbSearch className="text-lg" />}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                setPageIndex(1)
                            }}
                        />
                    </div>
                    <DataTable
                        columns={columns}
                        data={statuses}
                        noData={!isLoading && statuses.length === 0}
                        loading={isLoading}
                        pagingData={{
                            total,
                            pageIndex,
                            pageSize,
                        }}
                        onPaginationChange={(page) => setPageIndex(page)}
                        onSelectChange={(value) => {
                            setPageSize(Number(value))
                            setPageIndex(1)
                        }}
                    />
                </div>
            </AdaptiveCard>
            <Dialog
                isOpen={dialogOpen}
                onClose={() => { setDialogOpen(false); setEditingStatus(null) }}
                onRequestClose={() => { setDialogOpen(false); setEditingStatus(null) }}
            >
                <h5 className="mb-4">
                    {editingStatus ? t('employeeStatus.editStatus', 'Edit Status') : t('employeeStatus.createStatus', 'Create Status')}
                </h5>
                <EmployeeStatusForm status={editingStatus} onSuccess={handleSuccess} />
            </Dialog>
            <Dialog
                isOpen={deleteStatus !== null}
                closable={!isDeleting}
                onClose={() => { if (!isDeleting) setDeleteStatus(null) }}
                onRequestClose={() => { if (!isDeleting) setDeleteStatus(null) }}
                contentClassName="pb-0 px-0"
            >
                {isChecking ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size={30} />
                    </div>
                ) : employeeCount && employeeCount > 0 ? (
                    <>
                        <div className="px-6 pb-6 pt-2">
                            <h5 className="mb-2">{t('employeeStatus.reassignTitle', 'Cannot delete status')}</h5>
                            <p className="mb-4 text-gray-600 dark:text-gray-300">
                                {t('employeeStatus.reassignMessage', 'The status "{{name}}" has {{count}} employee(s) assigned. Reassign them to another status before deleting.', {
                                    name: deleteStatus?.name || '',
                                    count: employeeCount,
                                })}
                            </p>
                            <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                {t('employeeStatus.reassignLabel', 'Move employees to')}
                            </label>
                            <Select
                                options={allOptions}
                                value={allOptions.find((o) => o.value === targetStatusId) || null}
                                onChange={(option) => { setTargetStatusId(option?.value || ''); setNewStatusName('') }}
                                placeholder={t('employeeStatus.reassignSelectPlaceholder', 'Select a status...')}
                                isSearchable
                                className="min-w-[250px]"
                            />
                            {targetStatusId === '__new__' && (
                                <div className="mt-3">
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder={t('employeeStatus.newStatusName', 'Name of the new status...')}
                                        value={newStatusName}
                                        onChange={(e) => setNewStatusName(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            )}
                            {statusOptions.length === 0 && targetStatusId !== '__new__' && (
                                <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                                    {t('employeeStatus.noActiveStatus', 'No other active statuses available.')}
                                </p>
                            )}
                        </div>
                        <div className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-2xl rounded-br-2xl">
                            <div className="flex justify-end items-center gap-2">
                                <Button size="sm" disabled={isDeleting} onClick={() => setDeleteStatus(null)}>
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="solid"
                                    disabled={!targetStatusId || (targetStatusId === '__new__' && !newStatusName.trim())}
                                    loading={isDeleting}
                                    onClick={confirmDelete}
                                >
                                    {t('employeeStatus.reassignAction', 'Move {{count}} and delete', { count: employeeCount })}
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="px-6 pb-6 pt-2 flex">
                            <div>
                                <Avatar
                                    className="text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-100"
                                    shape="circle"
                                >
                                    <span className="text-2xl">
                                        <HiOutlineExclamationCircle />
                                    </span>
                                </Avatar>
                            </div>
                            <div className="ml-4 rtl:mr-4">
                                <h5 className="mb-2">{t('employeeStatus.confirmDeleteTitle', 'Delete Status')}</h5>
                                <p>{t('employeeStatus.confirmDeleteMessage', 'Are you sure you want to delete status "{{name}}"?', { name: deleteStatus?.name || '' })}</p>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-2xl rounded-br-2xl">
                            <div className="flex justify-end items-center gap-2">
                                <Button size="sm" disabled={isDeleting} onClick={() => setDeleteStatus(null)}>
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
                    </>
                )}
            </Dialog>
        </Container>
    )
}

export default EmployeeStatusList
