import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const employeesRoute: Routes = [
    {
        key: 'employees',
        path: '/employees',
        component: lazy(() => import('@/views/concepts/employees/EmployeeList')),
        authority: ['employee:read'],
    },
    {
        key: 'employees',
        path: '/employees/create',
        component: lazy(() => import('@/views/concepts/employees/EmployeeCreate')),
        authority: ['employee:create'],
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
        authority: ['employee:update'],
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
        authority: ['employee:read'],
        meta: {
            pageContainerType: 'contained',
            footer: false,
        },
    },
    {
        key: 'employeeStatuses',
        path: '/employee-statuses',
        component: lazy(() => import('@/views/concepts/employees/EmployeeStatus')),
        authority: ['employee-status:read'],
        meta: {
            header: {
                title: 'pageHeader.employeeStatuses',
                description: 'pageHeader.employeeStatusesDesc',
                contained: true,
            },
        },
    },
]

export default employeesRoute
