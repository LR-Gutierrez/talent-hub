import ApiService from './ApiService'

export async function apiGetCatalogs<T>(endpoint: string, params?: Record<string, unknown>) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpoint,
        method: 'get',
        params,
    })
}

export async function apiCreateCatalog<T>(endpoint: string, data: Record<string, unknown>) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpoint,
        method: 'post',
        data,
    })
}

export async function apiUpdateCatalog<T>(endpoint: string, id: string, data: Record<string, unknown>) {
    return ApiService.fetchDataWithAxios<T>({
        url: `${endpoint}/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteCatalog(endpoint: string, id: string) {
    return ApiService.fetchDataWithAxios({
        url: `${endpoint}/${id}`,
        method: 'delete',
    })
}

export async function apiUploadFlag(endpoint: string, id: string, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return ApiService.fetchDataWithAxios<{ flagUrl: string }, FormData>({
        url: `${endpoint}/${id}/flag`,
        method: 'post',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}

export async function apiDeleteFlag(endpoint: string, id: string) {
    return ApiService.fetchDataWithAxios({
        url: `${endpoint}/${id}/flag`,
        method: 'delete',
    })
}
