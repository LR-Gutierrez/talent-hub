export type GetEmployeesListResponse = {
    list: Employee[]
    total: number
}

export type Employee = {
    id: string
    fullName: string
    email: string
    phone: string
    address: string
    birthDate: string
    documentId: string
    gender: string
    nationality: string
    maritalStatus: string
    placeOfBirth: string
    notes: string
    departmentId: string
    department: Department | null
    position: string
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
