import { useState } from 'react'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/shared/PasswordInput'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useAuth } from '@/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useTranslation from '@/utils/hooks/useTranslation'
import type { CommonProps } from '@/@types/common'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    setMessage?: (message: string) => void
}

type SignUpFormSchema = {
    userName: string
    password: string
    email: string
    confirmPassword: string
}

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, setMessage } = props

    const { t } = useTranslation()

    const validationSchema = z
        .object({
            email: z.email({ message: t('auth.invalidEmail', 'Please enter a valid email') }),
            userName: z.string().min(1, { message: t('auth.enterName', 'Please enter your name') }),
            password: z.string().min(1, { message: t('auth.passwordRequiredMsg', 'Password required') }),
            confirmPassword: z.string().min(1, { message: t('auth.confirmPasswordRequired', 'Confirm Password Required') }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t('auth.passwordNotMatch', 'Password not match'),
            path: ['confirmPassword'],
        })

    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const { signUp } = useAuth()

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onSignUp = async (values: SignUpFormSchema) => {
        const { userName, password, email } = values

        if (!disableSubmit) {
            setSubmitting(true)
            const result = await signUp({ userName, password, email })

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            }

            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(onSignUp)}>
                <FormItem
                    label={t('auth.userName', 'User name')}
                    invalid={Boolean(errors.userName)}
                    errorMessage={errors.userName?.message}
                >
                    <Controller
                        name="userName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder={t('auth.userNamePlaceholder', 'User Name')}
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('auth.email', 'Email')}
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                placeholder={t('auth.email', 'Email')}
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('auth.password', 'Password')}
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <PasswordInput
                                autoComplete="off"
                                placeholder={t('auth.password', 'Password')}
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
                    {isSubmitting ? t('auth.creatingAccount', 'Creating Account...') : t('auth.signUp', 'Sign Up')}
                </Button>
            </Form>
        </div>
    )
}

export default SignUpForm
