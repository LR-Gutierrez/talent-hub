import Button from '@/components/ui/Button'
import { TbUserPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { Can } from '@casl/react'

const UserListActionTools = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Can I="create" a="User">
                <Button
                    variant="solid"
                    icon={<TbUserPlus className="text-xl" />}
                    onClick={() => navigate('/users/create')}
                >
                    Add new
                </Button>
            </Can>
        </div>
    )
}

export default UserListActionTools
