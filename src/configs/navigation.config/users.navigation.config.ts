import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const usersNavigationConfig: NavigationTree[] = [
    {
        key: 'users',
        path: '/users',
        title: 'Users',
        translateKey: 'nav.users',
        icon: 'usersGroup',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['user:read'],
        subMenu: [],
    },
]

export default usersNavigationConfig
