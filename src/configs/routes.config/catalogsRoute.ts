import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const catalogsRoute: Routes = [
    {
        key: 'catalogs.genders',
        path: '/catalogs/genders',
        component: lazy(() => import('@/views/concepts/catalogs/GendersCatalog')),
        authority: ['catalog:read'],
        meta: {
            header: {
                title: 'pageHeader.catalogs',
                description: 'pageHeader.catalogsDesc',
                contained: true,
            },
        },
    },
    {
        key: 'catalogs.maritalStatuses',
        path: '/catalogs/marital-statuses',
        component: lazy(() => import('@/views/concepts/catalogs/MaritalStatusesCatalog')),
        authority: ['catalog:read'],
        meta: {
            header: {
                title: 'pageHeader.catalogs',
                description: 'pageHeader.catalogsDesc',
                contained: true,
            },
        },
    },
    {
        key: 'catalogs.educationLevels',
        path: '/catalogs/education-levels',
        component: lazy(() => import('@/views/concepts/catalogs/EducationLevelsCatalog')),
        authority: ['catalog:read'],
        meta: {
            header: {
                title: 'pageHeader.catalogs',
                description: 'pageHeader.catalogsDesc',
                contained: true,
            },
        },
    },
    {
        key: 'catalogs.employeeDegrees',
        path: '/catalogs/employee-degrees',
        component: lazy(() => import('@/views/concepts/catalogs/EmployeeDegreesCatalog')),
        authority: ['catalog:read'],
        meta: {
            header: {
                title: 'pageHeader.catalogs',
                description: 'pageHeader.catalogsDesc',
                contained: true,
            },
        },
    },
    {
        key: 'catalogs.uniformSizes',
        path: '/catalogs/uniform-sizes',
        component: lazy(() => import('@/views/concepts/catalogs/UniformSizesCatalog')),
        authority: ['catalog:read'],
        meta: {
            header: {
                title: 'pageHeader.catalogs',
                description: 'pageHeader.catalogsDesc',
                contained: true,
            },
        },
    },
    {
        key: 'catalogs.countries',
        path: '/catalogs/countries',
        component: lazy(() => import('@/views/concepts/catalogs/CountriesCatalog')),
        authority: ['catalog:read'],
        meta: {
            header: {
                title: 'pageHeader.catalogs',
                description: 'pageHeader.catalogsDesc',
                contained: true,
            },
        },
    },
    {
        key: 'catalogs.bloodTypes',
        path: '/catalogs/blood-types',
        component: lazy(() => import('@/views/concepts/catalogs/BloodTypesCatalog')),
        authority: ['catalog:read'],
        meta: {
            header: {
                title: 'pageHeader.catalogs',
                description: 'pageHeader.catalogsDesc',
                contained: true,
            },
        },
    },
]

export default catalogsRoute
