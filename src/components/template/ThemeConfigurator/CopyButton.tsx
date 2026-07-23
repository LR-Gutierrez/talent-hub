import Notification from '@/components/ui/Notification'
import Button from '@/components/ui/Button'
import toast from '@/components/ui/toast'
import { themeConfig } from '@/configs/theme.config'
import { useThemeStore } from '@/store/themeStore'
import useTranslation from '@/utils/hooks/useTranslation'

const CopyButton = () => {
    const theme = useThemeStore((state) => state)
    const { t } = useTranslation()

    const handleCopy = () => {
        const config = {
            ...themeConfig,
            ...theme,
            layout: {
                type: theme.layout.type,
                sideNavCollapse: theme.layout.sideNavCollapse,
            },
            panelExpand: false,
        }

        navigator.clipboard.writeText(`
            
export const themeConfig: ThemeConfig = ${JSON.stringify(config, null, 2)}
`)

        toast.push(
            <Notification title={t('themeConfig.copySuccess', 'Copy Success')} type="success">
                {t('themeConfig.replaceConfig', "Please replace themeConfig in 'src/configs/theme.config.ts'")}
            </Notification>,
            {
                placement: 'top-center',
            },
        )
    }

    return (
        <Button block variant="solid" onClick={handleCopy}>
            {t('themeConfig.copyConfig', 'Copy config')}
        </Button>
    )
}

export default CopyButton
