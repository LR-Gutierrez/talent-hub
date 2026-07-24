import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import PatternInput from '@/components/shared/PatternInput'
import CollapsibleSection from '@/components/shared/CollapsibleSection'
import { FormItem, Form } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import useTranslation from '@/utils/hooks/useTranslation'
import { useState, useEffect, useMemo } from 'react'
import { TbUser } from 'react-icons/tb'
import type { FormSectionBaseProps } from './types'

type DocIdProps = {
    value?: string
    onChange: (value: string) => void
}

const DocumentIdInput = ({ value = '', onChange }: DocIdProps) => {
    const parse = (val: string) => {
        const p = /^[VvEe]/.test(val) ? val.charAt(0).toUpperCase() : 'V'
        const d = val.replace(/[^0-9]/g, '')
        return { prefix: p, digits: d }
    }
    const initial = parse(value)
    const [prefix, setPrefix] = useState(initial.prefix)
    const [digits, setDigits] = useState(initial.digits)

    useEffect(() => {
        const parsed = parse(value)
        setPrefix(parsed.prefix)
        setDigits(parsed.digits)
    }, [value])

    const emit = (p: string, d: string) => onChange(p + d)

    return (
        <div className="flex gap-0">
            <Select
                options={[
                    { value: 'V', label: 'V-' },
                    { value: 'E', label: 'E-' },
                ]}
                value={{ value: prefix, label: prefix + '-' }}
                onChange={(option) => {
                    const p = option?.value || 'V'
                    setPrefix(p)
                    emit(p, digits)
                }}
                isSearchable={false}
                className="w-20"
            />
            <PatternInput
                format="##.###.###"
                placeholder="12.345.678"
                value={digits}
                onValueChange={(vals) => {
                    setDigits(vals.value)
                    emit(prefix, vals.value)
                }}
                className="flex-1"
            />
        </div>
    )
}

const PersonalSection = ({ control, errors }: FormSectionBaseProps) => {
    const { t } = useTranslation()

    const genderOptions = useMemo(() => [
        { value: 'male', label: t('gender.male', 'Male') },
        { value: 'female', label: t('gender.female', 'Female') },
        { value: 'other', label: t('gender.other', 'Other') },
    ], [t])

    return (
        <CollapsibleSection title={t('employeeForm.personalInfo', 'Personal Information')} icon={<TbUser />}>
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
                            <Input
                                placeholder={t(
                                    'employeeForm.fullName',
                                    'Full Name',
                                )}
                                {...field}
                            />
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
                            <PatternInput
                                format="+### ### ### ###"
                                placeholder={t('employeeForm.phone', 'Phone')}
                                value={field.value}
                                onValueChange={(vals) =>
                                    field.onChange(vals.value)
                                }
                            />
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
                            <DocumentIdInput
                                value={field.value}
                                onChange={field.onChange}
                            />
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
                        render={({ field }) => <Input type="date" {...field} />}
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
                                placeholder={t(
                                    'employeeForm.selectGender',
                                    'Select gender',
                                )}
                                options={genderOptions}
                                value={genderOptions.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
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
                                    placeholder={t(
                                        'employeeForm.address',
                                        'Address',
                                    )}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>
            </div>
        </CollapsibleSection>
    )
}

export default PersonalSection
