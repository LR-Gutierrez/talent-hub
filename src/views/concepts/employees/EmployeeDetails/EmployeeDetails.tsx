import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import useSWR from 'swr'
import dayjs from 'dayjs'
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
import { apiGetCompanySettings } from '@/services/CompanySettingsService'
import {
    TbArrowNarrowLeft,
    TbPencil,
    TbTrash,
    TbUser,
    TbMapPin,
    TbSchool,
    TbRuler,
    TbBriefcase,
    TbUsers,
    TbPhoneCall,
    TbClipboardText,
} from 'react-icons/tb'
import { Can } from '@casl/react'
import useTranslation from '@/utils/hooks/useTranslation'
import EmployeeHistoryTimeline from '../EmployeeHistory/EmployeeHistoryTimeline'
import type { Employee } from '../EmployeeList/types'
import type { CompanySettings } from '@/services/CompanySettingsService'

const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY'

const DetailRow = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="flex flex-col">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <span className="font-semibold">{value || '-'}</span>
    </div>
)

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <span className="text-lg text-blue-500 dark:text-blue-400">{icon}</span>
        <h5 className="m-0">{title}</h5>
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

    const { data: settings } = useSWR('company-settings', () =>
        apiGetCompanySettings<CompanySettings>(),
    )
    const dateFormat = settings?.dateFormat || DEFAULT_DATE_FORMAT

    const fmt = (date: string | null | undefined) =>
        date ? dayjs(date).format(dateFormat) : '-'

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

                            <div className="space-y-8">
                                {/* Personal Information */}
                                <div>
                                    <SectionHeader icon={<TbUser />} title={t('employeeDetails.personalInfo', 'Personal Information')} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                        <DetailRow label={t('employeeDetails.phone', 'Phone')} value={data.phone} />
                                        <DetailRow label={t('employeeDetails.phoneExtension', 'Phone Ext.')} value={data.phoneExtension} />
                                        <DetailRow label={t('employeeDetails.corporatePhone', 'Corporate Phone')} value={data.corporatePhone} />
                                        <DetailRow label={t('employeeDetails.mobilePhone', 'Mobile Phone')} value={data.mobilePhone} />
                                        <DetailRow label={t('employeeDetails.satellitePhone', 'Satellite Phone')} value={data.satellitePhone} />
                                        <DetailRow label={t('employeeDetails.roomPhone', 'Room Phone')} value={data.roomPhone} />
                                        <DetailRow label={t('employeeDetails.documentId', 'Document ID')} value={data.documentId} />
                                        <DetailRow label={t('employeeDetails.birthDate', 'Birth Date')} value={fmt(data.birthDate)} />
                                        <DetailRow label={t('employeeDetails.gender', 'Gender')} value={data.gender} />
                                        <div className="md:col-span-2 lg:col-span-3">
                                            <DetailRow label={t('employeeDetails.address', 'Address')} value={data.address} />
                                        </div>
                                    </div>
                                </div>

                                {/* Demographic Information */}
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                                    <SectionHeader icon={<TbMapPin />} title={t('employeeForm.demographicInfo', 'Demographic Information')} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                        <DetailRow label={t('employeeForm.nationality', 'Nationality')} value={data.nationality} />
                                        <DetailRow label={t('employeeForm.maritalStatus', 'Marital Status')} value={data.maritalStatus} />
                                        <DetailRow label={t('employeeForm.placeOfBirth', 'Place of Birth')} value={data.placeOfBirth} />
                                    </div>
                                </div>

                                {/* Education */}
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                                    <SectionHeader icon={<TbSchool />} title={t('employeeForm.educationInfo', 'Education')} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                        <DetailRow label={t('employeeForm.educationLevel', 'Education Level')} value={data.educations?.[0]?.educationLevel} />
                                        <DetailRow label={t('employeeForm.degree', 'Degree / Title')} value={data.educations?.[0]?.degree} />
                                        <DetailRow label={t('employeeForm.institution', 'Institution')} value={data.educations?.[0]?.institution} />
                                        <DetailRow label={t('employeeForm.graduationYear', 'Graduation Year')} value={data.educations?.[0]?.graduationYear} />
                                    </div>
                                </div>

                                {/* Uniform Sizes */}
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                                    <SectionHeader icon={<TbRuler />} title={t('employeeForm.uniformSizes', 'Uniform Sizes')} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                        <DetailRow label={t('employeeForm.shirtSize', 'Shirt')} value={data.uniforms?.[0]?.shirtSize} />
                                        <DetailRow label={t('employeeForm.pantSize', 'Pants')} value={data.uniforms?.[0]?.pantSize} />
                                        <DetailRow label={t('employeeForm.jacketSize', 'Jacket')} value={data.uniforms?.[0]?.jacketSize} />
                                        <DetailRow label={t('employeeForm.shoeSize', 'Shoes')} value={data.uniforms?.[0]?.shoeSize} />
                                        <DetailRow label={t('employeeForm.helmetSize', 'Helmet')} value={data.uniforms?.[0]?.helmetSize} />
                                    </div>
                                </div>

                                {/* Labor Information */}
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                                    <SectionHeader icon={<TbBriefcase />} title={t('employeeDetails.laborInfo', 'Labor Information')} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                        <DetailRow label={t('employeeDetails.department', 'Department')} value={data.department?.name} />
                                        <DetailRow label={t('employeeDetails.position', 'Position')} value={data.position} />
                                        <DetailRow label={t('employeeDetails.contractingCompany', 'Contracting Company')} value={data.contractingCompany} />
                                        <DetailRow label={t('employeeDetails.hireDate', 'Hire Date')} value={fmt(data.hireDate)} />
                                        <DetailRow label={t('employeeDetails.endDate', 'End Date')} value={fmt(data.endDate)} />
                                        <DetailRow label={t('employeeDetails.salary', 'Salary')} value={data.salary ? `$${data.salary}` : '-'} />
                                        <DetailRow label={t('employeeDetails.supervisor', 'Supervisor')} value={data.supervisor?.fullName} />
                                        <DetailRow label={t('employeeDetails.active', 'Active')} value={data.isActive ? t('common.yes', 'Yes') : t('common.no', 'No')} />
                                    </div>
                                </div>

                                {/* Children */}
                                {data.children?.length > 0 && (
                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                                        <SectionHeader icon={<TbUsers />} title={t('employeeForm.children', 'Children')} />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                            {data.children.map((child) => (
                                                <div
                                                    key={child.id}
                                                    className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-800/50"
                                                >
                                                    <p className="font-semibold m-0">{child.name}</p>
                                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                        <span>{fmt(child.birthDate)}</span>
                                                        {child.gender && (
                                                            <span className="capitalize">{child.gender}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Emergency Contacts */}
                                {data.emergencyContacts?.length > 0 && (
                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                                        <SectionHeader icon={<TbPhoneCall />} title={t('employeeForm.emergencyContacts', 'Emergency Contacts')} />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                            {data.emergencyContacts.map((contact) => (
                                                <div
                                                    key={contact.id}
                                                    className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-800/50"
                                                >
                                                    <p className="font-semibold m-0">{contact.name}</p>
                                                    <div className="flex flex-col gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                        <span>{contact.phone}</span>
                                                        <span className="capitalize">{contact.relationship}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Notes */}
                                {data.notes && (
                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                                        <SectionHeader icon={<TbClipboardText />} title={t('employeeForm.notes', 'Notes / Observations')} />
                                        <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                                            {data.notes}
                                        </p>
                                    </div>
                                )}
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
