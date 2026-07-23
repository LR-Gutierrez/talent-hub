import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const usersRoute: Routes = [
    {
        key: 'users',
        path: '/users',
        component: lazy(() => import('@/views/concepts/users/UserList')),
        authority: ['admin', 'recruiter', 'candidate'],
    },
    {
        key: 'users',
        path: '/users/create',
        component: lazy(() => import('@/views/concepts/users/UserCreate')),
        authority: ['admin', 'recruiter', 'candidate'],
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
        authority: ['admin', 'recruiter', 'candidate'],
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
        authority: ['admin', 'recruiter', 'candidate'],
        meta: {
            pageContainerType: 'contained',
        },
    },
]

export default usersRoute
