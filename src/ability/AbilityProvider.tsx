import { useMemo, type ReactNode } from 'react'
import { AbilityContext } from './AbilityContext'
import { createAbility } from './ability.factory'
import { useSessionUser } from '@/store/authStore'

export default function AbilityProvider({ children }: { children: ReactNode }) {
    const authority = useSessionUser((s) => s.user.authority) ?? []

    const ability = useMemo(() => createAbility(authority), [authority])

    return (
        <AbilityContext.Provider value={ability}>
            {children}
        </AbilityContext.Provider>
    )
}
