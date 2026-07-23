import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/shared/PasswordInput'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import useTranslation from '@/utils/hooks/useTranslation'
import type { FormSectionBaseProps } from './types'

type OverviewSectionProps = FormSectionBaseProps & { newUser: boolean }

const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'recruiter', label: 'Recruiter' },
    { value: 'candidate', label: 'Candidate' },
]

const OverviewSection = ({ control, errors, newUser }: OverviewSectionProps) => {
    const { t } = useTranslation()

    return (
        <Card>
            <h4 className="mb-6">{t('userForm.overview', 'Overview')}</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label={t('userForm.displayName', 'Display Name')}
                    invalid={Boolean(errors.displayName)}
                    errorMessage={errors.displayName?.message}
                >
                    <Controller
                        name="displayName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder={t('userForm.displayName', 'Display Name')}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('userForm.email', 'Email')}
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                autoComplete="off"
                                placeholder={t('userForm.email', 'Email')}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
            {newUser && (
                <FormItem
                    label={t('userForm.password', 'Password')}
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <PasswordInput
                                autoComplete="off"
                                placeholder={t('userForm.password', 'Password')}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            )}
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label={t('userForm.role', 'Role')}
                    invalid={Boolean(errors.role)}
                    errorMessage={errors.role?.message}
                >
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={roleOptions}
                                placeholder={t('userForm.selectRole', 'Select role')}
                                value={roleOptions.find((o) => o.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label={t('userForm.active', 'Active')}>
                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                            <Switcher
                                checked={field.value}
                                onChange={(checked) => field.onChange(checked)}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default OverviewSection
