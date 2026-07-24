import { useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import CollapsibleSection from '@/components/shared/CollapsibleSection'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import useTranslation from '@/utils/hooks/useTranslation'
import { TbSchool } from 'react-icons/tb'
import { apiGetCatalogs } from '@/services/CatalogsService'
import type { FormSectionBaseProps } from './types'

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 60 }, (_, i) => {
    const year = String(currentYear - i)
    return { value: year, label: year }
})

const EducationSection = ({ control, errors }: FormSectionBaseProps) => {
    const { t } = useTranslation()
    const [educationLevels, setEducationLevels] = useState<{ value: string; label: string }[]>([])
    const [degrees, setDegrees] = useState<{ value: string; label: string }[]>([])

    useEffect(() => {
        apiGetCatalogs<{ list: { id: string; name: string; value: string }[] }>('/education-levels').then((res) =>
            setEducationLevels(res.list.map((e) => ({ value: e.value, label: e.name })))
        )
        apiGetCatalogs<{ list: { id: string; name: string; value: string }[] }>('/employee-degrees').then((res) =>
            setDegrees(res.list.map((d) => ({ value: d.value, label: d.name })))
        )
    }, [])

    return (
        <CollapsibleSection title={t('employeeForm.educationInfo', 'Education')} icon={<TbSchool />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label={t('employeeForm.educationLevel', 'Education Level')}
                    invalid={Boolean(errors.educationLevel)}
                    errorMessage={errors.educationLevel?.message}
                >
                    <Controller
                        name="educationLevel"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={t('employeeForm.selectEducationLevel', 'Select level')}
                                options={educationLevels}
                                value={educationLevels.find((o) => o.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                                isClearable
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.degree', 'Degree / Title')}
                    invalid={Boolean(errors.degree)}
                    errorMessage={errors.degree?.message}
                >
                    <Controller
                        name="degree"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={t('employeeForm.selectDegree', 'Select degree')}
                                options={degrees}
                                value={degrees.find((o) => o.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                                isClearable
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.institution', 'Institution')}
                    invalid={Boolean(errors.institution)}
                    errorMessage={errors.institution?.message}
                >
                    <Controller
                        name="institution"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder={t('employeeForm.institution', 'Institution')} {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.graduationYear', 'Graduation Year')}
                    invalid={Boolean(errors.graduationYear)}
                    errorMessage={errors.graduationYear?.message}
                >
                    <Controller
                        name="graduationYear"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={t('employeeForm.selectYear', 'Select year')}
                                options={yearOptions}
                                value={yearOptions.find((o) => o.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                                isClearable
                            />
                        )}
                    />
                </FormItem>
            </div>
        </CollapsibleSection>
    )
}

export default EducationSection
