import ApiService from './ApiService'

export async function apiGetUsersList<T, U extends Record<string, unknown>>(
    params: U,
) {
    const { sort, ...rest } = params as Record<string, unknown>
    const queryParams: Record<string, unknown> = { ...rest }
    if (sort && typeof sort === 'object') {
        const s = sort as { order: string; key: string | number }
        if (s.key && s.order) {
            queryParams.sortKey = String(s.key)
            queryParams.sortOrder = s.order
        }
    }
    return ApiService.fetchDataWithAxios<T>({
        url: '/users',
        method: 'get',
        params: queryParams,
    })
}

export async function apiGetUser<T, U extends Record<string, unknown>>({ id, ...params }: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/users/${id}`,
        method: 'get',
        params,
    })
}

export async function apiCreateUser<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/users',
        method: 'post',
        data,
    })
}

export async function apiUpdateUser<T, U extends Record<string, unknown>>(id: string, data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/users/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteUser<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/users/${id}`,
        method: 'delete',
    })
}

export async function apiRestoreUser(id: string) {
    return ApiService.fetchDataWithAxios<{ id: string }>({
        url: `/users/${id}/restore`,
        method: 'patch',
    })
}

export async function apiChangeUserPassword<T>(id: string, password: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/users/${id}/change-password`,
        method: 'patch',
        data: { password },
    })
}
