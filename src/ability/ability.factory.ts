import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import type { PureAbility } from '@casl/ability'

export type Action = 'create' | 'read' | 'update' | 'delete'
export type Subject = 'User' | 'Employee' | 'EmployeeStatus' | 'Department' | 'CompanySettings' | 'Role' | 'Catalog' | 'all'

export type AppAbility = PureAbility<[Action, Subject]>

const subjectMap: Record<string, Subject> = {
    employee: 'Employee',
    'employee-status': 'EmployeeStatus',
    department: 'Department',
    user: 'User',
    'company-settings': 'CompanySettings',
    catalog: 'Catalog',
    role: 'Role',
}

export function createAbility(authority: string[], role?: string): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

    if (role === 'admin' || authority.includes('*')) {
        can('manage', 'all')
        return build()
    }

    for (const perm of authority) {
        const [rawSubject, action] = perm.split(':')
        const subject = subjectMap[rawSubject]
        if (subject && action) {
            can(action as Action, subject)
        }
    }

    return build()
}
