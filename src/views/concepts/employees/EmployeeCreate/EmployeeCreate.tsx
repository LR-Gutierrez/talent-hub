import { useState } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import EmployeeForm from '../EmployeeForm/EmployeeForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiCreateEmployee } from '@/services/EmployeesService'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { Can } from '@casl/react'
import useTranslation from '@/utils/hooks/useTranslation'
import type { EmployeeFormSchema } from '../EmployeeForm/types'

function parseBackendErrors(error: unknown): Record<string, string> {
    const messages = (error as any)?.response?.data?.message
    if (Array.isArray(messages)) {
        const result: Record<string, string> = {}
        for (const msg of messages) {
            if (typeof msg !== 'string') continue
            const spaceIdx = msg.indexOf(' ')
            if (spaceIdx > 0) {
                result[msg.substring(0, spaceIdx)] = msg
            }
        }
        return result
    }
    return {}
}

const EmployeeCreate = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [serverErrors, setServerErrors] = useState<Record<string, string>>({})

    const handleFormSubmit = async (values: EmployeeFormSchema) => {
        setIsSubmiting(true)
        setServerErrors({})
        try {
            const payload = {
                ...values,
                supervisorId: values.supervisorId || undefined,
                birthDate: values.birthDate || undefined,
                hireDate: values.hireDate || undefined,
                endDate: values.endDate || undefined,
            }
            await apiCreateEmployee(payload)
            toast.push(<Notification type="success">{t('employeeCreate.employeeCreated', 'Employee created!')}</Notification>, {
                placement: 'top-center',
            })
            navigate('/employees')
        } catch (err) {
            const parsed = parseBackendErrors(err)
            if (Object.keys(parsed).length > 0) {
                setServerErrors(parsed)
            } else {
                toast.push(<Notification type="danger">{t('employeeCreate.failedToCreate', 'Failed to create employee')}</Notification>, {
                    placement: 'top-center',
                })
            }
        }
        setIsSubmiting(false)
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        navigate('/employees')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <EmployeeForm newEmployee serverErrors={serverErrors} onFormSubmit={handleFormSubmit}>
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        customColorClass={() =>
                            'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                        }
                        icon={<TbTrash />}
                        onClick={handleDiscard}
                    >
                        {t('common.discard', 'Discard')}
                    </Button>
                    <Button variant="solid" type="submit" loading={isSubmiting}>
                        {t('common.create', 'Create')}
                    </Button>
                </div>
            </EmployeeForm>
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title={t('employeeCreate.discardChanges', 'Discard changes')}
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>{t('employeeCreate.discardConfirm', "Are you sure you want discard this? This action can't be undo.")}</p>
            </ConfirmDialog>
        </>
    )
}

export default EmployeeCreate
