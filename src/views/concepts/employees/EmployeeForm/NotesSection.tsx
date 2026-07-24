import Input from '@/components/ui/Input'
import CollapsibleSection from '@/components/shared/CollapsibleSection'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import useTranslation from '@/utils/hooks/useTranslation'
import { TbClipboardText } from 'react-icons/tb'
import type { FormSectionBaseProps } from './types'

const NotesSection = ({ control, errors }: FormSectionBaseProps) => {
    const { t } = useTranslation()

    return (
        <CollapsibleSection title={t('employeeForm.notes', 'Notes / Observations')} icon={<TbClipboardText />}>
            <FormItem
                label={t('employeeForm.notes', 'Notes')}
                invalid={Boolean(errors.notes)}
                errorMessage={errors.notes?.message}
            >
                <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                        <Input
                            textArea
                            rows={4}
                            placeholder={t('employeeForm.notesPlaceholder', 'Add any observations here...')}
                            {...field}
                        />
                    )}
                />
            </FormItem>
        </CollapsibleSection>
    )
}

export default NotesSection
