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
    apiGetDepartments,
    apiDeleteDepartment,
    apiRestoreDepartment,
    apiGetDepartmentEmployeeCount,
} from '@/services/DepartmentsService'
import { TbPencil, TbTrash, TbPlus, TbSearch, TbRestore } from 'react-icons/tb'
import { Can } from '@casl/react'
import useTranslation from '@/utils/hooks/useTranslation'
import DepartmentForm from './DepartmentForm'
import type { Department } from '@/services/DepartmentsService'
import type { ColumnDef } from '@/components/shared/DataTable'

type DeptOption = { value: string; label: string }

const DepartmentList = () => {
    const { t } = useTranslation()
    const [departments, setDepartments] = useState<Department[]>([])
    const [total, setTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [query, setQuery] = useState('')
    const [showDeleted, setShowDeleted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
    const [deleteDept, setDeleteDept] = useState<Department | null>(null)
    const [employeeCount, setEmployeeCount] = useState<number | null>(null)
    const [isChecking, setIsChecking] = useState(false)
    const [deptOptions, setDeptOptions] = useState<DeptOption[]>([])
    const [targetDeptId, setTargetDeptId] = useState<string>('')
    const [newDeptName, setNewDeptName] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    const allOptions = useMemo<DeptOption[]>(
        () => [...deptOptions, { value: '__new__', label: t('department.createNew', 'Create new department...') }],
        [deptOptions, t],
    )

    const loadDepartments = useCallback(() => {
        setIsLoading(true)
        apiGetDepartments<{ list: Department[]; total: number }>({
            pageIndex,
            pageSize,
            query: query || undefined,
            withDeleted: showDeleted ? 'true' : undefined,
        }).then((res) => {
            setDepartments(res.list)
            setTotal(res.total)
        }).finally(() => setIsLoading(false))
    }, [pageIndex, pageSize, query, showDeleted])

    useEffect(() => {
        loadDepartments()
    }, [loadDepartments])

    useEffect(() => {
        if (!deleteDept) {
            setEmployeeCount(null)
            setDeptOptions([])
            setTargetDeptId('')
            setNewDeptName('')
            return
        }
        setIsChecking(true)
        setEmployeeCount(null)
        setTargetDeptId('')
        Promise.all([
            apiGetDepartmentEmployeeCount(deleteDept.id),
            apiGetDepartments<{ list: Department[] }>({ pageSize: 200 }),
        ])
            .then(([countRes, deptRes]) => {
                setEmployeeCount(countRes.employeeCount)
                setDeptOptions(
                    deptRes.list
                        .filter((d: Department) => d.isActive && d.id !== deleteDept.id)
                        .map((d: Department) => ({ value: d.id, label: d.name })),
                )
            })
            .catch(() => setEmployeeCount(0))
            .finally(() => setIsChecking(false))
    }, [deleteDept])

    const handleEdit = (dept: Department) => {
        setEditingDepartment(dept)
        setDialogOpen(true)
    }

    const handleCreate = () => {
        setEditingDepartment(null)
        setDialogOpen(true)
    }

    const handleDelete = (dept: Department) => {
        setDeleteDept(dept)
    }

    const confirmDelete = async () => {
        if (!deleteDept) return
        setIsDeleting(true)
        try {
            if (employeeCount && employeeCount > 0 && targetDeptId) {
                const params: Record<string, string> = { force: 'true' }
                if (targetDeptId === '__new__') {
                    params.newDepartmentName = newDeptName.trim()
                } else {
                    params.targetDepartmentId = targetDeptId
                }
                const res = await apiDeleteDepartment<{ movedCount: number; targetDepartmentName: string }>(deleteDept.id, params)
                toast.push(
                    <Notification type="success">
                        {t('department.reassignedAndDeleted', 'Department deleted! {{count}} employees moved to "{{name}}"', {
                            name: res.targetDepartmentName,
                            count: res.movedCount,
                        })}
                    </Notification>,
                    { placement: 'top-center' },
                )
            } else {
                await apiDeleteDepartment(deleteDept.id)
                toast.push(<Notification type="success">{t('department.deleted', 'Department deleted!')}</Notification>, {
                    placement: 'top-center',
                })
            }
            loadDepartments()
        } catch (err: any) {
            const msg = err?.response?.data?.message || t('department.failedToDelete', 'Failed to delete department')
            toast.push(<Notification type="danger">{msg}</Notification>, {
                placement: 'top-center',
            })
        }
        setIsDeleting(false)
        setDeleteDept(null)
    }

    const handleSuccess = () => {
        setDialogOpen(false)
        setEditingDepartment(null)
        loadDepartments()
    }

    const handleRestore = async (dept: Department) => {
        try {
            await apiRestoreDepartment(dept.id)
            toast.push(<Notification type="success">{t('department.departmentRestored', 'Department restored!')}</Notification>, {
                placement: 'top-center',
            })
            loadDepartments()
        } catch {
            toast.push(<Notification type="danger">{t('department.failedToRestore', 'Failed to restore department')}</Notification>, {
                placement: 'top-center',
            })
        }
    }

    const columns: ColumnDef<Department>[] = useMemo(
        () => [
            {
                header: t('department.name', 'Name'),
                accessorKey: 'name',
                cell: (props) => {
                    const dept = props.row.original
                    return (
                        <div className="flex items-center gap-2">
                            <span className={`font-semibold text-gray-900 dark:text-gray-100 ${dept.deletedAt ? 'line-through opacity-60' : ''}`}>
                                {dept.name}
                            </span>
                            {dept.deletedAt && (
                                <Tag className="bg-red-100 text-red-600 border-red-200 text-xs shrink-0">
                                    {t('common.deleted', 'Deleted')}
                                </Tag>
                            )}
                        </div>
                    )
                },
            },
            {
                header: t('department.description', 'Description'),
                accessorKey: 'description',
                cell: (props) => <span>{props.row.original.description || '-'}</span>,
            },
            {
                header: t('department.status', 'Status'),
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
                    const dept = props.row.original
                    if (dept.deletedAt) {
                        return (
                            <Can I="update" a="Department">
                                <Tooltip title={t('common.restore', 'Restore')}>
                                    <span
                                        className="inline-flex items-center text-xl cursor-pointer select-none font-semibold text-emerald-600 hover:text-emerald-700"
                                        role="button"
                                        onClick={() => handleRestore(dept)}
                                    >
                                        <TbRestore />
                                    </span>
                                </Tooltip>
                            </Can>
                        )
                    }
                    return (
                        <div className="flex items-center gap-3">
                            <Can I="update" a="Department">
                                <Tooltip title={t('common.edit', 'Edit')}>
                                    <div
                                        className="text-xl cursor-pointer select-none font-semibold"
                                        role="button"
                                        onClick={() => handleEdit(dept)}
                                    >
                                        <TbPencil />
                                    </div>
                                </Tooltip>
                            </Can>
                            <Can I="delete" a="Department">
                                <Tooltip title={t('common.delete', 'Delete')}>
                                    <div
                                        className="text-xl cursor-pointer select-none font-semibold text-red-500"
                                        role="button"
                                        onClick={() => handleDelete(dept)}
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
                        <Can I="delete" a="Department">
                            <ShowDeletedToggle checked={showDeleted} onChange={(checked) => { setShowDeleted(checked); setPageIndex(1) }} />
                        </Can>
                        <Can I="create" a="Department">
                            <Button variant="solid" icon={<TbPlus />} onClick={handleCreate}>
                                {t('department.addNew', 'Add Department')}
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
                        data={departments}
                        noData={!isLoading && departments.length === 0}
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
                onClose={() => { setDialogOpen(false); setEditingDepartment(null) }}
                onRequestClose={() => { setDialogOpen(false); setEditingDepartment(null) }}
            >
                <h5 className="mb-4">
                    {editingDepartment ? t('department.editDepartment', 'Edit Department') : t('department.createDepartment', 'Create Department')}
                </h5>
                <DepartmentForm department={editingDepartment} onSuccess={handleSuccess} />
            </Dialog>
            <Dialog
                isOpen={deleteDept !== null}
                closable={!isDeleting}
                onClose={() => { if (!isDeleting) setDeleteDept(null) }}
                onRequestClose={() => { if (!isDeleting) setDeleteDept(null) }}
                contentClassName="pb-0 px-0"
            >
                {isChecking ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size={30} />
                    </div>
                ) : employeeCount && employeeCount > 0 ? (
                    <>
                        <div className="px-6 pb-6 pt-2">
                            <h5 className="mb-2">{t('department.reassignTitle', 'Cannot delete department')}</h5>
                            <p className="mb-4 text-gray-600 dark:text-gray-300">
                                {t('department.reassignMessage', 'The department "{{name}}" has {{count}} employee(s) assigned. Reassign them to another department before deleting.', {
                                    name: deleteDept?.name || '',
                                    count: employeeCount,
                                })}
                            </p>
                            <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                {t('department.reassignLabel', 'Move employees to')}
                            </label>
                            <Select
                                options={allOptions}
                                value={allOptions.find((o) => o.value === targetDeptId) || null}
                                onChange={(option) => { setTargetDeptId(option?.value || ''); setNewDeptName('') }}
                                placeholder={t('department.reassignSelectPlaceholder', 'Select a department...')}
                                isSearchable
                                className="min-w-[250px]"
                            />
                            {targetDeptId === '__new__' && (
                                <div className="mt-3">
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder={t('department.newDeptName', 'Name of the new department...')}
                                        value={newDeptName}
                                        onChange={(e) => setNewDeptName(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            )}
                            {deptOptions.length === 0 && targetDeptId !== '__new__' && (
                                <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                                    {t('department.noActiveDept', 'No other active departments available.')}
                                </p>
                            )}
                        </div>
                        <div className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-2xl rounded-br-2xl">
                            <div className="flex justify-end items-center gap-2">
                                <Button size="sm" disabled={isDeleting} onClick={() => setDeleteDept(null)}>
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="solid"
                                    disabled={!targetDeptId || (targetDeptId === '__new__' && !newDeptName.trim())}
                                    loading={isDeleting}
                                    onClick={confirmDelete}
                                >
                                    {t('department.reassignAction', 'Move {{count}} and delete', { count: employeeCount })}
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
                                <h5 className="mb-2">{t('department.confirmDeleteTitle', 'Delete Department')}</h5>
                                <p>{t('department.confirmDeleteMessage', 'Are you sure you want to delete department "{{name}}"?', { name: deleteDept?.name || '' })}</p>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-2xl rounded-br-2xl">
                            <div className="flex justify-end items-center gap-2">
                                <Button size="sm" disabled={isDeleting} onClick={() => setDeleteDept(null)}>
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

export default DepartmentList
