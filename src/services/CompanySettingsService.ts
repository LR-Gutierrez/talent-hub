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
