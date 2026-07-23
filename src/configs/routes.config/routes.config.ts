import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
import usersRoute from './usersRoute'
import employeesRoute from './employeesRoute'
import departmentsRoute from './departmentsRoute'
import settingsRoute from './settingsRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },

    ...usersRoute,
    ...employeesRoute,
    ...departmentsRoute,
    ...settingsRoute,
    ...othersRoute,
]
