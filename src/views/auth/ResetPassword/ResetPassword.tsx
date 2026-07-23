import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import ActionLink from '@/components/shared/ActionLink'
import ResetPasswordForm from './components/ResetPasswordForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useTranslation from '@/utils/hooks/useTranslation'
import { useNavigate } from 'react-router'

type ResetPasswordProps = {
    signInUrl?: string
}

export const ResetPasswordBase = ({
    signInUrl = '/sign-in',
}: ResetPasswordProps) => {
    const [resetComplete, setResetComplete] = useState(false)

    const [message, setMessage] = useTimeOutMessage()
    const { t } = useTranslation()

    const navigate = useNavigate()

    const handleContinue = () => {
        navigate(signInUrl)
    }

    return (
        <div>
            <div className="mb-6">
                {resetComplete ? (
                    <>
                        <h3 className="mb-1">{t('auth.resetDone', 'Reset done')}</h3>
                        <p className="font-semibold heading-text">
                            {t('auth.resetDesc', 'Your password has been successfully reset')}
                        </p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-1">{t('auth.setNewPassword', 'Set new password')}</h3>
                        <p className="font-semibold heading-text">
                            {t('auth.newPasswordDesc', 'Your new password must different to previos password')}
                        </p>
                    </>
                )}
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <ResetPasswordForm
                resetComplete={resetComplete}
                setMessage={setMessage}
                setResetComplete={setResetComplete}
            >
                <Button
                    block
                    variant="solid"
                    type="button"
                    onClick={handleContinue}
                >
                    {t('auth.continue', 'Continue')}
                </Button>
            </ResetPasswordForm>
            <div className="mt-4 text-center">
                <span>{t('auth.backTo', 'Back to ')}</span>
                <ActionLink
                    to={signInUrl}
                    className="heading-text font-bold"
                    themeColor={false}
                >
                    {t('auth.signInLink', 'Sign in')}
                </ActionLink>
            </div>
        </div>
    )
}

const ResetPassword = () => {
    return <ResetPasswordBase />
}

export default ResetPassword
