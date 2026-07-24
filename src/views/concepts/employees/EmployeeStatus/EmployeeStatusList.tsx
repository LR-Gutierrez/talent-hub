import { useCallback, useEffect, useState } from 'react'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Button from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Dialog from '@/components/ui/Dialog'
import {
    apiGetEmployeeStatuses,
    apiDeleteEmployeeStatus,
} from '@/services/EmployeeStatusesService'
import { TbPencil, TbTrash, TbPlus } from 'react-icons/tb'
import { Can } from '@casl/react'
import useTranslation from '@/utils/hooks/useTranslation'
import EmployeeStatusForm from './EmployeeStatusForm'
import type { EmployeeStatus } from '../EmployeeList/types'

const pageSizeOption = [
    { value: 5, label: '5 / page' },
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
]

const EmployeeStatusList = () => {
    const { t } = useTranslation()
    const [statuses, setStatuses] = useState<EmployeeStatus[]>([])
    const [total, setTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingStatus, setEditingStatus] = useState<EmployeeStatus | null>(null)

    const loadStatuses = useCallback(() => {
        apiGetEmployeeStatuses<{ list: EmployeeStatus[]; total: number }>({ pageIndex, pageSize }).then((res) => {
            setStatuses(res.list)
            setTotal(res.total)
        })
    }, [pageIndex, pageSize])

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {statuses.map((status) => (
                            <div
                                key={status.id}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: status.color || '#6b7280' }}
                                    />
                                    <div>
                                        <div className="font-semibold">{status.name}</div>
                                        {status.description && (
                                            <div className="text-sm text-gray-500">{status.description}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Can I="update" a="EmployeeStatus">
                                        <Tooltip title={t('common.edit', 'Edit')}>
                                            <button
                                                className="text-xl cursor-pointer"
                                                onClick={() => handleEdit(status)}
                                            >
                                                <TbPencil />
                                            </button>
                                        </Tooltip>
                                    </Can>
                                    <Can I="delete" a="EmployeeStatus">
                                        <Tooltip title={t('common.delete', 'Delete')}>
                                            <button
                                                className="text-xl cursor-pointer text-red-500"
                                                onClick={() => handleDelete(status.id)}
                                            >
                                                <TbTrash />
                                            </button>
                                        </Tooltip>
                                    </Can>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <Pagination
                            pageSize={pageSize}
                            currentPage={pageIndex}
                            total={total}
                            onChange={(page) => setPageIndex(page)}
                        />
                        <div style={{ minWidth: 130 }}>
                            <Select
                                size="sm"
                                menuPlacement="top"
                                isSearchable={false}
                                value={pageSizeOption.find((o) => o.value === pageSize)}
                                options={pageSizeOption}
                                onChange={(option) => {
                                    setPageSize(option?.value ?? 10)
                                    setPageIndex(1)
                                }}
                            />
                        </div>
                    </div>
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
