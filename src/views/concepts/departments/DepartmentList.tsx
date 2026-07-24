import { useCallback, useEffect, useMemo, useState } from 'react'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Button from '@/components/ui/Button'
import DataTable from '@/components/shared/DataTable'
import DebouceInput from '@/components/shared/DebouceInput'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Dialog from '@/components/ui/Dialog'
import {
    apiGetDepartments,
    apiDeleteDepartment,
} from '@/services/DepartmentsService'
import { TbPencil, TbTrash, TbPlus, TbSearch } from 'react-icons/tb'
import { Can } from '@casl/react'
import useTranslation from '@/utils/hooks/useTranslation'
import DepartmentForm from './DepartmentForm'
import type { Department } from '@/services/DepartmentsService'
import type { ColumnDef } from '@/components/shared/DataTable'

const DepartmentList = () => {
    const { t } = useTranslation()
    const [departments, setDepartments] = useState<Department[]>([])
    const [total, setTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [query, setQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)

    const loadDepartments = useCallback(() => {
        setIsLoading(true)
        apiGetDepartments<{ list: Department[]; total: number }>({ pageIndex, pageSize, query: query || undefined }).then((res) => {
            setDepartments(res.list)
            setTotal(res.total)
        }).finally(() => setIsLoading(false))
    }, [pageIndex, pageSize, query])

    useEffect(() => {
        loadDepartments()
    }, [loadDepartments])

    const handleEdit = (dept: Department) => {
        setEditingDepartment(dept)
        setDialogOpen(true)
    }

    const handleCreate = () => {
        setEditingDepartment(null)
        setDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        try {
            await apiDeleteDepartment(id)
            toast.push(<Notification type="success">{t('department.deleted', 'Department deleted!')}</Notification>, {
                placement: 'top-center',
            })
            loadDepartments()
        } catch {
            toast.push(<Notification type="danger">{t('department.failedToDelete', 'Failed to delete department')}</Notification>, {
                placement: 'top-center',
            })
        }
    }

    const handleSuccess = () => {
        setDialogOpen(false)
        setEditingDepartment(null)
        loadDepartments()
    }

    const columns: ColumnDef<Department>[] = useMemo(
        () => [
            {
                header: t('department.name', 'Name'),
                accessorKey: 'name',
                cell: (props) => (
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{props.row.original.name}</span>
                ),
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
                                        onClick={() => handleDelete(dept.id)}
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
                    <div className="flex justify-end">
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
        </Container>
    )
}

export default DepartmentList
