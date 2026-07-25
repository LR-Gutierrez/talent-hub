import { useState } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { TbUserPlus, TbDownload, TbUpload } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { Can } from '@casl/react'
import useTranslation from '@/utils/hooks/useTranslation'
import { apiExportEmployeesExcel } from '@/services/EmployeesService'
import EmployeeImportModal from './EmployeeImportModal'

const EmployeeListActionTools = ({ onImportComplete }: { onImportComplete?: () => void }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [importModalOpen, setImportModalOpen] = useState(false)

    const handleExport = async () => {
        try {
            const blob = await apiExportEmployeesExcel()
            const url = window.URL.createObjectURL(blob as unknown as Blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'employees.xlsx'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch {
            toast.push(
                <Notification type="danger">
                    {t('export.failedToExport', 'Failed to export employees')}
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    return (
        <>
            <div className="flex flex-col md:flex-row gap-3">
                <Can I="read" a="Employee">
                    <Button
                        icon={<TbDownload className="text-xl" />}
                        onClick={handleExport}
                    >
                        {t('common.export', 'Export')}
                    </Button>
                </Can>
                <Can I="create" a="Employee">
                    <Button
                        icon={<TbUpload className="text-xl" />}
                        onClick={() => setImportModalOpen(true)}
                    >
                        {t('common.import', 'Import')}
                    </Button>
                    <Button
                        variant="solid"
                        icon={<TbUserPlus className="text-xl" />}
                        onClick={() => navigate('/employees/create')}
                    >
                        {t('common.addNew', 'Add new')}
                    </Button>
                </Can>
            </div>
            <EmployeeImportModal
                isOpen={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                onImportComplete={() => {
                    onImportComplete?.()
                }}
            />
        </>
    )
}

export default EmployeeListActionTools
