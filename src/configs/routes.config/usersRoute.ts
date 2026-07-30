import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const usersRoute: Routes = [
    {
        key: 'users',
        path: '/users',
        component: lazy(() => import('@/views/concepts/users/UserList')),
        authority: ['user:read'],
    },
    {
        key: 'users',
        path: '/users/create',
        component: lazy(() => import('@/views/concepts/users/UserCreate')),
        authority: ['user:create'],
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
        authority: ['user:update'],
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
        authority: ['user:read'],
        meta: {
            pageContainerType: 'contained',
            footer: false,
        },
    },
]

export default usersRoute
