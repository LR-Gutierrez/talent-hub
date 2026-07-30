import { useState } from 'react'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import EmployeeListTable from './components/EmployeeListTable'
import EmployeeListActionTools from './components/EmployeeListActionTools'
import EmployeesListTableTools from './components/EmployeesListTableTools'
import EmployeeListSelected from './components/EmployeeListSelected'
import ShowDeletedToggle from '@/components/shared/ShowDeletedToggle'
import { Can } from '@casl/react'
import useEmployeeList from './hooks/useEmployeeList'
import useTranslation from '@/utils/hooks/useTranslation'

const EmployeeList = () => {
    const { t } = useTranslation()
    const { mutate, setFilter, setTableData, tableData } = useEmployeeList()
    const [showDeleted, setShowDeleted] = useState(false)

    const handleShowDeleted = (checked: boolean) => {
        setShowDeleted(checked)
        setFilter('withDeleted', checked ? 'true' : '')
        setTableData({ ...tableData, pageIndex: 1 })
    }

    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>{t('common.employees', 'Employees')}</h3>
                            <div className="flex items-center gap-2">
                                <Can I="delete" a="Employee">
                                    <ShowDeletedToggle checked={showDeleted} onChange={handleShowDeleted} />
                                </Can>
                                <EmployeeListActionTools onImportComplete={() => mutate()} />
                            </div>
                        </div>
                        <EmployeesListTableTools />
                        <EmployeeListTable />
                    </div>
                </AdaptiveCard>
            </Container>
            <EmployeeListSelected />
        </>
    )
}

export default EmployeeList
