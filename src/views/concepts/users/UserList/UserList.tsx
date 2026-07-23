import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import UserListTable from './components/UserListTable'
import UserListActionTools from './components/UserListActionTools'
import UsersListTableTools from './components/UsersListTableTools'
import useTranslation from '@/utils/hooks/useTranslation'

const UserList = () => {
    const { t } = useTranslation()

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>{t('common.users', 'Users')}</h3>
                        <UserListActionTools />
                    </div>
                    <UsersListTableTools />
                    <UserListTable />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default UserList
