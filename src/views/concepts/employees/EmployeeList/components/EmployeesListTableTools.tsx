import { useEffect, useState } from 'react'
import EmployeeListSearch from './EmployeeListSearch'
import Select from '@/components/ui/Select'
import useEmployeeList from '../hooks/useEmployeeList'
import { apiGetEmployeeStatuses } from '@/services/EmployeeStatusesService'
import { apiGetDepartments } from '@/services/DepartmentsService'
import type { EmployeeStatus } from '../types'
import type { Department } from '../types'

type Option = { value: string; label: string }

const EmployeesListTableTools = () => {
    const { setTableData, setFilter, tableData } = useEmployeeList()
    const [statuses, setStatuses] = useState<Option[]>([])
    const [departments, setDepartments] = useState<Option[]>([])

    useEffect(() => {
        apiGetEmployeeStatuses<EmployeeStatus[]>().then((res) => {
            setStatuses(res.filter((s) => s.isActive).map((s) => ({ value: s.id, label: s.name })))
        })
        apiGetDepartments<Department[]>().then((res) => {
            setDepartments(res.filter((d) => d.isActive).map((d) => ({ value: d.id, label: d.name })))
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
                    placeholder="Filter by status"
                    options={statuses}
                    onChange={handleStatusFilter}
                    isClearable
                    className="min-w-[180px]"
                />
                <Select
                    placeholder="Filter by department"
                    options={departments}
                    onChange={handleDepartmentFilter}
                    isClearable
                    className="min-w-[180px]"
                />
            </div>
        </div>
    )
}

export default EmployeesListTableTools
