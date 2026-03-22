import { defineStore } from 'pinia'

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
    },

    actions: {
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