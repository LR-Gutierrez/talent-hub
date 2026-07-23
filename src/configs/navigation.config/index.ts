import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'
import usersNavigationConfig from './users.navigation.config'

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
]

export default navigationConfig
