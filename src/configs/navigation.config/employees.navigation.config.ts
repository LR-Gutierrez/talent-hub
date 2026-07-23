import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const employeesNavigationConfig: NavigationTree[] = [
    {
        key: 'employees',
        path: '/employees',
        title: 'Employees',
        translateKey: 'nav.employees',
        icon: 'usersGroup',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
]

export default employeesNavigationConfig
