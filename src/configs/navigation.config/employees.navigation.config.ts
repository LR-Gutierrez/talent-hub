import { NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const employeesNavigationConfig: NavigationTree[] = [
    {
        key: 'employeesGroup',
        path: '',
        title: 'Employees',
        translateKey: 'nav.employees',
        icon: 'employeesGroup',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['employee:read'],
        subMenu: [
            {
                key: 'employees',
                path: '/employees',
                title: 'Employee List',
                translateKey: 'nav.employeeList',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['employee:read'],
                subMenu: [],
            },
            {
                key: 'employeeStatuses',
                path: '/employee-statuses',
                title: 'Employee Statuses',
                translateKey: 'nav.employeeStatuses',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['employee-status:read'],
                subMenu: [],
            },
        ],
    },
]

export default employeesNavigationConfig
