import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const settingsNavigationConfig: NavigationTree[] = [
    {
        key: 'settings',
        path: '/settings',
        title: 'Settings',
        translateKey: 'nav.settings',
        icon: 'settings',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['admin'],
        subMenu: [],
    },
]

export default settingsNavigationConfig
