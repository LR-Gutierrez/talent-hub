import { useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useEmployeeList from '../hooks/useEmployeeList'
import { apiBulkChangeEmployeeStatus } from '@/services/EmployeesService'
import { apiGetEmployeeStatuses } from '@/services/EmployeeStatusesService'
import { TbChecks } from 'react-icons/tb'
import { Can } from '@casl/react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import useTranslation from '@/utils/hooks/useTranslation'
import { useEffect, useState as useStateReact } from 'react'

type StatusOption = { value: string; label: string; color?: string }

const EmployeeListSelected = () => {
    const { t } = useTranslation()
    const {
        selectedEmployee,
        setSelectAllEmployee,
        mutate,
    } = useEmployeeList()

    const [statusOptions, setStatusOptions] = useStateReact<StatusOption[]>([])
    const [bulkStatusId, setBulkStatusId] = useState<string>('')
    const [bulkChanging, setBulkChanging] = useState(false)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    useEffect(() => {
        apiGetEmployeeStatuses<{ list: { id: string; name: string; color: string; isActive: boolean }[] }>().then((res) => {
            setStatusOptions(
                res.list.filter((s) => s.isActive).map((s) => ({ value: s.id, label: s.name, color: s.color })),
            )
        })
    }, [])

    const handleBulkStatusChange = async () => {
        if (!bulkStatusId || selectedEmployee.length === 0) return
        setBulkChanging(true)
        try {
            await apiBulkChangeEmployeeStatus({
                employeeIds: selectedEmployee.map((e) => e.id).filter(Boolean) as string[],
                statusId: bulkStatusId,
            })
            setSelectAllEmployee([])
            setBulkStatusId('')
            mutate()
            toast.push(<Notification type="success">{t('employeeList.bulkStatusChanged', 'Status updated for {{count}} employees', { count: selectedEmployee.length })}</Notification>, {
                placement: 'top-center',
            })
        } catch {
            toast.push(<Notification type="danger">{t('employeeList.failedToChangeStatus', 'Failed to update status')}</Notification>, {
                placement: 'top-center',
            })
        }
        setBulkChanging(false)
    }

    return (
        <>
            {selectedEmployee.length > 0 && (
                <StickyFooter
                    className="flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                    stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                    defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
                >
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <span className="text-lg text-primary">
                                    <TbChecks />
                                </span>
                                <span className="font-semibold flex items-center gap-1">
                                    <span className="heading-text">
                                        {selectedEmployee.length}{' '}
                                        {t('common.employees', 'Employees')}
                                    </span>
                                    <span>{t('common.selected', 'selected')}</span>
                                </span>
                            </span>
                            <div className="flex items-center gap-2">
                                <Select
                                    options={statusOptions}
                                    value={statusOptions.find((o) => o.value === bulkStatusId) || null}
                                    onChange={(option) => setBulkStatusId(option?.value || '')}
                                    placeholder={t('employeeList.changeStatusTo', 'Change status to...')}
                                    isSearchable={false}
                                    className="min-w-[200px]"
                                />
                                <Can I="update" a="Employee">
                                    <Button
                                        variant="solid"
                                        size="sm"
                                        disabled={!bulkStatusId || bulkChanging}
                                        loading={bulkChanging}
                                        onClick={handleBulkStatusChange}
                                    >
                                        {t('common.apply', 'Apply')}
                                    </Button>
                                </Can>
                                <Button
                                    size="sm"
                                    onClick={() => setSelectAllEmployee([])}
                                >
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </StickyFooter>
            )}
        </>
    )
}

export default EmployeeListSelected
