import type { Control, FieldErrors } from 'react-hook-form'

export type EmployeeFormSchema = {
    fullName: string
    email: string
    phone: string
    address: string
    birthDate: string
    documentId: string
    gender: string
    departmentId: string
    position: string
    hireDate: string
    endDate: string
    salary: number
    supervisorId: string
    statusId: string
    isActive: boolean
}

export type FormSectionBaseProps = {
    control: Control<EmployeeFormSchema>
    errors: FieldErrors<EmployeeFormSchema>
}
