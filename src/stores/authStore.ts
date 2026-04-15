import { defineStore } from 'pinia'
import { http } from '@/shared/api/http'

type UserRole = 'ROLE_STUDENT' | 'ROLE_MENTOR' | 'ROLE_ADMIN'

interface AuthState {
    accessToken: string | null
    refreshToken: string | null
    email: string | null
    roles: UserRole[]
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        email: localStorage.getItem('email'),
        roles: JSON.parse(localStorage.getItem('roles') || '[]'),
    }),

    getters: {
        isAuthenticated: (state) => Boolean(state.accessToken),
        isStudent: (state) => state.roles.includes('ROLE_STUDENT'),
        isMentor: (state) => state.roles.includes('ROLE_MENTOR'),
        isAdmin: (state) => state.roles.includes('ROLE_ADMIN'),

        /** Derive a presentable name from email (e.g. "ksulaimanov" → "Ksulaimanov") */
        displayName: (state): string => {
            const local = (state.email || '').split('@')[0] || ''
            if (!local) return ''
            const capitalized = local.charAt(0).toUpperCase() + local.slice(1)
            return capitalized.length > 18 ? capitalized.slice(0, 18) + '…' : capitalized
        },

        /** Single uppercase initial for avatar fallback */
        initials: (state): string => {
            const local = (state.email || '').split('@')[0] || ''
            return (local.charAt(0) || 'U').toUpperCase()
        },
    },

    actions: {
        async fetchProfile() {
            if (!this.accessToken) return
            try {
                const { data } = await http.get('/api/users/me')
                this.roles = data.roles
                this.email = data.email
                localStorage.setItem('roles', JSON.stringify(data.roles))
            } catch (error: any) {
                // If 401/403, interceptor will handle or we just logout
                if (error?.response?.status === 401 || error?.response?.status === 403) {
                    this.logout()
                }
            }
        },
        setAuth(payload: { accessToken: string; refreshToken: string; email: string; roles: UserRole[] }) {
            this.accessToken = payload.accessToken
            this.refreshToken = payload.refreshToken
            this.email = payload.email
            this.roles = payload.roles

            localStorage.setItem('accessToken', payload.accessToken)
            localStorage.setItem('refreshToken', payload.refreshToken)
            localStorage.setItem('email', payload.email)
            localStorage.setItem('roles', JSON.stringify(payload.roles))
        },

        logout() {
            this.accessToken = null
            this.refreshToken = null
            this.email = null
            this.roles = []

            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('email')
            localStorage.removeItem('roles')
        },
    },
})