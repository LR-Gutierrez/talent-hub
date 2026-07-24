import { useCallback, useMemo } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import CollapsibleSection from '@/components/shared/CollapsibleSection'
import { FormItem } from '@/components/ui/Form'
import { Controller, useFieldArray } from 'react-hook-form'
import useTranslation from '@/utils/hooks/useTranslation'
import { TbUsers, TbTrash, TbPlus } from 'react-icons/tb'
import type { FormSectionBaseProps } from './types'

const ChildrenSection = ({ control, errors }: FormSectionBaseProps) => {
    const { t } = useTranslation()
    const { fields, append, remove } = useFieldArray({ control, name: 'children' })

    const genderOptions = useMemo(() => [
        { value: 'male', label: t('gender.male', 'Male') },
        { value: 'female', label: t('gender.female', 'Female') },
        { value: 'other', label: t('gender.other', 'Other') },
    ], [t])

    const handleAdd = useCallback(() => {
        append({ name: '', birthDate: '', gender: '' })
    }, [append])

    return (
        <CollapsibleSection title={t('employeeForm.children', 'Children')} icon={<TbUsers />}>
            <div className="flex flex-col gap-4">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
                    >
                        <FormItem
                            label={t('employeeForm.childName', 'Name')}
                            invalid={Boolean(errors.children?.[index]?.name)}
                            errorMessage={errors.children?.[index]?.name?.message}
                        >
                            <Controller
                                name={`children.${index}.name`}
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder={t('employeeForm.childName', 'Name')}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t('employeeForm.childBirthDate', 'Birth Date')}
                            invalid={Boolean(errors.children?.[index]?.birthDate)}
                            errorMessage={errors.children?.[index]?.birthDate?.message}
                        >
                            <Controller
                                name={`children.${index}.birthDate`}
                                control={control}
                                render={({ field }) => (
                                    <Input type="date" {...field} />
                                )}
                            />
                        </FormItem>
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <FormItem
                                    label={t('employeeForm.childGender', 'Gender')}
                                    invalid={Boolean(errors.children?.[index]?.gender)}
                                    errorMessage={errors.children?.[index]?.gender?.message}
                                >
                                    <Controller
                                        name={`children.${index}.gender`}
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                placeholder={t('employeeForm.selectGender', 'Select gender')}
                                                options={genderOptions}
                                                value={genderOptions.find((o) => o.value === field.value)}
                                                onChange={(option) => field.onChange(option?.value)}
                                                isClearable
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>
                            <Button
                                type="button"
                                size="sm"
                                variant="default"
                                onClick={() => remove(index)}
                                className="mb-1"
                            >
                                <TbTrash className="text-red-500" />
                            </Button>
                        </div>
                    </div>
                ))}
                <Button type="button" size="sm" variant="solid" onClick={handleAdd} className="self-start">
                    <TbPlus className="mr-1" />
                    {t('employeeForm.addChild', 'Add Child')}
                </Button>
            </div>
        </CollapsibleSection>
    )
}

export default ChildrenSection
