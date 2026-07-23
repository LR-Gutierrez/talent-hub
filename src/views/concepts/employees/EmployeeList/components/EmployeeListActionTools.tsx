import Button from '@/components/ui/Button'
import { TbUserPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { Can } from '@casl/react'
import useTranslation from '@/utils/hooks/useTranslation'

const EmployeeListActionTools = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Can I="create" a="Employee">
                <Button
                    variant="solid"
                    icon={<TbUserPlus className="text-xl" />}
                    onClick={() => navigate('/employees/create')}
                >
                    {t('common.addNew', 'Add new')}
                </Button>
            </Can>
        </div>
    )
}

export default EmployeeListActionTools
