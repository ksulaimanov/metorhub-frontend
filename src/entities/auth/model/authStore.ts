import { defineStore } from 'pinia'
import { isAxiosError } from 'axios'
import type { AuthState, AuthUser, AuthProfileResponse, LoginRequest, LoginResponse } from '@/entities/auth/model/types'
import { getAuthDisplayName, getAuthInitials } from '@/shared/lib/auth/authPresentation'
import { getEmptyAuthUser, mapProfileToAuthUser } from '@/shared/lib/auth/authMappers'
import { ErrorCodes } from '@/constants/errorCodes'

const buildInitialState = (): AuthState => ({
  isAuthenticated: false,
  profileLoaded: false,
  isEmailVerified: true,
  pendingVerificationEmail: null,
  ...getEmptyAuthUser(),
})

function isProfileResponse(payload: LoginResponse | AuthProfileResponse): payload is AuthProfileResponse {
  return Boolean(payload && typeof payload === 'object' && ('email' in payload || 'roles' in payload))
}

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
      this.isEmailVerified = true
      this.pendingVerificationEmail = null
    },

    resetAuthState() {
      const empty = getEmptyAuthUser()
      this.isAuthenticated = false
      this.profileLoaded = false
      this.isEmailVerified = true
      this.pendingVerificationEmail = null
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

    setPendingVerificationEmail(email: string | null) {
      this.pendingVerificationEmail = email
    },

    async login(credentials: LoginRequest) {
      const { login: loginRequest, fetchCurrentUserProfile, requestLogout } = await import('@/shared/api/authApi')

      try {
        const response = await loginRequest(credentials)

        if (isProfileResponse(response)) {
          this.applyUser(mapProfileToAuthUser(response))
          return
        }

        try {
          const profile = await fetchCurrentUserProfile()
          this.applyUser(mapProfileToAuthUser(profile))
        } catch {
          await requestLogout().catch(() => {})
          this.clearClientAuthData()
          throw new Error('Login succeeded but session could not be established')
        }
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          const errorCode = error.response?.data?.errorCode as string | undefined
          if (error.response?.status === 401 && errorCode === ErrorCodes.EMAIL_NOT_VERIFIED) {
            this.setPendingVerificationEmail(credentials.email)
          }
        }
        throw error
      }
    },

    async fetchProfile(force = false) {
      if (!force && this.user) {
        return
      }

      try {
        const { fetchCurrentUserProfile } = await import('@/shared/api/authApi')
        const profile = await fetchCurrentUserProfile()
        this.isEmailVerified = true
        this.applyUser(mapProfileToAuthUser(profile))
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          const errorCode = error.response?.data?.errorCode as string | undefined
          if (error.response?.status === 401 && errorCode === ErrorCodes.EMAIL_NOT_VERIFIED) {
            this.isAuthenticated = true
            this.profileLoaded = true
            this.isEmailVerified = false
            return
          }

          if (error.response?.status === 401 || error.response?.status === 403) {
            this.clearClientAuthData()
          }
        }

        throw error
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
