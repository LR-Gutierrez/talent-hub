import { useEffect, useState } from 'react'
import EmployeeListSearch from './EmployeeListSearch'
import Select from '@/components/ui/Select'
import useEmployeeList from '../hooks/useEmployeeList'
import useTranslation from '@/utils/hooks/useTranslation'
import { apiGetEmployeeStatuses } from '@/services/EmployeeStatusesService'
import { apiGetDepartments } from '@/services/DepartmentsService'
import type { EmployeeStatus } from '../types'
import type { Department } from '../types'

type Option = { value: string; label: string }

const EmployeesListTableTools = () => {
    const { t } = useTranslation()
    const { setTableData, setFilter, tableData } = useEmployeeList()
    const [statuses, setStatuses] = useState<Option[]>([])
    const [departments, setDepartments] = useState<Option[]>([])

    useEffect(() => {
        apiGetEmployeeStatuses<{ list: EmployeeStatus[]; total: number }>().then((res) => {
            setStatuses(res.list.filter((s) => s.isActive).map((s) => ({ value: s.id, label: s.name })))
        })
        apiGetDepartments<{ list: Department[]; total: number }>().then((res) => {
            setDepartments(res.list.filter((d) => d.isActive).map((d) => ({ value: d.id, label: d.name })))
        })
    }, [])

    const handleSearch = (query: string) => {
        setTableData({ ...tableData, query, pageIndex: 1 })
    }

    const handleStatusFilter = (option: Option | null) => {
        setFilter('statusId', option?.value || '')
        setTableData({ ...tableData, pageIndex: 1 })
    }

    const handleDepartmentFilter = (option: Option | null) => {
        setFilter('departmentId', option?.value || '')
        setTableData({ ...tableData, pageIndex: 1 })
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <EmployeeListSearch onInputChange={handleSearch} />
            <div className="flex flex-col md:flex-row gap-2">
                <Select
                    placeholder={t('employeeList.filterByStatus', 'Filter by status')}
                    options={statuses}
                    onChange={handleStatusFilter}
                    isClearable
                    className="min-w-[180px] [&_.select-control]:min-h-12"
                />
                <Select
                    placeholder={t('employeeList.filterByDepartment', 'Filter by department')}
                    options={departments}
                    onChange={handleDepartmentFilter}
                    isClearable
                    className="min-w-[180px] [&_.select-control]:min-h-12"
                />
            </div>
        </div>
    )
}

export default EmployeesListTableTools
