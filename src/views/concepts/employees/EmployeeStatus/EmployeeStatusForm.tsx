import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { FormItem, Form } from '@/components/ui/Form'
import {
    apiCreateEmployeeStatus,
    apiUpdateEmployeeStatus,
} from '@/services/EmployeeStatusesService'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TbColorPicker } from 'react-icons/tb'
import useTranslation from '@/utils/hooks/useTranslation'
import type { EmployeeStatus } from '../EmployeeList/types'

type Props = {
    status?: EmployeeStatus | null
    onSuccess: () => void
}

type FormSchema = {
    name: string
    description: string
    color: string
}

const EmployeeStatusForm = ({ status, onSuccess }: Props) => {
    const { t } = useTranslation()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validationSchema = z.object({
        name: z.string().min(1, { message: t('employeeStatus.nameRequired', 'Name is required') }),
        description: z.string().optional().or(z.literal('')),
        color: z.string().optional().or(z.literal('')),
    })

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            name: status?.name || '',
            description: status?.description || '',
            color: status?.color || '#6b7280',
        },
        resolver: zodResolver(validationSchema) as any,
    })

    const onSubmit = async (values: FormSchema) => {
        setIsSubmitting(true)
        try {
            if (status) {
                await apiUpdateEmployeeStatus(status.id, values)
            } else {
                await apiCreateEmployeeStatus(values)
            }
            onSuccess()
        } catch {
            // error handled by interceptor
        }
        setIsSubmitting(false)
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
                <FormItem
                    label={t('employeeStatus.name', 'Name')}
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder={t('employeeStatus.name', 'Name')} {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeStatus.description', 'Description')}
                    invalid={Boolean(errors.description)}
                    errorMessage={errors.description?.message}
                >
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder={t('employeeStatus.description', 'Description')} {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeStatus.color', 'Color')}
                    invalid={Boolean(errors.color)}
                    errorMessage={errors.color?.message}
                >
                    <Controller
                        name="color"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Input
                                    type="color"
                                    className="w-12 h-10 p-1 cursor-pointer"
                                    {...field}
                                />
                                <Input
                                    placeholder="#6b7280"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                            </div>
                        )}
                    />
                </FormItem>
                <div className="flex justify-end gap-2">
                    <Button variant="solid" type="submit" loading={isSubmitting}>
                        {status ? t('common.save', 'Save') : t('common.create', 'Create')}
                    </Button>
                </div>
            </div>
        </Form>
    )
}

export default EmployeeStatusForm
