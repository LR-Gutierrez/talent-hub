import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import useSWR from 'swr'
import dayjs from 'dayjs'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Loading from '@/components/shared/Loading'
import Button from '@/components/ui/Button'
import Tabs from '@/components/ui/Tabs'
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
    TbBriefcase,
    TbSchool,
    TbUsers,
    TbClipboardText,
} from 'react-icons/tb'
import { Can } from '@casl/react'
import useTranslation from '@/utils/hooks/useTranslation'
import EmployeeHistoryTimeline from '../EmployeeHistory/EmployeeHistoryTimeline'
import type { Employee } from '../EmployeeList/types'
import type { CompanySettings } from '@/services/CompanySettingsService'

const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY'

type DetailRowProps = { label: string; value?: string | number | null; colSpan?: string }
const DetailRow = ({ label, value, colSpan }: DetailRowProps) => (
    <div className={colSpan || 'flex flex-col'}>
        <span className="text-xs tracking-wide uppercase text-gray-400 dark:text-gray-500">{label}</span>
        <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{value || '-'}</span>
    </div>
)

const SectionGrid = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
        {children}
    </div>
)

const TABS = [
    { key: 'profile', icon: <TbUser />, label: 'profile' },
    { key: 'labor', icon: <TbBriefcase />, label: 'labor' },
    { key: 'education', icon: <TbSchool />, label: 'education' },
    { key: 'family', icon: <TbUsers />, label: 'family' },
    { key: 'notes', icon: <TbClipboardText />, label: 'notes' },
]

const tabVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
}

const EmployeeDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [activeTab, setActiveTab] = useState('profile')

    const { data, isLoading } = useSWR(
        [`/api/employees/${id}`, { id: id as string }],
        ([, params]) => apiGetEmployee<Employee, { id: string }>(params),
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

    const renderProfileTab = (d: Employee) => (
        <SectionGrid>
            <DetailRow label={t('employeeDetails.phone', 'Phone')} value={d.phone} />
            <DetailRow label={t('employeeDetails.phoneExtension', 'Phone Ext.')} value={d.phoneExtension} />
            <DetailRow label={t('employeeDetails.corporatePhone', 'Corporate Phone')} value={d.corporatePhone} />
            <DetailRow label={t('employeeDetails.mobilePhone', 'Mobile Phone')} value={d.mobilePhone} />
            <DetailRow label={t('employeeDetails.satellitePhone', 'Satellite Phone')} value={d.satellitePhone} />
            <DetailRow label={t('employeeDetails.roomPhone', 'Room Phone')} value={d.roomPhone} />
            <DetailRow label={t('employeeDetails.documentId', 'Document ID')} value={d.documentId} />
            <DetailRow label={t('employeeDetails.birthDate', 'Birth Date')} value={fmt(d.birthDate)} />
            <DetailRow label={t('employeeDetails.gender', 'Gender')} value={d.genderRef?.displayName} />
            <DetailRow label={t('employeeForm.nationality', 'Nationality')} value={d.nationalityRef?.displayName} />
            <DetailRow label={t('employeeForm.maritalStatus', 'Marital Status')} value={d.maritalStatusRef?.displayName} />
            <DetailRow label={t('employeeForm.placeOfBirth', 'Place of Birth')} value={d.placeOfBirthRef?.displayName} />
            <div className="sm:col-span-2 lg:col-span-3">
                <DetailRow label={t('employeeDetails.address', 'Address')} value={d.address} />
            </div>
        </SectionGrid>
    )

    const renderLaborTab = (d: Employee) => (
        <SectionGrid>
            <DetailRow label={t('employeeDetails.department', 'Department')} value={d.department?.name} />
            <DetailRow label={t('employeeDetails.position', 'Position')} value={d.position} />
            <DetailRow label={t('employeeDetails.contractingCompany', 'Contracting Company')} value={d.contractingCompany} />
            <DetailRow label={t('employeeDetails.hireDate', 'Hire Date')} value={fmt(d.hireDate)} />
            <DetailRow label={t('employeeDetails.endDate', 'End Date')} value={fmt(d.endDate)} />
            <DetailRow label={t('employeeDetails.salary', 'Salary')} value={d.salary ? `$${d.salary}` : '-'} />
            <DetailRow label={t('employeeDetails.supervisor', 'Supervisor')} value={d.supervisor?.fullName} />
            <DetailRow label={t('employeeDetails.active', 'Active')} value={d.isActive ? t('common.yes', 'Yes') : t('common.no', 'No')} />
        </SectionGrid>
    )

    const renderEducationTab = (d: Employee) => (
        <div className="space-y-8">
            <div>
                <h5 className="text-gray-700 dark:text-gray-300 mb-4">{t('employeeForm.educationInfo', 'Education')}</h5>
                <SectionGrid>
                    <DetailRow label={t('employeeForm.educationLevel', 'Education Level')} value={d.educations?.[0]?.educationLevel} />
                    <DetailRow label={t('employeeForm.degree', 'Degree / Title')} value={d.educations?.[0]?.degree} />
                    <DetailRow label={t('employeeForm.institution', 'Institution')} value={d.educations?.[0]?.institution} />
                    <DetailRow label={t('employeeForm.graduationYear', 'Graduation Year')} value={d.educations?.[0]?.graduationYear} />
                </SectionGrid>
            </div>
            <div>
                <h5 className="text-gray-700 dark:text-gray-300 mb-4">{t('employeeForm.uniformSizes', 'Uniform Sizes')}</h5>
                <SectionGrid>
                    <DetailRow label={t('employeeForm.shirtSize', 'Shirt')} value={d.uniforms?.[0]?.shirtSize} />
                    <DetailRow label={t('employeeForm.pantSize', 'Pants')} value={d.uniforms?.[0]?.pantSize} />
                    <DetailRow label={t('employeeForm.jacketSize', 'Jacket')} value={d.uniforms?.[0]?.jacketSize} />
                    <DetailRow label={t('employeeForm.shoeSize', 'Shoes')} value={d.uniforms?.[0]?.shoeSize} />
                    <DetailRow label={t('employeeForm.helmetSize', 'Helmet')} value={d.uniforms?.[0]?.helmetSize} />
                </SectionGrid>
            </div>
        </div>
    )

    const renderFamilyTab = (d: Employee) => (
        <div className="space-y-8">
            {d.children?.length > 0 && (
                <div>
                    <h5 className="text-gray-700 dark:text-gray-300 mb-4">{t('employeeForm.children', 'Children')}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {d.children.map((child) => (
                            <div
                                key={child.id}
                                className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gradient-to-br from-gray-50/80 to-white dark:from-gray-800/50 dark:to-gray-800/30"
                            >
                                <p className="font-semibold m-0 text-gray-800 dark:text-gray-200">{child.name}</p>
                                <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                                    <span>{fmt(child.birthDate)}</span>
                                    {child.gender && (
                                        <span className="capitalize px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs">{child.gender}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {d.emergencyContacts?.length > 0 && (
                <div>
                    <h5 className="text-gray-700 dark:text-gray-300 mb-4">{t('employeeForm.emergencyContacts', 'Emergency Contacts')}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {d.emergencyContacts.map((contact) => (
                            <div
                                key={contact.id}
                                className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gradient-to-br from-gray-50/80 to-white dark:from-gray-800/50 dark:to-gray-800/30"
                            >
                                <p className="font-semibold m-0 text-gray-800 dark:text-gray-200">{contact.name}</p>
                                <div className="flex flex-col gap-1 mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                                    <span>{contact.phone}</span>
                                    <span className="capitalize">{contact.relationship}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {!d.children?.length && !d.emergencyContacts?.length && (
                <p className="text-gray-400 text-center py-8">{t('employeeDetails.noFamilyData', 'No family or contact information')}</p>
            )}
        </div>
    )

    const renderNotesTab = (d: Employee) => (
        <div className="space-y-8">
            {d.notes && (
                <div>
                    <h5 className="text-gray-700 dark:text-gray-300 mb-4">{t('employeeForm.notes', 'Notes / Observations')}</h5>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700 leading-relaxed">
                        {d.notes}
                    </p>
                </div>
            )}
            <EmployeeHistoryTimeline employeeId={d.id} />
        </div>
    )

    const tabContent: Record<string, (d: Employee) => React.ReactNode> = {
        profile: renderProfileTab,
        labor: renderLaborTab,
        education: renderEducationTab,
        family: renderFamilyTab,
        notes: renderNotesTab,
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
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                                <Avatar size={72} shape="circle" src={data.photoUrl || ''} className="ring-2 ring-blue-100 dark:ring-blue-900">
                                    {!data.photoUrl && data.fullName?.charAt(0)?.toUpperCase()}
                                </Avatar>
                                <div className="text-center md:text-left">
                                    <h3 className="m-0">{data.fullName}</h3>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-1.5">
                                        <Tag
                                            style={data.status?.color ? { backgroundColor: data.status.color + '20', color: data.status.color, borderColor: data.status.color + '40' } : {}}
                                        >
                                            {data.status?.name || '-'}
                                        </Tag>
                                        <span className="text-sm text-gray-400">{data.email}</span>
                                    </div>
                                </div>
                            </div>

                            <Tabs value={activeTab} variant="underline" onChange={(val) => setActiveTab(val)}>
                                <Tabs.TabList className="border-b border-gray-200 dark:border-gray-700 -mx-4 px-4 mb-6 overflow-x-auto flex-nowrap gap-1">
                                    {TABS.map(({ key, icon }) => (
                                        <Tabs.TabNav key={key} value={key} icon={icon}>
                                            {t(`employeeDetails.tab.${key}`, key.charAt(0).toUpperCase() + key.slice(1))}
                                        </Tabs.TabNav>
                                    ))}
                                </Tabs.TabList>
                            </Tabs>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    variants={tabVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.2, ease: 'easeOut' }}
                                >
                                    {tabContent[activeTab]?.(data)}
                                </motion.div>
                            </AnimatePresence>
                        </Card>
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
