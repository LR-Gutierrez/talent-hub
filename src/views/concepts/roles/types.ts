export type Permission = {
    id: string
    name: string
    description: string
    group: string
}

export type Role = {
    id: string
    name: string
    description: string
    isSystem: boolean
    permissions: Permission[]
    createdAt: string
    updatedAt: string
    deletedAt: string | null
}
