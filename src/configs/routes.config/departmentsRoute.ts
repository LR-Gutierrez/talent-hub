import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const departmentsRoute: Routes = [
    {
        key: 'departments',
        path: '/departments',
        component: lazy(() => import('@/views/concepts/departments')),
        authority: ['admin', 'recruiter', 'candidate'],
        meta: {
            header: {
                title: 'pageHeader.departments',
                description: 'pageHeader.departmentsDesc',
                contained: true,
            },
            footer: false,
        },
    },
]

export default departmentsRoute
