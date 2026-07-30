import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const departmentsRoute: Routes = [
    {
        key: 'departments',
        path: '/departments',
        component: lazy(() => import('@/views/concepts/departments')),
        authority: ['department:read'],
        meta: {
            header: {
                title: 'pageHeader.departments',
                description: 'pageHeader.departmentsDesc',
                contained: true,
            },
        },
    },
]

export default departmentsRoute
