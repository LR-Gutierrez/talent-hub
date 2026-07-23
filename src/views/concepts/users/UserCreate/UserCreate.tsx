import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import UserForm from '../UserForm/UserForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiCreateUser } from '@/services/UsersService'
import { TbArrowNarrowLeft, TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { Can } from '@casl/react'
import type { UserFormSchema } from '../UserForm/types'

const UserCreate = () => {
    const navigate = useNavigate()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: UserFormSchema) => {
        setIsSubmiting(true)
        try {
            await apiCreateUser(values)
            toast.push(<Notification type="success">User created!</Notification>, {
                placement: 'top-center',
            })
            navigate('/users')
        } catch {
            toast.push(<Notification type="danger">Failed to create user</Notification>, {
                placement: 'top-center',
            })
        }
        setIsSubmiting(false)
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        navigate('/users')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <UserForm newUser onFormSubmit={handleFormSubmit}>
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <Button
                            className="ltr:mr-3 rtl:ml-3"
                            type="button"
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={() => navigate('/users')}
                        >
                            Back
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
                                Discard
                            </Button>
                            <Button variant="solid" type="submit" loading={isSubmiting}>
                                Create
                            </Button>
                        </div>
                    </div>
                </Container>
            </UserForm>
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title="Discard changes"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>Are you sure you want discard this? This action can&apos;t be undo.</p>
            </ConfirmDialog>
        </>
    )
}

export default UserCreate
