import { useState } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiGetEmployee, apiUpdateEmployee, apiDeleteEmployee } from '@/services/EmployeesService'
import EmployeeForm from '../EmployeeForm/EmployeeForm'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router'
import { Can } from '@casl/react'
import useSWR from 'swr'
import useTranslation from '@/utils/hooks/useTranslation'
import type { EmployeeFormSchema } from '../EmployeeForm/types'
import type { Employee } from '../EmployeeList/types'

const EmployeeEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { data, isLoading } = useSWR(
        [`/api/employees/${id}`, { id: id as string }],
        ([_, params]) => apiGetEmployee<Employee, { id: string }>(params),
        { revalidateOnFocus: false, revalidateIfStale: false },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: EmployeeFormSchema) => {
        setIsSubmiting(true)
        try {
            const payload = {
                ...values,
                supervisorId: values.supervisorId || undefined,
                birthDate: values.birthDate || undefined,
                hireDate: values.hireDate || undefined,
                endDate: values.endDate || undefined,
            }
            await apiUpdateEmployee(id as string, payload)
            toast.push(<Notification type="success">{t('employeeEdit.changesSaved', 'Changes Saved!')}</Notification>, {
                placement: 'top-center',
            })
            navigate('/employees')
        } catch {
            toast.push(<Notification type="danger">{t('employeeEdit.failedToUpdate', 'Failed to update employee')}</Notification>, {
                placement: 'top-center',
            })
        }
        setIsSubmiting(false)
    }

    const getDefaultValues = () => {
        if (data) {
            return {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone || '',
                phoneExtension: data.phoneExtension || '',
                corporatePhone: data.corporatePhone || '',
                satellitePhone: data.satellitePhone || '',
                roomPhone: data.roomPhone || '',
                mobilePhone: data.mobilePhone || '',
                address: data.address || '',
                birthDate: data.birthDate || '',
                documentId: data.documentId || '',
                genderId: data.genderId || '',
                nationalityId: data.nationalityId || '',
                maritalStatusId: data.maritalStatusId || '',
                placeOfBirthId: data.placeOfBirthId || '',
                notes: data.notes || '',
                photoUrl: data.photoUrl || '',
                departmentId: data.departmentId || '',
                position: data.position || '',
                contractingCompany: data.contractingCompany || '',
                hireDate: data.hireDate || '',
                endDate: data.endDate || '',
                salary: Number(data.salary) || 0,
                supervisorId: data.supervisorId || '',
                statusId: data.statusId,
                isActive: data.isActive,
                educationLevel: data.educations?.[0]?.educationLevel || '',
                degree: data.educations?.[0]?.degree || '',
                institution: data.educations?.[0]?.institution || '',
                graduationYear: data.educations?.[0]?.graduationYear || '',
                shirtSize: data.uniforms?.[0]?.shirtSize || '',
                pantSize: data.uniforms?.[0]?.pantSize || '',
                shoeSize: data.uniforms?.[0]?.shoeSize || '',
                jacketSize: data.uniforms?.[0]?.jacketSize || '',
                helmetSize: data.uniforms?.[0]?.helmetSize || '',
                children: data.children?.map((c) => ({
                    name: c.name,
                    birthDate: c.birthDate || '',
                    gender: c.gender || '',
                })) || [],
                emergencyContacts: data.emergencyContacts?.map((c) => ({
                    name: c.name,
                    phone: c.phone || '',
                    relationship: c.relationship || '',
                })) || [],
            }
        }
        return {}
    }

    const handleConfirmDelete = async () => {
        try {
            await apiDeleteEmployee(id as string)
            toast.push(<Notification type="success">{t('employeeEdit.employeeDeleted', 'Employee deleted!')}</Notification>, {
                placement: 'top-center',
            })
            navigate('/employees')
        } catch {
            toast.push(<Notification type="danger">{t('employeeEdit.failedToDelete', 'Failed to delete employee')}</Notification>, {
                placement: 'top-center',
            })
        }
        setDeleteConfirmationOpen(false)
    }

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    return (
        <>
            {!isLoading && !data && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoUserFound height={280} width={280} />
                    <h3 className="mt-8">{t('employeeEdit.noEmployeeFound', 'No employee found!')}</h3>
                </div>
            )}
            {!isLoading && data && (
                <>
                    <EmployeeForm
                        employeeId={id}
                        defaultValues={getDefaultValues() as EmployeeFormSchema}
                        onFormSubmit={handleFormSubmit}
                    >
                        <div className="flex items-center gap-3">
                            <Can I="delete" a="Employee">
                                <Button
                                    type="button"
                                    customColorClass={() =>
                                        'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                    }
                                    icon={<TbTrash />}
                                    onClick={handleDelete}
                                >
                                    {t('common.delete', 'Delete')}
                                </Button>
                            </Can>
                            <Button variant="solid" type="submit" loading={isSubmiting}>
                                {t('common.save', 'Save')}
                            </Button>
                        </div>
                    </EmployeeForm>
                    <ConfirmDialog
                        isOpen={deleteConfirmationOpen}
                        type="danger"
                        title={t('employeeEdit.removeEmployee', 'Remove employee')}
                        onClose={handleCancel}
                        onRequestClose={handleCancel}
                        onCancel={handleCancel}
                        onConfirm={handleConfirmDelete}
                    >
                        <p>{t('employeeEdit.removeEmployeeConfirm', "Are you sure you want to remove this employee? This action can't be undo.")}</p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default EmployeeEdit
