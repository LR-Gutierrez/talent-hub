import { apiGetEmployeesList } from '@/services/EmployeesService'
import useSWR from 'swr'
import { useEmployeeListStore } from '../store/employeeListStore'
import type { GetEmployeesListResponse } from '../types'
import type { TableQueries } from '@/@types/common'

export default function useEmployeeList() {
    const { tableData, setTableData, selectedEmployee, setSelectedEmployee, setSelectAllEmployee, extraFilter, setFilter } =
        useEmployeeListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/employees', { ...tableData, ...extraFilter }],
        ([_, params]) => apiGetEmployeesList<GetEmployeesListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const employeeList = data?.list || []
    const employeeListTotal = data?.total || 0

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
