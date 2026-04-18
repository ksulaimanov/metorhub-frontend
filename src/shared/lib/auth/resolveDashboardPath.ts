import { ROLES } from '@/shared/constants/app'

export function resolveDashboardPath(roles: string[]): string {
  if (roles.includes(ROLES.ADMIN as any)) {
    return '/admin/dashboard'
  }
  if (roles.includes(ROLES.MENTOR as any)) {
    return '/mentor/dashboard'
  }
  if (roles.includes(ROLES.STUDENT as any)) {
    return '/student/dashboard'
  }
  return '/'
}

