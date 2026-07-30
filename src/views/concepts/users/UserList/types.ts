export type GetUsersListResponse = {
    list: User[]
    total: number
}

export type User = {
    id: string
    email: string
    displayName: string
    photoUrl: string
    role: 'admin' | 'supervisor' | 'monitor'
    isActive: boolean
    createdAt: string
    updatedAt: string
    deletedAt?: string | null
}
