import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'
import usersNavigationConfig from './users.navigation.config'
import employeesNavigationConfig from './employees.navigation.config'
import departmentsNavigationConfig from './departments.navigation.config'
import catalogsNavigationConfig from './catalogs.navigation.config'
import settingsNavigationConfig from './settings.navigation.config'

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/home',
        title: 'Home',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    ...usersNavigationConfig,
    ...employeesNavigationConfig,
    ...departmentsNavigationConfig,
    ...catalogsNavigationConfig,
    ...settingsNavigationConfig,
]

export default navigationConfig
