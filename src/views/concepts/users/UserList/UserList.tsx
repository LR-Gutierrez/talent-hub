import { useState } from 'react'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import UserListTable from './components/UserListTable'
import UserListActionTools from './components/UserListActionTools'
import UsersListTableTools from './components/UsersListTableTools'
import UserListSelected from './components/UserListSelected'
import ShowDeletedToggle from '@/components/shared/ShowDeletedToggle'
import useUserList from './hooks/useUserList'
import useTranslation from '@/utils/hooks/useTranslation'
import cloneDeep from 'lodash/cloneDeep'

const UserList = () => {
    const { t } = useTranslation()
    const { tableData, setTableData, setFilter } = useUserList()
    const [showDeleted, setShowDeleted] = useState(false)

    const handleShowDeleted = (checked: boolean) => {
        setShowDeleted(checked)
        setFilter('withDeleted', checked ? 'true' : '')
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = 1
        setTableData(newTableData)
    }

    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>{t('common.users', 'Users')}</h3>
                            <div className="flex items-center gap-2">
                                <ShowDeletedToggle checked={showDeleted} onChange={handleShowDeleted} />
                                <UserListActionTools />
                            </div>
                        </div>
                        <UsersListTableTools />
                        <UserListTable />
                    </div>
                </AdaptiveCard>
            </Container>
            <UserListSelected />
        </>
    )
}

export default UserList
