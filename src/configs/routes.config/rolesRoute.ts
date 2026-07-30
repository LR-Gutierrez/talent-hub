import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const rolesRoute: Routes = [
    {
        key: 'roles',
        path: '/roles',
        component: lazy(() => import('@/views/concepts/roles')),
        authority: ['role:read'],
    },
]

export default rolesRoute
