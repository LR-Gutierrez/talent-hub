export type GetEmployeesListResponse = {
    list: Employee[]
    total: number
}

export type Employee = {
    id: string
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
    genderId: string | null
    nationalityId: string | null
    maritalStatusId: string | null
    placeOfBirthId: string | null
    genderRef: { id: string; name: string; value: string; displayName?: string } | null
    nationalityRef: { id: string; name: string; value: string; displayName?: string } | null
    maritalStatusRef: { id: string; name: string; value: string; displayName?: string } | null
    placeOfBirthRef: { id: string; name: string; value: string; displayName?: string } | null
    notes: string
    photoUrl: string | null
    departmentId: string
    department: Department | null
    position: string
    contractingCompany: string
    hireDate: string
    endDate: string
    salary: number
    supervisorId: string
    supervisor: Employee | null
    statusId: string
    status: EmployeeStatus
    isActive: boolean
    educations: EmployeeEducation[]
    uniforms: EmployeeUniform[]
    children: EmployeeChild[]
    emergencyContacts: EmployeeEmergencyContact[]
    createdAt: string
    updatedAt: string
}

export type EmployeeEducation = {
    id: string
    employeeId: string
    educationLevel: string
    degree: string
    institution: string
    graduationYear: string
}

export type EmployeeUniform = {
    id: string
    employeeId: string
    shirtSize: string
    pantSize: string
    shoeSize: string
    jacketSize: string
    helmetSize: string
}

export type EmployeeChild = {
    id: string
    employeeId: string
    name: string
    birthDate: string
    gender: string
}

export type EmployeeEmergencyContact = {
    id: string
    employeeId: string
    name: string
    phone: string
    relationship: string
}

export type EmployeeStatus = {
    id: string
    name: string
    description: string
    color: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export type Department = {
    id: string
    name: string
    description: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export type EmployeeHistory = {
    id: string
    employeeId: string
    changedField: string
    oldValue: string
    newValue: string
    changedBy: string
    notes: string
    changedAt: string
}
