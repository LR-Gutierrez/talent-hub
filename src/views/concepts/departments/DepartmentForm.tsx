import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { FormItem, Form } from '@/components/ui/Form'
import Switcher from '@/components/ui/Switcher'
import {
    apiCreateDepartment,
    apiUpdateDepartment,
} from '@/services/DepartmentsService'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useTranslation from '@/utils/hooks/useTranslation'
import type { Department } from '@/services/DepartmentsService'

type Props = {
    department?: Department | null
    onSuccess: () => void
}

type FormSchema = {
    name: string
    description: string
    isActive: boolean
}

const DepartmentForm = ({ department, onSuccess }: Props) => {
    const { t } = useTranslation()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validationSchema = z.object({
        name: z.string().min(1, { message: t('department.nameRequired', 'Name is required') }),
        description: z.string().optional().or(z.literal('')),
        isActive: z.boolean(),
    })

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            name: department?.name || '',
            description: department?.description || '',
            isActive: department?.isActive ?? true,
        },
        resolver: zodResolver(validationSchema) as any,
    })

    const onSubmit = async (values: FormSchema) => {
        setIsSubmitting(true)
        try {
            if (department) {
                await apiUpdateDepartment(department.id, values)
            } else {
                await apiCreateDepartment(values)
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
                    label={t('department.name', 'Name')}
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder={t('department.name', 'Name')} {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('department.description', 'Description')}
                    invalid={Boolean(errors.description)}
                    errorMessage={errors.description?.message}
                >
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder={t('department.description', 'Description')} {...field} />
                        )}
                    />
                </FormItem>
                <div className="flex items-center gap-2">
                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                            <Switcher
                                checked={field.value}
                                onChange={(checked) => field.onChange(checked)}
                            />
                        )}
                    />
                    <span>{t('department.active', 'Active')}</span>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="solid" type="submit" loading={isSubmitting}>
                        {department ? t('common.save', 'Save') : t('common.create', 'Create')}
                    </Button>
                </div>
            </div>
        </Form>
    )
}

export default DepartmentForm
