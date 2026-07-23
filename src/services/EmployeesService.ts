import ApiService from './ApiService'

export async function apiGetEmployeesList<T>(params: Record<string, unknown>) {
    const { sort, ...rest } = params
    const queryParams: Record<string, unknown> = { ...rest }
    if (sort && typeof sort === 'object') {
        const s = sort as { order: string; key: string }
        if (s.key && s.order) {
            queryParams.sortKey = s.key
            queryParams.sortOrder = s.order
        }
    }
    return ApiService.fetchDataWithAxios<T>({
        url: '/employees',
        method: 'get',
        params: queryParams,
    })
}

export async function apiGetEmployee<T, U extends Record<string, unknown>>({ id, ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/employees/${id}`,
        method: 'get',
        params,
    })
}

export async function apiCreateEmployee<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/employees',
        method: 'post',
        data,
    })
}

export async function apiUpdateEmployee<T, U extends Record<string, unknown>>(id: string, data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/employees/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteEmployee<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/employees/${id}`,
        method: 'delete',
    })
}

export async function apiChangeEmployeeStatus<T>(id: string, data: { statusId: string; notes?: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/employees/${id}/status`,
        method: 'patch',
        data,
    })
}

export async function apiGetEmployeeHistory<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/employees/${id}/history`,
        method: 'get',
    })
}
