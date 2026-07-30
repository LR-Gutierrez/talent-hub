import { create } from 'zustand'
import type { User } from '@/@types/auth'
import { apiGetMe } from '@/services/AuthService'

export type Session = {
    signedIn: boolean
}

export type AuthState = {
    session: Session
    user: User
}

export type AuthAction = {
    setSessionSignedIn: (payload: boolean) => void
    setUser: (payload: User) => void
    refreshUser: () => Promise<void>
}

const initialState: AuthState = {
    session: {
        signedIn: false,
    },
    user: {
        avatar: '',
        userName: '',
        email: '',
        role: '',
        authority: [],
    },
}

export const useSessionUser = create<AuthState & AuthAction>((set) => ({
    ...initialState,
    setSessionSignedIn: (payload) =>
        set((state) => ({
            session: {
                ...state.session,
                signedIn: payload,
            },
        })),
    setUser: (payload) =>
        set((state) => ({
            user: {
                ...state.user,
                ...payload,
                role: payload.role ?? state.user.role ?? '',
                authority: payload.authority ?? state.user.authority ?? [],
            },
        })),
    refreshUser: async () => {
        try {
            const resp: any = await apiGetMe()
            if (resp) {
                set({
                    user: {
                        avatar: resp.avatar ?? '',
                        userName: resp.userName ?? '',
                        email: resp.email ?? '',
                        role: resp.role ?? '',
                        authority: resp.authority ?? [],
                    },
                })
            }
        } catch {
            // silent fail
        }
    },
}))

export const useUserRole = () =>
    useSessionUser((state) => state.user.role)
