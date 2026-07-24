import { useState, useEffect, useMemo } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import PatternInput from '@/components/shared/PatternInput'
import { FormItem } from '@/components/ui/Form'
import { Controller, useWatch } from 'react-hook-form'
import useTranslation from '@/utils/hooks/useTranslation'
import dayjs from 'dayjs'
import i18n from 'i18next'
import { apiGetCatalogs } from '@/services/CatalogsService'
import type { FormSectionBaseProps } from './types'

const VenezuelanDocInput = ({
    value = '',
    onChange,
}: {
    value: string
    onChange: (v: string) => void
}) => {
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
                className="w-22 mr-2"
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

const BasicInfoSection = ({ control, errors }: FormSectionBaseProps) => {
    const { t } = useTranslation()

    const nationality = useWatch({ control, name: 'nationality' })
    const birthDate = useWatch({ control, name: 'birthDate' })

    const isVenezuelan = nationality === 'VE'

    const age = birthDate ? dayjs().diff(dayjs(birthDate), 'year') : null

    const [countries, setCountries] = useState<
        { value: string; label: string }[]
    >([])

    const [maritalStatuses, setMaritalStatuses] = useState<
        { value: string; label: string }[]
    >([])

    useEffect(() => {
        const locale = i18n.language
        apiGetCatalogs<{ list: { id: string; name: string; value: string; displayName?: string }[] }>(
            '/countries', { locale },
        ).then((res) =>
            setCountries(
                res.list.map((c) => ({ value: c.value, label: c.displayName ?? c.name })),
            ),
        )
        apiGetCatalogs<{ list: { id: string; name: string; value: string; displayName?: string }[] }>(
            '/marital-statuses', { locale },
        ).then((res) =>
            setMaritalStatuses(
                res.list.map((m) => ({ value: m.value, label: m.displayName ?? m.name })),
            ),
        )
    }, [i18n.language])

    const genderOptions = useMemo(
        () => [
            { value: 'male', label: t('gender.male', 'Male') },
            { value: 'female', label: t('gender.female', 'Female') },
            { value: 'other', label: t('gender.other', 'Other') },
        ],
        [t],
    )

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h5 className="mb-4">
                {t('employeeForm.personalInfo', 'Personal Information')}
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
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
                </div>
                <FormItem
                    label={t('employeeForm.nationality', 'Nationality')}
                    invalid={Boolean(errors.nationality)}
                    errorMessage={errors.nationality?.message}
                >
                    <Controller
                        name="nationality"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={t(
                                    'employeeForm.selectNationality',
                                    'Select nationality',
                                )}
                                options={countries}
                                value={countries.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                                isClearable
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
                        render={({ field }) =>
                            isVenezuelan ? (
                                <VenezuelanDocInput
                                    value={field.value ?? ''}
                                    onChange={field.onChange}
                                />
                            ) : (
                                <Input
                                    placeholder={t(
                                        'employeeForm.documentIdForeign',
                                        'Passport / ID number',
                                    )}
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value.toUpperCase(),
                                        )
                                    }
                                />
                            )
                        }
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
                <FormItem label={t('employeeForm.age', 'Age')}>
                    <Input value={age !== null ? String(age) : ''} disabled />
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
                <FormItem
                    label={t('employeeForm.maritalStatus', 'Marital Status')}
                    invalid={Boolean(errors.maritalStatus)}
                    errorMessage={errors.maritalStatus?.message}
                >
                    <Controller
                        name="maritalStatus"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={t('employeeForm.selectMaritalStatus', 'Select status')}
                                options={maritalStatuses}
                                value={maritalStatuses.find((o) => o.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                                isClearable
                            />
                        )}
                    />
                </FormItem>
                <div className="md:col-span-2">
                    <FormItem
                        label={t('employeeForm.placeOfBirth', 'Place of Birth')}
                        invalid={Boolean(errors.placeOfBirth)}
                        errorMessage={errors.placeOfBirth?.message}
                    >
                        <Controller
                            name="placeOfBirth"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder={t(
                                        'employeeForm.selectPlaceOfBirth',
                                        'Select country',
                                    )}
                                    options={countries}
                                    value={countries.find(
                                        (o) => o.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                    isClearable
                                />
                            )}
                        />
                    </FormItem>
                </div>
            </div>
        </div>
    )
}

export default BasicInfoSection
