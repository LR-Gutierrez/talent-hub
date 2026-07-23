import { useEffect, useState } from 'react'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormItem, Form } from '@/components/ui/Form'
import { apiGetCompanySettings, apiUpdateCompanySettings } from '@/services/CompanySettingsService'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useTranslation from '@/utils/hooks/useTranslation'
import type { CompanySettings } from '@/services/CompanySettingsService'

const timezoneOptions = [
    { value: 'America/Asuncion', label: 'America/Asuncion (PYT)' },
    { value: 'America/New_York', label: 'America/New_York (EST)' },
    { value: 'America/Argentina/Buenos_Aires', label: 'America/Argentina/Buenos_Aires (ART)' },
    { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (BRT)' },
    { value: 'Europe/Madrid', label: 'Europe/Madrid (CET)' },
    { value: 'UTC', label: 'UTC' },
]

const dateFormatOptions = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
]

const currencyOptions = [
    { value: 'PYG', label: 'PYG - Guaraní paraguayo' },
    { value: 'USD', label: 'USD - Dólar americano' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'ARS', label: 'ARS - Peso argentino' },
    { value: 'BRL', label: 'BRL - Real brasileño' },
]

const langOptions = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'it', label: 'Italiano' },
]

type FormSchema = {
    companyName: string
    companyRuc: string
    companyAddress: string
    companyPhone: string
    companyEmail: string
    timezone: string
    dateFormat: string
    currency: string
    defaultLang: string
}

const CompanySettings = () => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validationSchema = z.object({
        companyName: z.string().min(1, { message: t('settings.companyNameRequired', 'Company name is required') }),
        companyRuc: z.string().optional().or(z.literal('')),
        companyAddress: z.string().optional().or(z.literal('')),
        companyPhone: z.string().optional().or(z.literal('')),
        companyEmail: z.string().optional().or(z.literal('')),
        timezone: z.string().optional().or(z.literal('')),
        dateFormat: z.string().optional().or(z.literal('')),
        currency: z.string().optional().or(z.literal('')),
        defaultLang: z.string().optional().or(z.literal('')),
    })

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            companyName: '',
            companyRuc: '',
            companyAddress: '',
            companyPhone: '',
            companyEmail: '',
            timezone: 'America/Asuncion',
            dateFormat: 'DD/MM/YYYY',
            currency: 'PYG',
            defaultLang: 'es',
        },
        resolver: zodResolver(validationSchema) as any,
    })

    useEffect(() => {
        apiGetCompanySettings<CompanySettings>().then((data) => {
            reset({
                companyName: data.companyName || '',
                companyRuc: data.companyRuc || '',
                companyAddress: data.companyAddress || '',
                companyPhone: data.companyPhone || '',
                companyEmail: data.companyEmail || '',
                timezone: data.timezone || 'America/Asuncion',
                dateFormat: data.dateFormat || 'DD/MM/YYYY',
                currency: data.currency || 'PYG',
                defaultLang: data.defaultLang || 'es',
            })
            setLoading(false)
        })
    }, [])

    const onSubmit = async (values: FormSchema) => {
        setIsSubmitting(true)
        try {
            toast.push(<Notification type="success">{t('settings.saved', 'Settings saved!')}</Notification>, {
                placement: 'top-center',
            })
        } catch {
            toast.push(<Notification type="danger">{t('settings.failedToSave', 'Failed to save settings')}</Notification>, {
                placement: 'top-center',
            })
        }
        setIsSubmitting(false)
    }

    if (loading) return <div />

    return (
        <Container>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                    <Card>
                        <h4 className="mb-6">{t('settings.companyInfo', 'Company Information')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormItem
                                label={t('settings.companyName', 'Company Name')}
                                invalid={Boolean(errors.companyName)}
                                errorMessage={errors.companyName?.message}
                            >
                                <Controller
                                    name="companyName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input placeholder={t('settings.companyName', 'Company Name')} {...field} />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                label={t('settings.companyRuc', 'RUC / Tax ID')}
                                invalid={Boolean(errors.companyRuc)}
                                errorMessage={errors.companyRuc?.message}
                            >
                                <Controller
                                    name="companyRuc"
                                    control={control}
                                    render={({ field }) => (
                                        <Input placeholder={t('settings.companyRuc', 'RUC / Tax ID')} {...field} />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                label={t('settings.companyPhone', 'Phone')}
                                invalid={Boolean(errors.companyPhone)}
                                errorMessage={errors.companyPhone?.message}
                            >
                                <Controller
                                    name="companyPhone"
                                    control={control}
                                    render={({ field }) => (
                                        <Input placeholder={t('settings.companyPhone', 'Phone')} {...field} />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                label={t('settings.companyEmail', 'Email')}
                                invalid={Boolean(errors.companyEmail)}
                                errorMessage={errors.companyEmail?.message}
                            >
                                <Controller
                                    name="companyEmail"
                                    control={control}
                                    render={({ field }) => (
                                        <Input type="email" placeholder={t('settings.companyEmail', 'Email')} {...field} />
                                    )}
                                />
                            </FormItem>
                            <div className="md:col-span-2">
                                <FormItem
                                    label={t('settings.companyAddress', 'Address')}
                                    invalid={Boolean(errors.companyAddress)}
                                    errorMessage={errors.companyAddress?.message}
                                >
                                    <Controller
                                        name="companyAddress"
                                        control={control}
                                        render={({ field }) => (
                                            <Input placeholder={t('settings.companyAddress', 'Address')} {...field} />
                                        )}
                                    />
                                </FormItem>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h4 className="mb-6">{t('settings.systemConfig', 'System Configuration')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormItem
                                label={t('settings.timezone', 'Timezone')}
                                invalid={Boolean(errors.timezone)}
                                errorMessage={errors.timezone?.message}
                            >
                                <Controller
                                    name="timezone"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={timezoneOptions}
                                            value={timezoneOptions.find((o) => o.value === field.value)}
                                            onChange={(option) => field.onChange(option?.value)}
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                label={t('settings.dateFormat', 'Date Format')}
                                invalid={Boolean(errors.dateFormat)}
                                errorMessage={errors.dateFormat?.message}
                            >
                                <Controller
                                    name="dateFormat"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={dateFormatOptions}
                                            value={dateFormatOptions.find((o) => o.value === field.value)}
                                            onChange={(option) => field.onChange(option?.value)}
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                label={t('settings.currency', 'Currency')}
                                invalid={Boolean(errors.currency)}
                                errorMessage={errors.currency?.message}
                            >
                                <Controller
                                    name="currency"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={currencyOptions}
                                            value={currencyOptions.find((o) => o.value === field.value)}
                                            onChange={(option) => field.onChange(option?.value)}
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                label={t('settings.defaultLang', 'Default Language')}
                                invalid={Boolean(errors.defaultLang)}
                                errorMessage={errors.defaultLang?.message}
                            >
                                <Controller
                                    name="defaultLang"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={langOptions}
                                            value={langOptions.find((o) => o.value === field.value)}
                                            onChange={(option) => field.onChange(option?.value)}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                    </Card>

                    <div className="flex justify-end">
                        <Button variant="solid" type="submit" loading={isSubmitting}>
                            {t('common.save', 'Save')}
                        </Button>
                    </div>
                </div>
            </Form>
        </Container>
    )
}

export default CompanySettings
