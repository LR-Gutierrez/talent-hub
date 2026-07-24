import type { Control, FieldErrors } from 'react-hook-form'

export type ChildItem = {
    name: string
    birthDate: string
    gender: string
}

export type EmergencyContactItem = {
    name: string
    phone: string
    relationship: string
}

export type EmployeeFormSchema = {
    fullName: string
    email: string
    phone: string
    phoneExtension: string
    corporatePhone: string
    satellitePhone: string
    roomPhone: string
    mobilePhone: string
    address: string
    birthDate: string
    documentId: string
    gender: string
    departmentId: string
    position: string
    contractingCompany: string
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
    emergencyContacts: EmergencyContactItem[]
}

export type FormSectionBaseProps = {
    control: Control<EmployeeFormSchema>
    errors: FieldErrors<EmployeeFormSchema>
}
