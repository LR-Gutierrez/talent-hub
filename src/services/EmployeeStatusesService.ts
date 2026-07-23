import ApiService from './ApiService'

export async function apiGetEmployeeStatuses<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/employee-statuses',
        method: 'get',
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

export async function apiDeleteEmployeeStatus<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/employee-statuses/${id}`,
        method: 'delete',
    })
}
