import Container from '@/components/shared/Container'
import classNames from '@/utils/classNames'
import { APP_NAME } from '@/constants/app.constant'
import { PAGE_CONTAINER_GUTTER_X } from '@/constants/theme.constant'
import useTranslation from '@/utils/hooks/useTranslation'
import AboutModal from './AboutModal'
import TermsModal from './TermsModal'
import PrivacyModal from './PrivacyModal'
export type FooterPageContainerType = 'gutterless' | 'contained'

type FooterProps = {
    pageContainerType: FooterPageContainerType
    className?: string
}

const FooterContent = () => {
    const { t } = useTranslation()

    return (
        <div className="flex items-center justify-between flex-auto w-full">
            <span>
                Copyright &copy; {`${new Date().getFullYear()}`}{' '}
                <span className="font-semibold">{`${APP_NAME}`}</span>{' '}
                {t('footer.allRightsReserved', 'All rights reserved.')}
            </span>
            <div className="flex items-center">
                <TermsModal />
                <span className="mx-2 text-muted"> | </span>
                <PrivacyModal />
                <span className="mx-2 text-muted"> | </span>
                <AboutModal />
            </div>
        </div>
    )
}

export default function Footer({
    pageContainerType = 'contained',
    className,
}: FooterProps) {
    return (
        <footer
            className={classNames(
                `footer flex flex-auto items-center h-16 ${PAGE_CONTAINER_GUTTER_X}`,
                className,
            )}
        >
            {pageContainerType === 'contained' ? (
                <Container>
                    <FooterContent />
                </Container>
            ) : (
                <FooterContent />
            )}
        </footer>
    )
}
