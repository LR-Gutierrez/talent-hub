import { BrowserRouter } from 'react-router'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'
import CaslProvider from './ability/CaslProvider'
import appConfig from './configs/app.config'

if (appConfig.enableMock) {
    import('./mock')
}

function App() {
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
