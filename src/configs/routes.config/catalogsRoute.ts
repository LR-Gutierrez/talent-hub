import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const catalogsRoute: Routes = [
    {
        key: 'catalogs.genders',
        path: '/catalogs/genders',
        component: lazy(() => import('@/views/concepts/catalogs/GendersCatalog')),
        authority: ['admin'],
        meta: {
            header: {
                title: 'pageHeader.catalogs',
                description: 'pageHeader.catalogsDesc',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'catalogs.maritalStatuses',
        path: '/catalogs/marital-statuses',
        component: lazy(() => import('@/views/concepts/catalogs/MaritalStatusesCatalog')),
        authority: ['admin'],
        meta: {
            header: {
                title: 'pageHeader.catalogs',
                description: 'pageHeader.catalogsDesc',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'catalogs.educationLevels',
        path: '/catalogs/education-levels',
        component: lazy(() => import('@/views/concepts/catalogs/EducationLevelsCatalog')),
        authority: ['admin'],
        meta: {
            header: {
                title: 'pageHeader.catalogs',
                description: 'pageHeader.catalogsDesc',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'catalogs.employeeDegrees',
        path: '/catalogs/employee-degrees',
        component: lazy(() => import('@/views/concepts/catalogs/EmployeeDegreesCatalog')),
        authority: ['admin'],
        meta: {
            header: {
                title: 'pageHeader.catalogs',
                description: 'pageHeader.catalogsDesc',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'catalogs.uniformSizes',
        path: '/catalogs/uniform-sizes',
        component: lazy(() => import('@/views/concepts/catalogs/UniformSizesCatalog')),
        authority: ['admin'],
        meta: {
            header: {
                title: 'pageHeader.catalogs',
                description: 'pageHeader.catalogsDesc',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'catalogs.countries',
        path: '/catalogs/countries',
        component: lazy(() => import('@/views/concepts/catalogs/CountriesCatalog')),
        authority: ['admin'],
        meta: {
            header: {
                title: 'pageHeader.catalogs',
                description: 'pageHeader.catalogsDesc',
                contained: true,
            },
            footer: false,
        },
    },
]

export default catalogsRoute
