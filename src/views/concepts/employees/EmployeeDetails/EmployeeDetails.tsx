import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import useSWR from 'swr'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Loading from '@/components/shared/Loading'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiGetEmployee, apiDeleteEmployee } from '@/services/EmployeesService'
import { TbArrowNarrowLeft, TbPencil, TbTrash } from 'react-icons/tb'
import { Can } from '@casl/react'
import useTranslation from '@/utils/hooks/useTranslation'
import EmployeeHistoryTimeline from '../EmployeeHistory/EmployeeHistoryTimeline'
import type { Employee } from '../EmployeeList/types'

const DetailRow = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="flex flex-col">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <span className="font-semibold">{value || '-'}</span>
    </div>
)

const EmployeeDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { data, isLoading } = useSWR(
        [`/api/employees/${id}`, { id: id as string }],
        ([_, params]) => apiGetEmployee<Employee, { id: string }>(params),
        { revalidateOnFocus: false },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const handleDelete = async () => {
        try {
            await apiDeleteEmployee(id as string)
            toast.push(<Notification type="success">{t('employeeDetails.employeeDeleted', 'Employee deleted!')}</Notification>, {
                placement: 'top-center',
            })
            navigate('/employees')
        } catch {
            toast.push(<Notification type="danger">{t('employeeDetails.failedToDelete', 'Failed to delete employee')}</Notification>, {
                placement: 'top-center',
            })
        }
        setDeleteConfirmationOpen(false)
    }

    return (
        <Container>
            <Loading loading={isLoading}>
                {data && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="plain"
                                icon={<TbArrowNarrowLeft />}
                                onClick={() => navigate('/employees')}
                            >
                                {t('common.back', 'Back')}
                            </Button>
                            <div className="flex items-center gap-2">
                                <Can I="update" a="Employee">
                                    <Button
                                        icon={<TbPencil />}
                                        onClick={() => navigate(`/employees/${data.id}/edit`)}
                                    >
                                        {t('common.edit', 'Edit')}
                                    </Button>
                                </Can>
                                <Can I="delete" a="Employee">
                                    <Button
                                        icon={<TbTrash />}
                                        customColorClass={() =>
                                            'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                        }
                                        onClick={() => setDeleteConfirmationOpen(true)}
                                    >
                                        {t('common.delete', 'Delete')}
                                    </Button>
                                </Can>
                            </div>
                        </div>

                        <Card>
                            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                                <Avatar size={80} shape="circle">
                                    {data.fullName?.charAt(0)?.toUpperCase()}
                                </Avatar>
                                <div>
                                    <h3>{data.fullName}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Tag
                                            style={data.status?.color ? { backgroundColor: data.status.color + '30', color: data.status.color, borderColor: data.status.color } : {}}
                                        >
                                            {data.status?.name || '-'}
                                        </Tag>
                                        <span className="text-sm text-gray-500">{data.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="md:col-span-2 lg:col-span-3">
                                    <h5 className="mb-4">{t('employeeDetails.personalInfo', 'Personal Information')}</h5>
                                </div>
                                <DetailRow label={t('employeeDetails.phone', 'Phone')} value={data.phone} />
                                <DetailRow label={t('employeeDetails.documentId', 'Document ID')} value={data.documentId} />
                                <DetailRow label={t('employeeDetails.birthDate', 'Birth Date')} value={data.birthDate} />
                                <DetailRow label={t('employeeDetails.gender', 'Gender')} value={data.gender} />
                                <div className="md:col-span-2 lg:col-span-3">
                                    <DetailRow label={t('employeeDetails.address', 'Address')} value={data.address} />
                                </div>

                                <div className="md:col-span-2 lg:col-span-3 mt-4">
                                    <h5 className="mb-4">{t('employeeDetails.laborInfo', 'Labor Information')}</h5>
                                </div>
                                <DetailRow label={t('employeeDetails.department', 'Department')} value={data.department?.name} />
                                <DetailRow label={t('employeeDetails.position', 'Position')} value={data.position} />
                                <DetailRow label={t('employeeDetails.hireDate', 'Hire Date')} value={data.hireDate} />
                                <DetailRow label={t('employeeDetails.endDate', 'End Date')} value={data.endDate} />
                                <DetailRow label={t('employeeDetails.salary', 'Salary')} value={data.salary ? `$${data.salary}` : '-'} />
                                <DetailRow label={t('employeeDetails.supervisor', 'Supervisor')} value={data.supervisor?.fullName} />
                                <DetailRow label={t('employeeDetails.active', 'Active')} value={data.isActive ? t('common.yes', 'Yes') : t('common.no', 'No')} />
                            </div>
                        </Card>

                        <EmployeeHistoryTimeline employeeId={data.id} />
                    </div>
                )}
            </Loading>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title={t('employeeDetails.removeEmployee', 'Remove employee')}
                onClose={() => setDeleteConfirmationOpen(false)}
                onRequestClose={() => setDeleteConfirmationOpen(false)}
                onCancel={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleDelete}
            >
                <p>{t('employeeDetails.removeEmployeeConfirm', "Are you sure you want to remove this employee? This action can't be undo.")}</p>
            </ConfirmDialog>
        </Container>
    )
}

export default EmployeeDetails
