import ApiService from './ApiService'

export type Department = {
    id: string
    name: string
    description: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    deletedAt?: string | null
}

export async function apiGetDepartments<T = Department[]>(params?: Record<string, unknown>) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/departments',
        method: 'get',
        params,
    })
}

export async function apiGetDepartment<T, U extends Record<string, unknown>>({ id, ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/departments/${id}`,
        method: 'get',
        params,
    })
}

export async function apiCreateDepartment<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/departments',
        method: 'post',
        data,
    })
}

export async function apiUpdateDepartment<T, U extends Record<string, unknown>>(id: string, data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/departments/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteDepartment<T>(id: string, params?: Record<string, string>) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/departments/${id}`,
        method: 'delete',
        params,
    })
}

export async function apiGetDepartmentEmployeeCount(id: string) {
    return ApiService.fetchDataWithAxios<{ employeeCount: number }>({
        url: `/departments/${id}/employee-count`,
        method: 'get',
    })
}

export async function apiRestoreDepartment(id: string) {
    return ApiService.fetchDataWithAxios<{ id: string }>({
        url: `/departments/${id}/restore`,
        method: 'patch',
    })
}
