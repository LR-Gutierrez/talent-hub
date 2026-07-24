import Input from '@/components/ui/Input'
import PhoneNumberInput from '@/components/shared/PhoneNumberInput'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import useTranslation from '@/utils/hooks/useTranslation'
import type { FormSectionBaseProps } from './types'

const ContactSection = ({ control, errors }: FormSectionBaseProps) => {
    const { t } = useTranslation()

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h5 className="mb-4">{t('employeeForm.contactInfo', 'Contact Information')}</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label={t('employeeForm.email', 'Email')}
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                placeholder={t('employeeForm.email', 'Email')}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.phone', 'Phone')}
                    invalid={Boolean(errors.phone)}
                    errorMessage={errors.phone?.message}
                >
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <PhoneNumberInput
                                defaultCountry="VE"
                                placeholder={t('employeeForm.phone', 'Phone')}
                                value={field.value || undefined}
                                onChange={(val) => field.onChange(val || '')}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.phoneExtension', 'Phone Ext.')}
                    invalid={Boolean(errors.phoneExtension)}
                    errorMessage={errors.phoneExtension?.message}
                >
                    <Controller
                        name="phoneExtension"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder={t('employeeForm.phoneExtension', 'Phone Ext.')}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.corporatePhone', 'Corporate Phone')}
                    invalid={Boolean(errors.corporatePhone)}
                    errorMessage={errors.corporatePhone?.message}
                >
                    <Controller
                        name="corporatePhone"
                        control={control}
                        render={({ field }) => (
                            <PhoneNumberInput
                                defaultCountry="VE"
                                placeholder={t('employeeForm.corporatePhone', 'Corporate Phone')}
                                value={field.value || undefined}
                                onChange={(val) => field.onChange(val || '')}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.mobilePhone', 'Mobile Phone')}
                    invalid={Boolean(errors.mobilePhone)}
                    errorMessage={errors.mobilePhone?.message}
                >
                    <Controller
                        name="mobilePhone"
                        control={control}
                        render={({ field }) => (
                            <PhoneNumberInput
                                defaultCountry="VE"
                                placeholder={t('employeeForm.mobilePhone', 'Mobile Phone')}
                                value={field.value || undefined}
                                onChange={(val) => field.onChange(val || '')}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.satellitePhone', 'Satellite Phone')}
                    invalid={Boolean(errors.satellitePhone)}
                    errorMessage={errors.satellitePhone?.message}
                >
                    <Controller
                        name="satellitePhone"
                        control={control}
                        render={({ field }) => (
                            <PhoneNumberInput
                                defaultCountry="VE"
                                placeholder={t('employeeForm.satellitePhone', 'Satellite Phone')}
                                value={field.value || undefined}
                                onChange={(val) => field.onChange(val || '')}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.roomPhone', 'Room Phone')}
                    invalid={Boolean(errors.roomPhone)}
                    errorMessage={errors.roomPhone?.message}
                >
                    <Controller
                        name="roomPhone"
                        control={control}
                        render={({ field }) => (
                            <PhoneNumberInput
                                defaultCountry="VE"
                                placeholder={t('employeeForm.roomPhone', 'Room Phone')}
                                value={field.value || undefined}
                                onChange={(val) => field.onChange(val || '')}
                            />
                        )}
                    />
                </FormItem>
                <div className="md:col-span-2">
                    <FormItem
                        label={t('employeeForm.address', 'Address')}
                        invalid={Boolean(errors.address)}
                        errorMessage={errors.address?.message}
                    >
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder={t('employeeForm.address', 'Address')}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>
            </div>
        </div>
    )
}

export default ContactSection
