import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import useUserList from '../hooks/useUserList'
import { TbChecks } from 'react-icons/tb'
import useTranslation from '@/utils/hooks/useTranslation'

const UserListSelected = () => {
    const { t } = useTranslation()
    const { selectedUser, setSelectAllUser } = useUserList()

    return (
        <>
            {selectedUser.length > 0 && (
                <StickyFooter
                    className="flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                    stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                    defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
                >
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <span className="text-lg text-primary">
                                    <TbChecks />
                                </span>
                                <span className="font-semibold flex items-center gap-1">
                                    <span className="heading-text">
                                        {selectedUser.length}{' '}
                                        {t('common.users', 'Users')}
                                    </span>
                                    <span>{t('common.selected', 'selected')}</span>
                                </span>
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => setSelectAllUser([])}
                                >
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </StickyFooter>
            )}
        </>
    )
}

export default UserListSelected
