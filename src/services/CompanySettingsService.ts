import ApiService from './ApiService'

export type CompanySettings = {
    id: string
    companyName: string
    companyRuc: string
    companyLogo: string
    companyAddress: string
    companyPhone: string
    companyEmail: string
    timezone: string
    dateFormat: string
    currency: string
    defaultLang: string
    favicon: string
    createdAt: string
    updatedAt: string
}

const CACHE_KEY = 'company-settings-cache'

export function getCachedCompanySettings(): CompanySettings | null {
    try {
        const raw = localStorage.getItem(CACHE_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

export function setCachedCompanySettings(data: CompanySettings) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    } catch {}
}

export async function apiGetCompanySettings<T = CompanySettings>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/company-settings',
        method: 'get',
    })
}

export async function apiUpdateCompanySettings<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/company-settings',
        method: 'put',
        data,
    })
}

export async function apiUploadCompanyLogo(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return ApiService.fetchDataWithAxios<{ companyLogo: string }, FormData>({
        url: '/company-settings/logo',
        method: 'post',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}

export async function apiUploadCompanyFavicon(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return ApiService.fetchDataWithAxios<{ favicon: string }, FormData>({
        url: '/company-settings/favicon',
        method: 'post',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}
