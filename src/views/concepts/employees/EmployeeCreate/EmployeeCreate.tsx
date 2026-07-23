import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import EmployeeForm from '../EmployeeForm/EmployeeForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiCreateEmployee } from '@/services/EmployeesService'
import { TbArrowNarrowLeft, TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { Can } from '@casl/react'
import useTranslation from '@/utils/hooks/useTranslation'
import type { EmployeeFormSchema } from '../EmployeeForm/types'

const EmployeeCreate = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: EmployeeFormSchema) => {
        setIsSubmiting(true)
        try {
            const payload = {
                ...values,
                supervisorId: values.supervisorId || undefined,
            }
            await apiCreateEmployee(payload)
            toast.push(<Notification type="success">{t('employeeCreate.employeeCreated', 'Employee created!')}</Notification>, {
                placement: 'top-center',
            })
            navigate('/employees')
        } catch {
            toast.push(<Notification type="danger">{t('employeeCreate.failedToCreate', 'Failed to create employee')}</Notification>, {
                placement: 'top-center',
            })
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
            <EmployeeForm newEmployee onFormSubmit={handleFormSubmit}>
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <Button
                            className="ltr:mr-3 rtl:ml-3"
                            type="button"
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={() => navigate('/employees')}
                        >
                            {t('common.back', 'Back')}
                        </Button>
                        <div className="flex items-center">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
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
                    </div>
                </Container>
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
