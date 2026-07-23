import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const settingsRoute: Routes = [
    {
        key: 'settings',
        path: '/settings',
        component: lazy(() => import('@/views/concepts/settings')),
        authority: ['admin'],
        meta: {
            header: {
                title: 'pageHeader.settings',
                description: 'pageHeader.settingsDesc',
                contained: true,
            },
            footer: false,
        },
    },
]

export default settingsRoute
