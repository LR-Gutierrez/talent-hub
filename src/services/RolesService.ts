import ApiService from './ApiService'

export async function apiGetRolesList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/roles',
        method: 'get',
    })
}

export async function apiGetRole<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/roles/${id}`,
        method: 'get',
    })
}

export async function apiCreateRole<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/roles',
        method: 'post',
        data,
    })
}

export async function apiUpdateRole<T, U extends Record<string, unknown>>(id: string, data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/roles/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteRole<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/roles/${id}`,
        method: 'delete',
    })
}

export async function apiGetPermissionsList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/permissions',
        method: 'get',
    })
}
