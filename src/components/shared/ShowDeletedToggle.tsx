import Button from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import { TbTrash } from 'react-icons/tb'
import useTranslation from '@/utils/hooks/useTranslation'

type ShowDeletedToggleProps = {
    checked: boolean
    onChange: (checked: boolean) => void
}

const ShowDeletedToggle = ({ checked, onChange }: ShowDeletedToggleProps) => {
    const { t } = useTranslation()

    return (
        <Tooltip title={t('common.showDeleted', 'Show deleted')}>
            <Button
                variant={checked ? 'solid' : 'default'}
                size="sm"
                icon={<TbTrash className="text-lg" />}
                onClick={() => onChange(!checked)}
            />
        </Tooltip>
    )
}

export default ShowDeletedToggle
