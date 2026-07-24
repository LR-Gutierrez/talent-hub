import { NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const employeesNavigationConfig: NavigationTree[] = [
    {
        key: 'employeesGroup',
        path: '',
        title: 'Employees',
        translateKey: 'nav.employees',
        icon: 'usersGroup',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'employees',
                path: '/employees',
                title: 'Employee List',
                translateKey: 'nav.employeeList',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'employeeStatuses',
                path: '/employee-statuses',
                title: 'Employee Statuses',
                translateKey: 'nav.employeeStatuses',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin'],
                subMenu: [],
            },
        ],
    },
]

export default employeesNavigationConfig
