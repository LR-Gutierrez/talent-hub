import ApiService from './ApiService'

export async function apiGetEmployeeStatuses<T>(params?: Record<string, unknown>) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/employee-statuses',
        method: 'get',
        params,
    })
}

export async function apiGetEmployeeStatus<T, U extends Record<string, unknown>>({ id, ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/employee-statuses/${id}`,
        method: 'get',
        params,
    })
}

export async function apiCreateEmployeeStatus<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/employee-statuses',
        method: 'post',
        data,
    })
}

export async function apiUpdateEmployeeStatus<T, U extends Record<string, unknown>>(id: string, data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/employee-statuses/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteEmployeeStatus<T>(id: string, params?: Record<string, string>) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/employee-statuses/${id}`,
        method: 'delete',
        params,
    })
}

export async function apiGetEmployeeStatusCount(id: string) {
    return ApiService.fetchDataWithAxios<{ employeeCount: number }>({
        url: `/employee-statuses/${id}/employee-count`,
        method: 'get',
    })
}

export async function apiRestoreEmployeeStatus(id: string) {
    return ApiService.fetchDataWithAxios<{ id: string }>({
        url: `/employee-statuses/${id}/restore`,
        method: 'patch',
    })
}
