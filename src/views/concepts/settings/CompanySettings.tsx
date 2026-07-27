import { useEffect, useState } from 'react'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormItem, Form } from '@/components/ui/Form'
import {
    apiGetCompanySettings,
    apiUpdateCompanySettings,
    apiUploadCompanyLogo,
    apiUploadCompanyFavicon,
    setCachedCompanySettings,
} from '@/services/CompanySettingsService'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useTranslation from '@/utils/hooks/useTranslation'
import { TbUpload } from 'react-icons/tb'
import type { CompanySettings } from '@/services/CompanySettingsService'

const timezoneOptions = [
    { value: 'America/Caracas', label: 'America/Caracas (VET)' },
    { value: 'America/New_York', label: 'America/New_York (EST)' },
    { value: 'America/Argentina/Buenos_Aires', label: 'America/Argentina/Buenos_Aires (ART)' },
    { value: 'America/Bogota', label: 'America/Bogota (COT)' },
    { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (BRT)' },
    { value: 'America/Santiago', label: 'America/Santiago (CLT)' },
    { value: 'America/Mexico_City', label: 'America/Mexico_City (CST)' },
    { value: 'America/Lima', label: 'America/Lima (PET)' },
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

    const [logoUrl, setLogoUrl] = useState<string>('')
    const [faviconUrl, setFaviconUrl] = useState<string>('')
    const [uploadingLogo, setUploadingLogo] = useState(false)
    const [uploadingFavicon, setUploadingFavicon] = useState(false)

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
            timezone: 'America/Caracas',
            dateFormat: 'DD/MM/YYYY',
            currency: 'USD',
            defaultLang: 'es',
        },
        resolver: zodResolver(validationSchema) as any,
    })

    useEffect(() => {
        apiGetCompanySettings<CompanySettings>().then((data) => {
            setCachedCompanySettings(data)
            reset({
                companyName: data.companyName || '',
                companyRuc: data.companyRuc || '',
                companyAddress: data.companyAddress || '',
                companyPhone: data.companyPhone || '',
                companyEmail: data.companyEmail || '',
                timezone: data.timezone || 'America/Caracas',
                dateFormat: data.dateFormat || 'DD/MM/YYYY',
                currency: data.currency || 'USD',
                defaultLang: data.defaultLang || 'es',
            })
            setLogoUrl(data.companyLogo || '')
            setFaviconUrl(data.favicon || '')
            setLoading(false)
        })
    }, [])

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploadingLogo(true)
        try {
            const { companyLogo } = await apiUploadCompanyLogo(file)
            setLogoUrl(companyLogo)
            apiGetCompanySettings<CompanySettings>().then(setCachedCompanySettings)
            toast.push(<Notification type="success">{t('settings.logoUploaded', 'Logo uploaded!')}</Notification>, {
                placement: 'top-center',
            })
        } catch {
            toast.push(<Notification type="danger">{t('settings.failedToUpload', 'Upload failed')}</Notification>, {
                placement: 'top-center',
            })
        }
        setUploadingLogo(false)
        e.target.value = ''
    }

    const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploadingFavicon(true)
        try {
            const { favicon } = await apiUploadCompanyFavicon(file)
            setFaviconUrl(favicon)
            const link = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement
            if (link) link.href = favicon
            apiGetCompanySettings<CompanySettings>().then(setCachedCompanySettings)
            toast.push(<Notification type="success">{t('settings.faviconUploaded', 'Favicon uploaded!')}</Notification>, {
                placement: 'top-center',
            })
        } catch {
            toast.push(<Notification type="danger">{t('settings.failedToUpload', 'Upload failed')}</Notification>, {
                placement: 'top-center',
            })
        }
        setUploadingFavicon(false)
        e.target.value = ''
    }

    const onSubmit = async (values: FormSchema) => {
        setIsSubmitting(true)
        try {
            await apiUpdateCompanySettings(values)
            apiGetCompanySettings<CompanySettings>().then(setCachedCompanySettings)
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
                        <h4 className="mb-6">{t('settings.branding', 'Branding')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-3">
                                <label className="font-medium">{t('settings.companyLogo', 'Company Logo')}</label>
                                <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center gap-3">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Logo" className="max-h-20 object-contain" />
                                    ) : (
                                        <div className="h-20 flex items-center text-gray-400">{t('settings.noLogo', 'No logo')}</div>
                                    )}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="default"
                                            size="sm"
                                            icon={<TbUpload />}
                                            loading={uploadingLogo}
                                            onClick={() => document.getElementById('logo-input')?.click()}
                                        >
                                            {t('settings.uploadLogo', 'Upload Logo')}
                                        </Button>
                                    </div>
                                    <input
                                        id="logo-input"
                                        type="file"
                                        accept="image/png,image/jpeg,image/gif,image/webp"
                                        className="hidden"
                                        onChange={handleLogoUpload}
                                    />
                                    <p className="text-xs text-gray-400">{t('settings.logoHint', 'Recommended: PNG or SVG, max 5MB')}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="font-medium">{t('settings.faviconLabel', 'Favicon')}</label>
                                <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center gap-3">
                                    {faviconUrl ? (
                                        <img src={faviconUrl} alt="Favicon" className="h-12 w-12 object-contain" />
                                    ) : (
                                        <div className="h-12 flex items-center text-gray-400">{t('settings.noFavicon', 'No favicon')}</div>
                                    )}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="default"
                                            size="sm"
                                            icon={<TbUpload />}
                                            loading={uploadingFavicon}
                                            onClick={() => document.getElementById('favicon-input')?.click()}
                                        >
                                            {t('settings.uploadFavicon', 'Upload Favicon')}
                                        </Button>
                                    </div>
                                    <input
                                        id="favicon-input"
                                        type="file"
                                        accept="image/png,image/x-icon,image/gif,image/webp"
                                        className="hidden"
                                        onChange={handleFaviconUpload}
                                    />
                                    <p className="text-xs text-gray-400">{t('settings.faviconHint', 'Recommended: ICO or PNG, max 1MB')}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

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
