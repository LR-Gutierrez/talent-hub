import { useMemo, type ReactNode } from 'react'
import { AbilityProvider } from '@casl/react'
import { createAbility } from './ability.factory'
import { useSessionUser } from '@/store/authStore'

export default function CaslProvider({ children }: { children: ReactNode }) {
    const authority = useSessionUser((s) => s.user.authority) ?? []
    const role = useSessionUser((s) => s.user.role)

    const ability = useMemo(() => createAbility(authority, role), [authority, role])

    return (
        <AbilityProvider value={ability}>
            {children}
        </AbilityProvider>
    )
}
