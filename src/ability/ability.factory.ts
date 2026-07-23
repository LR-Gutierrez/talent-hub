import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import type { PureAbility } from '@casl/ability'

export type Action = 'create' | 'read' | 'update' | 'delete'
export type Subject = 'User' | 'all'

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
    } else {
        can('read', 'User')
        can('update', 'User')
        cannot('delete', 'User')
        cannot('create', 'User')
    }

    return build()
}
