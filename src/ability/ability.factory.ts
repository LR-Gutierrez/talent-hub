import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import type { PureAbility } from '@casl/ability'

export type Action = 'create' | 'read' | 'update' | 'delete'
export type Subject = 'User' | 'Employee' | 'EmployeeStatus' | 'Department' | 'CompanySettings' | 'all'

export type AppAbility = PureAbility<[Action, Subject]>

export function createAbility(authority: string[]): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

    if (authority.includes('admin')) {
        can('manage', 'all')
    } else if (authority.includes('recruiter')) {
        can('read', 'User')
        can('create', 'User')
        can('update', 'User')
        cannot('delete', 'User')
        can('manage', 'Employee')
        cannot('delete', 'Employee')
        can('read', 'EmployeeStatus')
        can('read', 'Department')
    } else {
        can('read', 'User')
        can('update', 'User')
        cannot('delete', 'User')
        cannot('create', 'User')
        can('read', 'Employee')
        can('read', 'EmployeeStatus')
        can('read', 'Department')
    }

    return build()
}
