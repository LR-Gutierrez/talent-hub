import type { Control, FieldErrors } from 'react-hook-form'

export type ChildItem = {
    name: string
    birthDate: string
    gender: string
}

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
    nationality: string
    maritalStatus: string
    placeOfBirth: string
    educationLevel: string
    degree: string
    institution: string
    graduationYear: string
    shirtSize: string
    pantSize: string
    shoeSize: string
    jacketSize: string
    helmetSize: string
    notes: string
    children: ChildItem[]
}

export type FormSectionBaseProps = {
    control: Control<EmployeeFormSchema>
    errors: FieldErrors<EmployeeFormSchema>
}
