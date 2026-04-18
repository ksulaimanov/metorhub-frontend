export type UserRole = 'ROLE_STUDENT' | 'ROLE_MENTOR' | 'ROLE_ADMIN'

export interface AuthUser {
  email: string | null
  roles: UserRole[]
  firstName?: string
  lastName?: string
  avatarUrl?: string
  username?: string
}

export interface AuthState extends AuthUser {
  isAuthenticated: boolean
  profileLoaded: boolean
}

export interface AuthProfileResponse {
  email?: string | null
  roles?: UserRole[]
  firstName?: string
  lastName?: string
  avatarUrl?: string
  username?: string
}
