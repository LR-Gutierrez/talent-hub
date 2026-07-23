import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import useTranslation from '@/utils/hooks/useTranslation'
import type { CommonProps } from '@/@types/common'
import type { UserFormSchema } from './types'

type UserFormProps = {
    onFormSubmit: (values: UserFormSchema) => void
    defaultValues?: UserFormSchema
    newUser?: boolean
} & CommonProps

const UserForm = (props: UserFormProps) => {
    const { t } = useTranslation()

    const validationSchema = z.object({
        email: z.string().min(1, { message: t('userForm.emailRequired', 'Email required') }).email({ message: t('userForm.invalidEmail', 'Invalid email') }),
        password: z.string().min(6).or(z.literal('')),
        displayName: z.string().optional(),
        photoUrl: z.string().optional(),
        role: z.enum(['admin', 'recruiter', 'candidate'], { message: t('userForm.selectRole', 'Please select a role') }),
        isActive: z.boolean(),
    })

    const { onFormSubmit, defaultValues = {}, newUser = false, children } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<UserFormSchema>({
        defaultValues: {
            email: '',
            password: '',
            displayName: '',
            photoUrl: '',
            role: 'candidate',
            isActive: true,
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values: UserFormSchema) => {
        onFormSubmit?.(values)
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <OverviewSection control={control} errors={errors} newUser={newUser} />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default UserForm
