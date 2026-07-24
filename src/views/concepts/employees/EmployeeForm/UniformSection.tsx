import { useEffect, useState, useMemo } from 'react'
import Select from '@/components/ui/Select'
import CollapsibleSection from '@/components/shared/CollapsibleSection'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import useTranslation from '@/utils/hooks/useTranslation'
import { TbRuler } from 'react-icons/tb'
import { apiGetCatalogs } from '@/services/CatalogsService'
import type { FormSectionBaseProps } from './types'

const UniformSection = ({ control, errors }: FormSectionBaseProps) => {
    const { t } = useTranslation()
    const [allSizes, setAllSizes] = useState<{ value: string; label: string; category: string }[]>([])

    useEffect(() => {
        apiGetCatalogs<{ list: { id: string; name: string; value: string; category: string }[] }>('/uniform-sizes').then((res) =>
            setAllSizes(res.list.map((s) => ({ value: s.value, label: s.name, category: s.category })))
        )
    }, [])

    const clothingSizes = useMemo(() => allSizes.filter((s) => s.category === 'clothing'), [allSizes])
    const shoeSizes = useMemo(() => allSizes.filter((s) => s.category === 'shoe'), [allSizes])
    const helmetSizes = useMemo(() => allSizes.filter((s) => s.category === 'helmet'), [allSizes])

    return (
        <CollapsibleSection title={t('employeeForm.uniformSizes', 'Uniform Sizes')} icon={<TbRuler />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label={t('employeeForm.shirtSize', 'Shirt')}
                    invalid={Boolean(errors.shirtSize)}
                    errorMessage={errors.shirtSize?.message}
                >
                    <Controller
                        name="shirtSize"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={t('employeeForm.selectSize', 'Select size')}
                                options={clothingSizes}
                                value={clothingSizes.find((o) => o.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                                isClearable
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.pantSize', 'Pants')}
                    invalid={Boolean(errors.pantSize)}
                    errorMessage={errors.pantSize?.message}
                >
                    <Controller
                        name="pantSize"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={t('employeeForm.selectSize', 'Select size')}
                                options={clothingSizes}
                                value={clothingSizes.find((o) => o.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                                isClearable
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.jacketSize', 'Jacket')}
                    invalid={Boolean(errors.jacketSize)}
                    errorMessage={errors.jacketSize?.message}
                >
                    <Controller
                        name="jacketSize"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={t('employeeForm.selectSize', 'Select size')}
                                options={clothingSizes}
                                value={clothingSizes.find((o) => o.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                                isClearable
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.shoeSize', 'Shoes')}
                    invalid={Boolean(errors.shoeSize)}
                    errorMessage={errors.shoeSize?.message}
                >
                    <Controller
                        name="shoeSize"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={t('employeeForm.selectSize', 'Select size')}
                                options={shoeSizes}
                                value={shoeSizes.find((o) => o.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                                isClearable
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.helmetSize', 'Helmet')}
                    invalid={Boolean(errors.helmetSize)}
                    errorMessage={errors.helmetSize?.message}
                >
                    <Controller
                        name="helmetSize"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={t('employeeForm.selectSize', 'Select size')}
                                options={helmetSizes}
                                value={helmetSizes.find((o) => o.value === field.value)}
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

export default UniformSection
