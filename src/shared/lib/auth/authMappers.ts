import type { AuthProfileResponse, AuthUser } from '@/entities/auth/model/types'

export function mapProfileToAuthUser(profile: AuthProfileResponse): AuthUser {
  return {
    email: profile.email ?? null,
    roles: profile.roles || [],
    firstName: profile.firstName,
    lastName: profile.lastName,
    avatarUrl: profile.avatarUrl,
    username: profile.username,
  }
}

export function getEmptyAuthUser(): AuthUser {
  return {
    email: null,
    roles: [],
    firstName: undefined,
    lastName: undefined,
    avatarUrl: undefined,
    username: undefined,
  }
}

