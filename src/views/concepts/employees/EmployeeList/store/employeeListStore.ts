import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { Employee } from '../types'

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

export type EmployeesListState = {
    tableData: TableQueries
    selectedEmployee: Partial<Employee>[]
    extraFilter: Record<string, string>
}

type EmployeesListAction = {
    setTableData: (payload: TableQueries) => void
    setSelectedEmployee: (checked: boolean, employee: Employee) => void
    setSelectAllEmployee: (employee: Employee[]) => void
    setFilter: (key: string, value: string) => void
}

const initialState: EmployeesListState = {
    tableData: initialTableData,
    selectedEmployee: [],
    extraFilter: {},
}

export const useEmployeeListStore = create<EmployeesListState & EmployeesListAction>((set) => ({
    ...initialState,
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedEmployee: (checked, row) =>
        set((state) => {
            const prevData = state.selectedEmployee
            if (checked) {
                return { selectedEmployee: [...prevData, ...[row]] }
            } else {
                if (prevData.some((prev) => row.id === prev.id)) {
                    return {
                        selectedEmployee: prevData.filter((prev) => prev.id !== row.id),
                    }
                }
                return { selectedEmployee: prevData }
            }
        }),
    setSelectAllEmployee: (row) => set(() => ({ selectedEmployee: row })),
    setFilter: (key, value) => set((state) => ({ extraFilter: { ...state.extraFilter, [key]: value } })),
}))
