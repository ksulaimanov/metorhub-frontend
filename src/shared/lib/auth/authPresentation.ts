import type { AuthUser } from '@/entities/auth/model/types'

export function getAuthDisplayName(user: Pick<AuthUser, 'email' | 'firstName' | 'lastName'>): string {
  if (user.firstName || user.lastName) {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim()
  }

  const local = (user.email || '').split('@')[0] || ''
  if (!local) return ''

  const capitalized = local.charAt(0).toUpperCase() + local.slice(1)
  return capitalized.length > 18 ? `${capitalized.slice(0, 18)}...` : capitalized
}

export function getAuthInitials(user: Pick<AuthUser, 'email' | 'firstName' | 'lastName'>): string {
  if (user.firstName || user.lastName) {
    const f = user.firstName?.trim()?.[0] || ''
    const l = user.lastName?.trim()?.[0] || ''
    return (f + l).toUpperCase() || 'U'
  }

  const local = (user.email || '').split('@')[0] || ''
  return (local.charAt(0) || 'U').toUpperCase()
}

