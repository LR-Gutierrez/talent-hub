import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem, Form } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import useTranslation from '@/utils/hooks/useTranslation'
import type { FormSectionBaseProps } from './types'

const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
]

const PersonalSection = ({ control, errors }: FormSectionBaseProps) => {
    const { t } = useTranslation()

    return (
        <Card>
            <h4 className="mb-6">{t('employeeForm.personalInfo', 'Personal Information')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label={t('employeeForm.fullName', 'Full Name')}
                    invalid={Boolean(errors.fullName)}
                    errorMessage={errors.fullName?.message}
                >
                    <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder={t('employeeForm.fullName', 'Full Name')} {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.email', 'Email')}
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input type="email" placeholder={t('employeeForm.email', 'Email')} {...field} />
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
                            <Input placeholder={t('employeeForm.phone', 'Phone')} {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.documentId', 'Document ID')}
                    invalid={Boolean(errors.documentId)}
                    errorMessage={errors.documentId?.message}
                >
                    <Controller
                        name="documentId"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder={t('employeeForm.documentId', 'Document ID')} {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.birthDate', 'Birth Date')}
                    invalid={Boolean(errors.birthDate)}
                    errorMessage={errors.birthDate?.message}
                >
                    <Controller
                        name="birthDate"
                        control={control}
                        render={({ field }) => (
                            <Input type="date" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.gender', 'Gender')}
                    invalid={Boolean(errors.gender)}
                    errorMessage={errors.gender?.message}
                >
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={t('employeeForm.selectGender', 'Select gender')}
                                options={genderOptions}
                                value={genderOptions.find((o) => o.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
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
                                <Input placeholder={t('employeeForm.address', 'Address')} {...field} />
                            )}
                        />
                    </FormItem>
                </div>
            </div>
        </Card>
    )
}

export default PersonalSection
