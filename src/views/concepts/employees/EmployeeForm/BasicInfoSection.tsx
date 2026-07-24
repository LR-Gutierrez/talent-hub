import { useState, useEffect } from 'react'
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
                className="w-22 mr-2"
                isSearchable={false}
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
            />
            <PatternInput
                className="flex-1"
                format="##.###.###"
                placeholder="12.345.678"
                value={digits}
                onValueChange={(vals) => {
                    setDigits(vals.value)
                    emit(prefix, vals.value)
                }}
            />
        </div>
    )
}

type CatalogOption = { value: string; label: string }

const BasicInfoSection = ({ control, errors }: FormSectionBaseProps) => {
    const { t } = useTranslation()

    const nationalityId = useWatch({ control, name: 'nationalityId' })
    const birthDate = useWatch({ control, name: 'birthDate' })

    const age = birthDate ? dayjs().diff(dayjs(birthDate), 'year') : null

    const [countries, setCountries] = useState<CatalogOption[]>([])
    const [countriesMap, setCountriesMap] = useState<Record<string, string>>({})
    const [maritalStatuses, setMaritalStatuses] = useState<CatalogOption[]>([])
    const [genders, setGenders] = useState<CatalogOption[]>([])

    useEffect(() => {
        const locale = i18n.language
        apiGetCatalogs<{ list: { id: string; name: string; value: string; displayName?: string }[] }>(
            '/countries', { locale },
        ).then((res) => {
            const map: Record<string, string> = {}
            const opts = res.list.map((c) => {
                map[c.value] = c.id
                return { value: c.id, label: c.displayName ?? c.name }
            })
            setCountries(opts)
            setCountriesMap(map)
        })
        apiGetCatalogs<{ list: { id: string; name: string; value: string; displayName?: string }[] }>(
            '/marital-statuses', { locale },
        ).then((res) =>
            setMaritalStatuses(
                res.list.map((m) => ({ value: m.id, label: m.displayName ?? m.name })),
            ),
        )
        apiGetCatalogs<{ list: { id: string; name: string; value: string; displayName?: string }[] }>(
            '/genders', { locale },
        ).then((res) =>
            setGenders(
                res.list.map((g) => ({ value: g.id, label: g.displayName ?? g.name })),
            ),
        )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language])

    const isVenezuelan = nationalityId === countriesMap['VE']

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
                    invalid={Boolean(errors.nationalityId)}
                    errorMessage={errors.nationalityId?.message}
                >
                    <Controller
                        name="nationalityId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                isClearable
                                options={countries}
                                placeholder={t(
                                    'employeeForm.selectNationality',
                                    'Select nationality',
                                )}
                                value={countries.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value ?? '')
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
                        render={({ field }) =>
                            isVenezuelan ? (
                                <VenezuelanDocInput
                                    value={field.value ?? ''}
                                    onChange={field.onChange}
                                />
                            ) : (
                                <Input
                                    {...field}
                                    placeholder={t(
                                        'employeeForm.documentIdForeign',
                                        'Passport / ID number',
                                    )}
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
                    <Input disabled value={age !== null ? String(age) : ''} />
                </FormItem>
                <FormItem
                    label={t('employeeForm.gender', 'Gender')}
                    invalid={Boolean(errors.genderId)}
                    errorMessage={errors.genderId?.message}
                >
                    <Controller
                        name="genderId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={genders}
                                placeholder={t(
                                    'employeeForm.selectGender',
                                    'Select gender',
                                )}
                                value={genders.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value ?? '')
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.maritalStatus', 'Marital Status')}
                    invalid={Boolean(errors.maritalStatusId)}
                    errorMessage={errors.maritalStatusId?.message}
                >
                    <Controller
                        name="maritalStatusId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                isClearable
                                options={maritalStatuses}
                                placeholder={t('employeeForm.selectMaritalStatus', 'Select status')}
                                value={maritalStatuses.find((o) => o.value === field.value)}
                                onChange={(option) => field.onChange(option?.value ?? '')}
                            />
                        )}
                    />
                </FormItem>
                <div className="md:col-span-2">
                    <FormItem
                        label={t('employeeForm.placeOfBirth', 'Place of Birth')}
                        invalid={Boolean(errors.placeOfBirthId)}
                        errorMessage={errors.placeOfBirthId?.message}
                    >
                        <Controller
                            name="placeOfBirthId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    isClearable
                                    options={countries}
                                    placeholder={t(
                                        'employeeForm.selectPlaceOfBirth',
                                        'Select country',
                                    )}
                                    value={countries.find(
                                        (o) => o.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option?.value ?? '')
                                    }
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
