import { useMemo, type ReactNode } from 'react'
import { AbilityContext } from './AbilityContext'
import { createAbility } from './ability.factory'
import { useSessionUser } from '@/store/authStore'

export default function AbilityProvider({ children }: { children: ReactNode }) {
    const authority = useSessionUser((s) => s.user.authority) ?? []
    const role = useSessionUser((s) => s.user.role)

    const ability = useMemo(() => createAbility(authority, role), [authority, role])

    return (
        <AbilityContext.Provider value={ability}>
            {children}
        </AbilityContext.Provider>
    )
}
