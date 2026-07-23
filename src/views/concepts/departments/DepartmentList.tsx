import { useEffect, useState } from 'react'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Dialog from '@/components/ui/Dialog'
import {
    apiGetDepartments,
    apiDeleteDepartment,
} from '@/services/DepartmentsService'
import { TbPencil, TbTrash, TbPlus } from 'react-icons/tb'
import { Can } from '@casl/react'
import useTranslation from '@/utils/hooks/useTranslation'
import DepartmentForm from './DepartmentForm'
import type { Department } from '@/services/DepartmentsService'

const DepartmentList = () => {
    const { t } = useTranslation()
    const [departments, setDepartments] = useState<Department[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)

    const loadDepartments = () => {
        apiGetDepartments<Department[]>().then(setDepartments)
    }

    useEffect(() => {
        loadDepartments()
    }, [])

    const handleEdit = (dept: Department) => {
        setEditingDepartment(dept)
        setDialogOpen(true)
    }

    const handleCreate = () => {
        setEditingDepartment(null)
        setDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        try {
            await apiDeleteDepartment(id)
            toast.push(<Notification type="success">{t('department.deleted', 'Department deleted!')}</Notification>, {
                placement: 'top-center',
            })
            loadDepartments()
        } catch {
            toast.push(<Notification type="danger">{t('department.failedToDelete', 'Failed to delete department')}</Notification>, {
                placement: 'top-center',
            })
        }
    }

    const handleSuccess = () => {
        setDialogOpen(false)
        setEditingDepartment(null)
        loadDepartments()
    }

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>{t('department.title', 'Departments')}</h3>
                        <Can I="create" a="Department">
                            <Button variant="solid" icon={<TbPlus />} onClick={handleCreate}>
                                {t('department.addNew', 'Add Department')}
                            </Button>
                        </Can>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {departments.map((dept) => (
                            <div
                                key={dept.id}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between"
                            >
                                <div>
                                    <div className="font-semibold">{dept.name}</div>
                                    {dept.description && (
                                        <div className="text-sm text-gray-500">{dept.description}</div>
                                    )}
                                    <div className="mt-1">
                                        <Tag className={dept.isActive ? 'bg-emerald-200' : 'bg-red-200'}>
                                            {dept.isActive ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                                        </Tag>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Can I="update" a="Department">
                                        <Tooltip title={t('common.edit', 'Edit')}>
                                            <button
                                                className="text-xl cursor-pointer"
                                                onClick={() => handleEdit(dept)}
                                            >
                                                <TbPencil />
                                            </button>
                                        </Tooltip>
                                    </Can>
                                    <Can I="delete" a="Department">
                                        <Tooltip title={t('common.delete', 'Delete')}>
                                            <button
                                                className="text-xl cursor-pointer text-red-500"
                                                onClick={() => handleDelete(dept.id)}
                                            >
                                                <TbTrash />
                                            </button>
                                        </Tooltip>
                                    </Can>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AdaptiveCard>
            <Dialog
                isOpen={dialogOpen}
                onClose={() => { setDialogOpen(false); setEditingDepartment(null) }}
                onRequestClose={() => { setDialogOpen(false); setEditingDepartment(null) }}
            >
                <h5 className="mb-4">
                    {editingDepartment ? t('department.editDepartment', 'Edit Department') : t('department.createDepartment', 'Create Department')}
                </h5>
                <DepartmentForm department={editingDepartment} onSuccess={handleSuccess} />
            </Dialog>
        </Container>
    )
}

export default DepartmentList
