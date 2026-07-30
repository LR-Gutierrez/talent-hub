import {
    PiHouseLineDuotone,
    PiArrowsInDuotone,
    PiBookOpenUserDuotone,
    PiBookBookmarkDuotone,
    PiAcornDuotone,
    PiBagSimpleDuotone,
    PiUsersThreeDuotone,
    PiBuildingsDuotone,
    PiBooksDuotone,
    PiIdentificationBadgeDuotone,
    PiShieldCheckDuotone,
    PiGearDuotone,
} from 'react-icons/pi'
import type { JSX } from 'react'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <PiHouseLineDuotone />,
    singleMenu: <PiAcornDuotone />,
    collapseMenu: <PiArrowsInDuotone />,
    groupSingleMenu: <PiBookOpenUserDuotone />,
    groupCollapseMenu: <PiBookBookmarkDuotone />,
    groupMenu: <PiBagSimpleDuotone />,
    usersGroup: <PiUsersThreeDuotone />,
    employeesGroup: <PiIdentificationBadgeDuotone />,
    departments: <PiBuildingsDuotone />,
    catalogsGroup: <PiBooksDuotone />,
    roles: <PiShieldCheckDuotone />,
    settings: <PiGearDuotone />,
}

export default navigationIcon
