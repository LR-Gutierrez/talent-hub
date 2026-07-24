import { useEffect, useState } from 'react'
import Select from '@/components/ui/Select'
import CollapsibleSection from '@/components/shared/CollapsibleSection'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import useTranslation from '@/utils/hooks/useTranslation'
import { TbMapPin } from 'react-icons/tb'
import { apiGetCatalogs } from '@/services/CatalogsService'
import type { FormSectionBaseProps } from './types'

const DemographicSection = ({ control, errors }: FormSectionBaseProps) => {
    const { t } = useTranslation()
    const [maritalStatuses, setMaritalStatuses] = useState<{ value: string; label: string }[]>([])
    const [countries, setCountries] = useState<{ value: string; label: string }[]>([])

    useEffect(() => {
        apiGetCatalogs<{ list: { id: string; name: string; value: string }[] }>('/marital-statuses').then((res) =>
            setMaritalStatuses(res.list.map((m) => ({ value: m.value, label: m.name })))
        )
        apiGetCatalogs<{ list: { id: string; name: string; value: string }[] }>('/countries').then((res) =>
            setCountries(res.list.map((c) => ({ value: c.value, label: c.name })))
        )
    }, [])

    return (
        <CollapsibleSection title={t('employeeForm.demographicInfo', 'Demographic Information')} icon={<TbMapPin />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                placeholder={t('employeeForm.selectNationality', 'Select nationality')}
                                options={countries}
                                value={countries.find((o) => o.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                                isClearable
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
                                    placeholder={t('employeeForm.selectPlaceOfBirth', 'Select country')}
                                    options={countries}
                                    value={countries.find((o) => o.value === field.value)}
                                    onChange={(option) => field.onChange(option?.value)}
                                    isClearable
                                />
                            )}
                        />
                    </FormItem>
                </div>
            </div>
        </CollapsibleSection>
    )
}

export default DemographicSection
