import { NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const catalogsNavigationConfig: NavigationTree[] = [
    {
        key: 'catalogsGroup',
        path: '',
        title: 'Catalogs',
        translateKey: 'nav.catalogs',
        icon: 'catalogsGroup',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['admin'],
        subMenu: [
            {
                key: 'catalogs.genders',
                path: '/catalogs/genders',
                title: 'Genders',
                translateKey: 'nav.genders',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin'],
                subMenu: [],
            },
            {
                key: 'catalogs.maritalStatuses',
                path: '/catalogs/marital-statuses',
                title: 'Marital Statuses',
                translateKey: 'nav.maritalStatuses',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin'],
                subMenu: [],
            },
            {
                key: 'catalogs.educationLevels',
                path: '/catalogs/education-levels',
                title: 'Education Levels',
                translateKey: 'nav.educationLevels',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin'],
                subMenu: [],
            },
            {
                key: 'catalogs.employeeDegrees',
                path: '/catalogs/employee-degrees',
                title: 'Degrees / Titles',
                translateKey: 'nav.employeeDegrees',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin'],
                subMenu: [],
            },
            {
                key: 'catalogs.uniformSizes',
                path: '/catalogs/uniform-sizes',
                title: 'Uniform Sizes',
                translateKey: 'nav.uniformSizes',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin'],
                subMenu: [],
            },
            {
                key: 'catalogs.countries',
                path: '/catalogs/countries',
                title: 'Countries',
                translateKey: 'nav.countries',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin'],
                subMenu: [],
            },
        ],
    },
]

export default catalogsNavigationConfig
