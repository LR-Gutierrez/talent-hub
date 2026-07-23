import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import PersonalSection from './PersonalSection'
import LaborSection from './LaborSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import useTranslation from '@/utils/hooks/useTranslation'
import type { CommonProps } from '@/@types/common'
import type { EmployeeFormSchema } from './types'

type EmployeeFormProps = {
    onFormSubmit: (values: EmployeeFormSchema) => void
    defaultValues?: EmployeeFormSchema
    newEmployee?: boolean
} & CommonProps

const EmployeeForm = (props: EmployeeFormProps) => {
    const { t } = useTranslation()

    const validationSchema = z.object({
        fullName: z.string().min(1, { message: t('employeeForm.fullNameRequired', 'Full name is required') }),
        email: z.string().min(1, { message: t('employeeForm.emailRequired', 'Email is required') }).email({ message: t('employeeForm.invalidEmail', 'Invalid email') }),
        phone: z.string().optional().or(z.literal('')),
        address: z.string().optional().or(z.literal('')),
        birthDate: z.string().optional().or(z.literal('')),
        documentId: z.string().optional().or(z.literal('')),
        gender: z.string().optional().or(z.literal('')),
        departmentId: z.string().optional().or(z.literal('')),
        position: z.string().optional().or(z.literal('')),
        hireDate: z.string().optional().or(z.literal('')),
        endDate: z.string().optional().or(z.literal('')),
        salary: z.number().optional(),
        supervisorId: z.string().optional().or(z.literal('')),
        statusId: z.string().min(1, { message: t('employeeForm.statusRequired', 'Status is required') }),
        isActive: z.boolean(),
    })

    const { onFormSubmit, defaultValues = {}, newEmployee = false, children } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<EmployeeFormSchema>({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            address: '',
            birthDate: '',
            documentId: '',
            gender: '',
            departmentId: '',
            position: '',
            hireDate: '',
            endDate: '',
            salary: 0,
            supervisorId: '',
            statusId: '',
            isActive: true,
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema) as any,
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values: EmployeeFormSchema) => {
        onFormSubmit?.(values)
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col gap-4">
                    <PersonalSection control={control} errors={errors} />
                    <LaborSection control={control} errors={errors} />
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default EmployeeForm
