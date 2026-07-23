import DebouceInput from '@/components/shared/DebouceInput'
import { TbSearch } from 'react-icons/tb'
import useTranslation from '@/utils/hooks/useTranslation'
import { Ref } from 'react'

type UserListSearchProps = {
    onInputChange: (value: string) => void
    ref?: Ref<HTMLInputElement>
}

const UserListSearch = (props: UserListSearchProps) => {
    const { onInputChange, ref } = props
    const { t } = useTranslation()

    return (
        <DebouceInput
            ref={ref}
            placeholder={t('common.quickSearch', 'Quick search...')}
            suffix={<TbSearch className="text-lg" />}
            onChange={(e) => onInputChange(e.target.value)}
        />
    )
}

export default UserListSearch
