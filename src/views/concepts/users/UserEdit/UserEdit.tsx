import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiGetUser, apiUpdateUser, apiDeleteUser } from '@/services/UsersService'
import UserForm from '../UserForm/UserForm'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router'
import { Can } from '@casl/react'
import useSWR from 'swr'
import type { UserFormSchema } from '../UserForm/types'
import type { User } from '../UserList/types'

const UserEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading } = useSWR(
        [`/api/users/${id}`, { id: id as string }],
        ([_, params]) => apiGetUser<User, { id: string }>(params),
        { revalidateOnFocus: false, revalidateIfStale: false },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: UserFormSchema) => {
        setIsSubmiting(true)
        try {
            const payload = { ...values }
            if (!payload.password) delete payload.password
            await apiUpdateUser(id as string, payload)
            toast.push(<Notification type="success">Changes Saved!</Notification>, {
                placement: 'top-center',
            })
            navigate('/users')
        } catch {
            toast.push(<Notification type="danger">Failed to update user</Notification>, {
                placement: 'top-center',
            })
        }
        setIsSubmiting(false)
    }

    const getDefaultValues = () => {
        if (data) {
            return {
                email: data.email,
                password: '',
                displayName: data.displayName || '',
                photoUrl: data.photoUrl || '',
                role: data.role,
                isActive: data.isActive,
            }
        }
        return {}
    }

    const handleConfirmDelete = async () => {
        try {
            await apiDeleteUser(id as string)
            toast.push(<Notification type="success">User deleted!</Notification>, {
                placement: 'top-center',
            })
            navigate('/users')
        } catch {
            toast.push(<Notification type="danger">Failed to delete user</Notification>, {
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

    const handleBack = () => {
        history.back()
    }

    return (
        <>
            {!isLoading && !data && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoUserFound height={280} width={280} />
                    <h3 className="mt-8">No user found!</h3>
                </div>
            )}
            {!isLoading && data && (
                <>
                    <UserForm
                        defaultValues={getDefaultValues() as UserFormSchema}
                        onFormSubmit={handleFormSubmit}
                    >
                        <Container>
                            <div className="flex items-center justify-between px-8">
                                <Button
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    variant="plain"
                                    icon={<TbArrowNarrowLeft />}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
                                <div className="flex items-center">
                                    <Can I="delete" a="User">
                                        <Button
                                            className="ltr:mr-3 rtl:ml-3"
                                            type="button"
                                            customColorClass={() =>
                                                'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                            }
                                            icon={<TbTrash />}
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </Button>
                                    </Can>
                                    <Button variant="solid" type="submit" loading={isSubmiting}>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </UserForm>
                    <ConfirmDialog
                        isOpen={deleteConfirmationOpen}
                        type="danger"
                        title="Remove user"
                        onClose={handleCancel}
                        onRequestClose={handleCancel}
                        onCancel={handleCancel}
                        onConfirm={handleConfirmDelete}
                    >
                        <p>Are you sure you want to remove this user? This action can&apos;t be undo.</p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default UserEdit
