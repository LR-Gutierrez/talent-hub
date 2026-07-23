import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const employeesRoute: Routes = [
    {
        key: 'employees',
        path: '/employees',
        component: lazy(() => import('@/views/concepts/employees/EmployeeList')),
        authority: ['admin', 'recruiter', 'candidate'],
    },
    {
        key: 'employees',
        path: '/employees/create',
        component: lazy(() => import('@/views/concepts/employees/EmployeeCreate')),
        authority: ['admin', 'recruiter'],
        meta: {
            header: {
                title: 'pageHeader.createEmployee',
                description: 'pageHeader.createEmployeeDesc',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'employees',
        path: '/employees/:id/edit',
        component: lazy(() => import('@/views/concepts/employees/EmployeeEdit')),
        authority: ['admin', 'recruiter'],
        meta: {
            header: {
                title: 'pageHeader.editEmployee',
                description: 'pageHeader.editEmployeeDesc',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'employees',
        path: '/employees/:id',
        component: lazy(() => import('@/views/concepts/employees/EmployeeDetails')),
        authority: ['admin', 'recruiter', 'candidate'],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'employeeStatuses',
        path: '/employee-statuses',
        component: lazy(() => import('@/views/concepts/employees/EmployeeStatus')),
        authority: ['admin'],
        meta: {
            header: {
                title: 'pageHeader.employeeStatuses',
                description: 'pageHeader.employeeStatusesDesc',
                contained: true,
            },
            footer: false,
        },
    },
]

export default employeesRoute
