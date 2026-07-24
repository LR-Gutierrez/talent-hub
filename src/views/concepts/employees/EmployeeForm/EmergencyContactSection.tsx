import { useCallback } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PhoneNumberInput from '@/components/shared/PhoneNumberInput'
import CollapsibleSection from '@/components/shared/CollapsibleSection'
import { Controller, useFieldArray } from 'react-hook-form'
import useTranslation from '@/utils/hooks/useTranslation'
import { TbPhoneCall, TbTrash, TbPlus } from 'react-icons/tb'
import type { FormSectionBaseProps } from './types'

const FieldError = ({ message }: { message?: string }) =>
    message ? <span className="text-red-500 text-xs mt-1 block">{message}</span> : null

const EmergencyContactSection = ({ control, errors }: FormSectionBaseProps) => {
    const { t } = useTranslation()
    const { fields, append, remove } = useFieldArray({ control, name: 'emergencyContacts' })

    const handleAdd = useCallback(() => {
        append({ name: '', phone: '', relationship: '' })
    }, [append])

    return (
        <CollapsibleSection title={t('employeeForm.emergencyContacts', 'Emergency Contacts')} icon={<TbPhoneCall />}>
            <div className="flex flex-col gap-4">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-2">
                            <span className="text-sm font-semibold">{t('employeeForm.emergencyContactName', 'Name')}</span>
                            <span className="text-sm font-semibold">{t('employeeForm.emergencyContactPhone', 'Phone')}</span>
                            <span className="text-sm font-semibold">{t('employeeForm.emergencyContactRelationship', 'Relationship')}</span>
                            <div />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start">
                            <div>
                                <Controller
                                    name={`emergencyContacts.${index}.name`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            placeholder={t('employeeForm.emergencyContactName', 'Name')}
                                            {...field}
                                        />
                                    )}
                                />
                                <FieldError message={errors.emergencyContacts?.[index]?.name?.message} />
                            </div>
                            <div>
                                <Controller
                                    name={`emergencyContacts.${index}.phone`}
                                    control={control}
                                    render={({ field }) => (
                                        <PhoneNumberInput
                                            wrapperClassName="[&_.PhoneInputInput]:h-12"
                                            placeholder={t('employeeForm.emergencyContactPhone', 'Phone')}
                                            value={field.value || undefined}
                                            onChange={(val) => field.onChange(val || '')}
                                            defaultCountry="VE"
                                        />
                                    )}
                                />
                                <FieldError message={errors.emergencyContacts?.[index]?.phone?.message} />
                            </div>
                            <div>
                                <Controller
                                    name={`emergencyContacts.${index}.relationship`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            placeholder={t('employeeForm.emergencyContactRelationship', 'Relationship')}
                                            {...field}
                                        />
                                    )}
                                />
                                <FieldError message={errors.emergencyContacts?.[index]?.relationship?.message} />
                            </div>
                            <div className="flex items-center h-full pt-1">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="default"
                                    onClick={() => remove(index)}
                                >
                                    <TbTrash className="text-red-500" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                <Button type="button" size="sm" variant="solid" onClick={handleAdd} className="self-start" icon={<TbPlus />}>
                    {t('employeeForm.addEmergencyContact', 'Add Emergency Contact')}
                </Button>
            </div>
        </CollapsibleSection>
    )
}

export default EmergencyContactSection
