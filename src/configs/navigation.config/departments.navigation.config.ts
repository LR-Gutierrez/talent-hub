import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const departmentsNavigationConfig: NavigationTree[] = [
    {
        key: 'departments',
        path: '/departments',
        title: 'Departments',
        translateKey: 'nav.departments',
        icon: 'departments',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
]

export default departmentsNavigationConfig
