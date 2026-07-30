import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const rolesNavigationConfig: NavigationTree[] = [
    {
        key: 'roles',
        path: '/roles',
        title: 'Roles',
        translateKey: 'nav.roles',
        icon: 'roles',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['role:read'],
        subMenu: [],
    },
]

export default rolesNavigationConfig
