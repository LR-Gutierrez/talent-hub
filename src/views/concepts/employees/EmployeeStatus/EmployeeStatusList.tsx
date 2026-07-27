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
    apiGetEmployeeStatuses,
    apiDeleteEmployeeStatus,
} from '@/services/EmployeeStatusesService'
import { TbPencil, TbTrash, TbPlus, TbSearch } from 'react-icons/tb'
import { Can } from '@casl/react'
import useTranslation from '@/utils/hooks/useTranslation'
import EmployeeStatusForm from './EmployeeStatusForm'
import type { EmployeeStatus } from '../EmployeeList/types'
import type { ColumnDef } from '@/components/shared/DataTable'

const EmployeeStatusList = () => {
    const { t } = useTranslation()
    const [statuses, setStatuses] = useState<EmployeeStatus[]>([])
    const [total, setTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [query, setQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingStatus, setEditingStatus] = useState<EmployeeStatus | null>(null)

    const loadStatuses = useCallback(() => {
        setIsLoading(true)
        apiGetEmployeeStatuses<{ list: EmployeeStatus[]; total: number }>({ pageIndex, pageSize, query: query || undefined }).then((res) => {
            setStatuses(res.list)
            setTotal(res.total)
        }).finally(() => setIsLoading(false))
    }, [pageIndex, pageSize, query])

    useEffect(() => {
        loadStatuses()
    }, [loadStatuses])

    const handleEdit = (status: EmployeeStatus) => {
        setEditingStatus(status)
        setDialogOpen(true)
    }

    const handleCreate = () => {
        setEditingStatus(null)
        setDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        try {
            await apiDeleteEmployeeStatus(id)
            toast.push(<Notification type="success">{t('employeeStatus.deleted', 'Status deleted!')}</Notification>, {
                placement: 'top-center',
            })
            loadStatuses()
        } catch {
            toast.push(<Notification type="danger">{t('employeeStatus.failedToDelete', 'Failed to delete status')}</Notification>, {
                placement: 'top-center',
            })
        }
    }

    const handleSuccess = () => {
        setDialogOpen(false)
        setEditingStatus(null)
        loadStatuses()
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
                cell: (props) => (
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{props.row.original.name}</span>
                ),
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
                                        onClick={() => handleDelete(status.id)}
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
        </Container>
    )
}

export default EmployeeStatusList
