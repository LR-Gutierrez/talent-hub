import { useState } from 'react'
import { apiGetEmployeesList } from '@/services/EmployeesService'
import useSWR from 'swr'
import { useEmployeeListStore } from '../store/employeeListStore'
import type { GetEmployeesListResponse } from '../types'
import type { TableQueries } from '@/@types/common'

export default function useEmployeeList() {
    const { tableData, setTableData, selectedEmployee, setSelectedEmployee, setSelectAllEmployee } =
        useEmployeeListStore((state) => state)

    const [extraFilter, setExtraFilter] = useState<Record<string, string>>({})

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/employees', { ...tableData, ...extraFilter }],
        ([_, params]) => apiGetEmployeesList<GetEmployeesListResponse>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const employeeList = data?.list || []
    const employeeListTotal = data?.total || 0

    const setFilter = (key: string, value: string) => {
        setExtraFilter((prev) => ({ ...prev, [key]: value }))
    }

    return {
        employeeList,
        employeeListTotal,
        error,
        isLoading,
        tableData,
        mutate,
        setTableData,
        setFilter,
        selectedEmployee,
        setSelectedEmployee,
        setSelectAllEmployee,
    }
}
