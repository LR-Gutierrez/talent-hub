import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import useTranslation from '@/utils/hooks/useTranslation'
import { apiGetEmployeeStatuses } from '@/services/EmployeeStatusesService'
import { apiGetEmployeesList } from '@/services/EmployeesService'
import { apiGetDepartments } from '@/services/DepartmentsService'
import type { FormSectionBaseProps } from './types'
import type { EmployeeStatus } from '../EmployeeList/types'
import type { Employee } from '../EmployeeList/types'
import type { Department } from '../EmployeeList/types'

const LaborSection = ({ control, errors }: FormSectionBaseProps) => {
    const { t } = useTranslation()
    const [statuses, setStatuses] = useState<EmployeeStatus[]>([])
    const [employees, setEmployees] = useState<Employee[]>([])
    const [departments, setDepartments] = useState<Department[]>([])

    useEffect(() => {
        apiGetEmployeeStatuses<EmployeeStatus[]>().then(setStatuses)
        apiGetDepartments<Department[]>().then(setDepartments)
        apiGetEmployeesList<{ list: Employee[] }>({ pageSize: 100, pageIndex: 1 }).then((res) => {
            setEmployees(res.list || [])
        })
    }, [])

    const supervisorOptions = employees
        .filter((e) => e.isActive)
        .map((e) => ({ value: e.id, label: e.fullName }))

    const statusOptions = statuses
        .filter((s) => s.isActive)
        .map((s) => ({ value: s.id, label: s.name }))

    const departmentOptions = departments
        .filter((d) => d.isActive)
        .map((d) => ({ value: d.id, label: d.name }))

    return (
        <Card>
            <h4 className="mb-6">{t('employeeForm.laborInfo', 'Labor Information')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label={t('employeeForm.department', 'Department')}
                    invalid={Boolean(errors.departmentId)}
                    errorMessage={errors.departmentId?.message}
                >
                    <Controller
                        name="departmentId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={t('employeeForm.selectDepartment', 'Select department')}
                                options={departmentOptions}
                                value={departmentOptions.find((o) => o.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                                isClearable
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.position', 'Position')}
                    invalid={Boolean(errors.position)}
                    errorMessage={errors.position?.message}
                >
                    <Controller
                        name="position"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder={t('employeeForm.position', 'Position')} {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.hireDate', 'Hire Date')}
                    invalid={Boolean(errors.hireDate)}
                    errorMessage={errors.hireDate?.message}
                >
                    <Controller
                        name="hireDate"
                        control={control}
                        render={({ field }) => (
                            <Input type="date" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.endDate', 'End Date')}
                    invalid={Boolean(errors.endDate)}
                    errorMessage={errors.endDate?.message}
                >
                    <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                            <Input type="date" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.salary', 'Salary')}
                    invalid={Boolean(errors.salary)}
                    errorMessage={errors.salary?.message}
                >
                    <Controller
                        name="salary"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                placeholder={t('employeeForm.salary', 'Salary')}
                                value={field.value || ''}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.status', 'Status')}
                    invalid={Boolean(errors.statusId)}
                    errorMessage={errors.statusId?.message}
                >
                    <Controller
                        name="statusId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={t('employeeForm.selectStatus', 'Select status')}
                                options={statusOptions}
                                value={statusOptions.find((o) => o.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('employeeForm.supervisor', 'Supervisor')}
                    invalid={Boolean(errors.supervisorId)}
                    errorMessage={errors.supervisorId?.message}
                >
                    <Controller
                        name="supervisorId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder={t('employeeForm.selectSupervisor', 'Select supervisor')}
                                options={supervisorOptions}
                                value={supervisorOptions.find((o) => o.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                                isClearable
                            />
                        )}
                    />
                </FormItem>
                <div className="flex items-center gap-2">
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
                    <span>{t('employeeForm.active', 'Active')}</span>
                </div>
            </div>
        </Card>
    )
}

export default LaborSection
