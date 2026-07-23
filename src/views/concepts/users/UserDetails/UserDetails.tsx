import { useEffect, useState } from 'react'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import getInitials, { getAvatarColor } from '@/utils/getInitials'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Loading from '@/components/shared/Loading'
import { apiGetUser, apiDeleteUser, apiChangeUserPassword } from '@/services/UsersService'
import { TbArrowNarrowLeft, TbTrash, TbPencil, TbLock } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router'
import useSWR from 'swr'
import PasswordInput from '@/components/shared/PasswordInput'
import { useSessionUser } from '@/store/authStore'
import { Can } from '@casl/react'
import type { User } from '../UserList/types'

const roleColor: Record<string, string> = {
    admin: 'bg-purple-200 dark:bg-purple-200 text-gray-900 dark:text-gray-900',
    recruiter: 'bg-blue-200 dark:bg-blue-200 text-gray-900 dark:text-gray-900',
    candidate: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
}

const UserDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const currentUserId = useSessionUser((state) => state.user.userId)
    const isOwnAccount = id === currentUserId

    const { data, isLoading } = useSWR(
        [`/api/users/${id}`, { id: id as string }],
        ([_, params]) => apiGetUser<User, { id: string }>(params),
        { revalidateOnFocus: false, revalidateIfStale: false },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
    const [newPassword, setNewPassword] = useState('')

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

    const handleChangePassword = async () => {
        try {
            await apiChangeUserPassword(id as string, newPassword)
            toast.push(<Notification type="success">Password changed successfully!</Notification>, {
                placement: 'top-center',
            })
            setNewPassword('')
        } catch {
            toast.push(<Notification type="danger">Failed to change password</Notification>, {
                placement: 'top-center',
            })
        }
        setPasswordDialogOpen(false)
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
                                onClick={() => navigate('/users')}
                            >
                                Back
                            </Button>
                            <div className="flex items-center gap-2">
                                <Can I="update" a="User">
                                    <Button
                                        icon={<TbPencil />}
                                        onClick={() => navigate(`/users/${data.id}/edit`)}
                                    >
                                        Edit
                                    </Button>
                                </Can>
                                {useSessionUser.getState().user.authority?.includes('admin') && (
                                    <Button
                                        icon={<TbLock />}
                                        onClick={() => setPasswordDialogOpen(true)}
                                    >
                                        Change Password
                                    </Button>
                                )}
                                <Can I="delete" a="User">
                                    {!isOwnAccount && (
                                        <Button
                                            customColorClass={() =>
                                                'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                            }
                                            icon={<TbTrash />}
                                            onClick={() => setDeleteConfirmationOpen(true)}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </Can>
                            </div>
                        </div>
                        <Card>
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <Avatar
                                    size={100}
                                    shape="circle"
                                    className={!data.photoUrl ? getAvatarColor(data.displayName || data.email) : ''}
                                    src={data.photoUrl || undefined}
                                >
                                    {!data.photoUrl ? getInitials(data.displayName || data.email) : undefined}
                                </Avatar>
                                <div>
                                    <h3>{data.displayName || data.email}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Tag className={roleColor[data.role]}>
                                            <span className="capitalize">{data.role}</span>
                                        </Tag>
                                        <Tag className={data.isActive ? 'bg-emerald-200' : 'bg-red-200'}>
                                            {data.isActive ? 'Active' : 'Inactive'}
                                        </Tag>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <h4 className="mb-4">Details</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <span className="font-semibold">Email</span>
                                    <p className="mt-1">{data.email}</p>
                                </div>
                                <div>
                                    <span className="font-semibold">Role</span>
                                    <p className="mt-1 capitalize">{data.role}</p>
                                </div>
                                <div>
                                    <span className="font-semibold">Status</span>
                                    <p className="mt-1">{data.isActive ? 'Active' : 'Inactive'}</p>
                                </div>
                                <div>
                                    <span className="font-semibold">Created</span>
                                    <p className="mt-1">{new Date(data.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className="font-semibold">Last Updated</span>
                                    <p className="mt-1">{new Date(data.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </Loading>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove user"
                onClose={() => setDeleteConfirmationOpen(false)}
                onRequestClose={() => setDeleteConfirmationOpen(false)}
                onCancel={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleConfirmDelete}
            >
                <p>Are you sure you want to remove this user? This action can&apos;t be undo.</p>
            </ConfirmDialog>
            <ConfirmDialog
                isOpen={passwordDialogOpen}
                type="default"
                title="Change Password"
                onClose={() => { setPasswordDialogOpen(false); setNewPassword('') }}
                onRequestClose={() => { setPasswordDialogOpen(false); setNewPassword('') }}
                onCancel={() => { setPasswordDialogOpen(false); setNewPassword('') }}
                onConfirm={handleChangePassword}
                confirmText="Save"
            >
                <div className="flex flex-col gap-2">
                    <label className="font-semibold">New Password</label>
                    <PasswordInput
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                    />
                </div>
            </ConfirmDialog>
        </Container>
    )
}

export default UserDetails
