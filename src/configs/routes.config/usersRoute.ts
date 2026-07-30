import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const usersRoute: Routes = [
    {
        key: 'users',
        path: '/users',
        component: lazy(() => import('@/views/concepts/users/UserList')),
        authority: ['admin', 'supervisor', 'monitor'],
    },
    {
        key: 'users',
        path: '/users/create',
        component: lazy(() => import('@/views/concepts/users/UserCreate')),
        authority: ['admin', 'supervisor', 'monitor'],
        meta: {
            header: {
                title: 'pageHeader.createUser',
                description: 'pageHeader.createUserDesc',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'users',
        path: '/users/:id/edit',
        component: lazy(() => import('@/views/concepts/users/UserEdit')),
        authority: ['admin', 'supervisor', 'monitor'],
        meta: {
            header: {
                title: 'pageHeader.editUser',
                description: 'pageHeader.editUserDesc',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'users',
        path: '/users/:id',
        component: lazy(() => import('@/views/concepts/users/UserDetails')),
        authority: ['admin', 'supervisor', 'monitor'],
        meta: {
            pageContainerType: 'contained',
            footer: false,
        },
    },
]

export default usersRoute
