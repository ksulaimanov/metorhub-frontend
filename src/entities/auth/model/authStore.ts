import { defineStore } from 'pinia'
import type { AuthState, AuthUser } from '@/entities/auth/model/types'
import { getAuthDisplayName, getAuthInitials } from '@/shared/lib/auth/authPresentation'
import { getEmptyAuthUser, mapProfileToAuthUser } from '@/shared/lib/auth/authMappers'

const buildInitialState = (): AuthState => ({
  isAuthenticated: false,
  profileLoaded: false,
  ...getEmptyAuthUser(),
})

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => buildInitialState(),

  getters: {
    isStudent: (state) => state.roles.includes('ROLE_STUDENT'),
    isMentor: (state) => state.roles.includes('ROLE_MENTOR'),
    isAdmin: (state) => state.roles.includes('ROLE_ADMIN'),
    displayName: (state): string => getAuthDisplayName(state),
    initials: (state): string => getAuthInitials(state),
    user: (state): AuthUser | null => {
      if (!state.isAuthenticated || !state.profileLoaded) {
        return null
      }

      return {
        email: state.email,
        roles: state.roles,
        firstName: state.firstName,
        lastName: state.lastName,
        avatarUrl: state.avatarUrl,
        username: state.username,
      }
    },
  },

  actions: {
    applyUser(user: AuthUser) {
      this.email = user.email
      this.roles = user.roles
      this.firstName = user.firstName
      this.lastName = user.lastName
      this.avatarUrl = user.avatarUrl
      this.username = user.username
      this.isAuthenticated = true
      this.profileLoaded = true
    },

    resetAuthState() {
      const empty = getEmptyAuthUser()
      this.isAuthenticated = false
      this.profileLoaded = false
      this.email = empty.email
      this.roles = empty.roles
      this.firstName = empty.firstName
      this.lastName = empty.lastName
      this.avatarUrl = empty.avatarUrl
      this.username = empty.username
    },

    clearClientAuthData() {
      this.resetAuthState()
      localStorage.removeItem('auth-store')
      localStorage.removeItem('user')
      sessionStorage.clear()
    },

    async fetchProfile(force = false) {
      if (!force && this.user) {
        return
      }

      try {
        const { fetchCurrentUserProfile } = await import('@/shared/api/authApi')
        const profile = await fetchCurrentUserProfile()
        this.applyUser(mapProfileToAuthUser(profile))
      } catch (error: any) {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          // Session is invalid/expired: only clear client auth state, no extra auth calls.
          this.clearClientAuthData()
        }
      }
    },

    setAuth(payload: AuthUser) {
      this.applyUser(payload)
    },

    async logout() {
      try {
        const { requestLogout } = await import('@/shared/api/authApi')
        await requestLogout()
      } catch {
        // no-op: client state must still be cleared
      } finally {
        this.clearClientAuthData()
      }
    },
  },

  persist: {
    key: 'auth-store',
    storage: localStorage,
  },
})
