import { useEffect } from 'react'
import { BrowserRouter } from 'react-router'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'
import CaslProvider from './ability/CaslProvider'
import appConfig from './configs/app.config'
import {
    apiGetCompanySettings,
    setCachedCompanySettings,
} from '@/services/CompanySettingsService'
import type { CompanySettings } from '@/services/CompanySettingsService'

if (appConfig.enableMock) {
    import('./mock')
}

function applyFavicon(href: string) {
    let link = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement
    if (!link) {
        link = document.createElement('link')
        link.rel = 'shortcut icon'
        document.head.appendChild(link)
    }
    link.href = href
}

function useDynamicFavicon() {
    useEffect(() => {
        apiGetCompanySettings<CompanySettings>()
            .then((settings) => {
                setCachedCompanySettings(settings)
                if (settings.favicon) {
                    applyFavicon(settings.favicon)
                }
                if (settings.companyName) {
                    document.title = `TalentHub - ${settings.companyName}`
                }
            })
            .catch(() => {})
    }, [])
}

function App() {
    useDynamicFavicon()

    return (
        <Theme>
            <BrowserRouter>
                <AuthProvider>
                    <CaslProvider>
                        <Layout>
                            <Views />
                        </Layout>
                    </CaslProvider>
                </AuthProvider>
            </BrowserRouter>
        </Theme>
    )
}

export default App
