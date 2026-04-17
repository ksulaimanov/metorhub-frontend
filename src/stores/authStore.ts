import { defineStore } from 'pinia'
import { http } from '@/shared/api/http'

type UserRole = 'ROLE_STUDENT' | 'ROLE_MENTOR' | 'ROLE_ADMIN'

interface AuthState {
    accessToken: string | null
    refreshToken: string | null
    email: string | null
    roles: UserRole[]
    firstName?: string
    lastName?: string
    avatarUrl?: string
    username?: string
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        email: localStorage.getItem('email'),
        roles: JSON.parse(localStorage.getItem('roles') || '[]'),
        firstName: localStorage.getItem('firstName') || undefined,
        lastName: localStorage.getItem('lastName') || undefined,
        avatarUrl: localStorage.getItem('avatarUrl') || undefined,
        username: localStorage.getItem('username') || undefined,
    }),

    getters: {
        isAuthenticated: (state) => Boolean(state.accessToken),
        isStudent: (state) => state.roles.includes('ROLE_STUDENT'),
        isMentor: (state) => state.roles.includes('ROLE_MENTOR'),
        isAdmin: (state) => state.roles.includes('ROLE_ADMIN'),

        /** Derive a presentable name */
        displayName: (state): string => {
            if (state.firstName || state.lastName) {
                return `${state.firstName || ''} ${state.lastName || ''}`.trim()
            }
            const local = (state.email || '').split('@')[0] || ''
            if (!local) return ''
            const capitalized = local.charAt(0).toUpperCase() + local.slice(1)
            return capitalized.length > 18 ? capitalized.slice(0, 18) + '…' : capitalized
        },

        initials: (state): string => {
            if (state.firstName || state.lastName) {
                const f = state.firstName?.trim()?.[0] || ''
                const l = state.lastName?.trim()?.[0] || ''
                return (f + l).toUpperCase() || 'U'
            }
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
                this.firstName = data.firstName
                this.lastName = data.lastName
                this.avatarUrl = data.avatarUrl
                this.username = data.username
                localStorage.setItem('roles', JSON.stringify(data.roles))
                if (data.firstName) localStorage.setItem('firstName', data.firstName)
                if (data.lastName) localStorage.setItem('lastName', data.lastName)
                if (data.avatarUrl) localStorage.setItem('avatarUrl', data.avatarUrl)
                if (data.username) localStorage.setItem('username', data.username)
            } catch (error: any) {
                // If 401/403, interceptor will handle or we just logout
                if (error?.response?.status === 401 || error?.response?.status === 403) {
                    this.logout()
                }
            }
        },
        setAuth(payload: { accessToken: string; refreshToken: string; email: string; roles: UserRole[]; firstName?: string; lastName?: string; avatarUrl?: string; username?: string }) {
            this.accessToken = payload.accessToken
            this.refreshToken = payload.refreshToken
            this.email = payload.email
            this.roles = payload.roles
            this.firstName = payload.firstName
            this.lastName = payload.lastName
            this.avatarUrl = payload.avatarUrl
            this.username = payload.username

            localStorage.setItem('accessToken', payload.accessToken)
            localStorage.setItem('refreshToken', payload.refreshToken)
            localStorage.setItem('email', payload.email)
            localStorage.setItem('roles', JSON.stringify(payload.roles))
            if (payload.firstName) localStorage.setItem('firstName', payload.firstName)
            if (payload.lastName) localStorage.setItem('lastName', payload.lastName)
            if (payload.avatarUrl) localStorage.setItem('avatarUrl', payload.avatarUrl)
            if (payload.username) localStorage.setItem('username', payload.username)
        },

        logout() {
            this.accessToken = null
            this.refreshToken = null
            this.email = null
            this.roles = []
            this.firstName = undefined
            this.lastName = undefined
            this.avatarUrl = undefined
            this.username = undefined

            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('email')
            localStorage.removeItem('roles')
            localStorage.removeItem('firstName')
            localStorage.removeItem('lastName')
            localStorage.removeItem('avatarUrl')
            localStorage.removeItem('username')
        },
    }
})
