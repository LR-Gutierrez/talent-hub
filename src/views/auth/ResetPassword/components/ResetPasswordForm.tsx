import { useState } from 'react'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import { apiResetPassword } from '@/services/AuthService'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useTranslation from '@/utils/hooks/useTranslation'
import type { CommonProps } from '@/@types/common'

interface ResetPasswordFormProps extends CommonProps {
    resetComplete: boolean
    setResetComplete?: (compplete: boolean) => void
    setMessage?: (message: string) => void
}

type ResetPasswordFormSchema = {
    newPassword: string
    confirmPassword: string
}

const ResetPasswordForm = (props: ResetPasswordFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const { t } = useTranslation()

    const { className, setMessage, setResetComplete, resetComplete, children } =
        props

    const validationSchema = z
        .object({
            newPassword: z.string().min(1, t('auth.passwordRequiredMsg', 'Password required')),
            confirmPassword: z.string().min(1, t('auth.confirmPasswordRequired', 'Confirm Password Required')),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: t('auth.passwordNotMatch', 'Password not match'),
            path: ['confirmPassword'],
        })

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ResetPasswordFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onResetPassword = async (values: ResetPasswordFormSchema) => {
        const { newPassword } = values

        try {
            const resp = await apiResetPassword<boolean>({
                password: newPassword,
            })
            if (resp) {
                setSubmitting(false)
                setResetComplete?.(true)
            }
        } catch (errors) {
            setMessage?.(
                typeof errors === 'string'
                    ? errors
                    : t('auth.failedReset', 'Failed to reset password'),
            )
            setSubmitting(false)
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            {!resetComplete ? (
                <Form onSubmit={handleSubmit(onResetPassword)}>
                    <FormItem
                        label={t('auth.password', 'Password')}
                        invalid={Boolean(errors.newPassword)}
                        errorMessage={errors.newPassword?.message}
                    >
                        <Controller
                            name="newPassword"
                            control={control}
                            render={({ field }) => (
                                <PasswordInput
                                    autoComplete="off"
                                    placeholder={t('auth.passwordPlaceholder', '••••••••••••')}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={t('auth.confirmPassword', 'Confirm Password')}
                        invalid={Boolean(errors.confirmPassword)}
                        errorMessage={errors.confirmPassword?.message}
                    >
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <PasswordInput
                                    autoComplete="off"
                                    placeholder={t('auth.confirmPassword', 'Confirm Password')}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <Button
                        block
                        loading={isSubmitting}
                        variant="solid"
                        type="submit"
                    >
                        {isSubmitting ? t('auth.submitting', 'Submiting...') : t('auth.submit', 'Submit')}
                    </Button>
                </Form>
            ) : (
                <>{children}</>
            )}
        </div>
    )
}

export default ResetPasswordForm
