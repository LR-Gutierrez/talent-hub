import { useState, useEffect } from 'react'
import classNames from 'classnames'
import useSWR from 'swr'
import { APP_NAME } from '@/constants/app.constant'
import {
    apiGetCompanySettings,
    getCachedCompanySettings,
} from '@/services/CompanySettingsService'
import type { CompanySettings } from '@/services/CompanySettingsService'
import type { CommonProps } from '@/@types/common'

interface LogoProps extends CommonProps {
    type?: 'full' | 'streamline'
    mode?: 'light' | 'dark'
    imgClass?: string
    logoWidth?: number | string
}

const LOGO_SRC_PATH = '/img/logo/'

const Logo = (props: LogoProps) => {
    const {
        type = 'full',
        mode = 'light',
        className,
        imgClass,
        style,
        logoWidth = 'auto',
    } = props

    const cached = getCachedCompanySettings()
    const { data: settings, isValidating } = useSWR(
        'company-settings',
        () => apiGetCompanySettings<CompanySettings>(),
        { fallbackData: cached ?? undefined },
    )

    const [ready, setReady] = useState(() => Boolean(cached))

    useEffect(() => {
        if (!isValidating) setReady(true)
    }, [isValidating])

    if (!ready && !settings) return null

    const src =
        settings?.companyLogo && settings.companyLogo !== '/img/logo/logo-light-full.png'
            ? settings.companyLogo
            : `${LOGO_SRC_PATH}logo-${mode}-${type}.png`

    return (
        <div
            className={classNames('logo', className)}
            style={{
                ...style,
                ...{ width: logoWidth },
            }}
        >
            <img
                className={imgClass}
                src={src}
                alt={`${APP_NAME} logo`}
            />
        </div>
    )
}

export default Logo
