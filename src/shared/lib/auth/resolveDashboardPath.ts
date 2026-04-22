
/**
 * Определяет маршрут дашборда на основе ролей пользователя.
 * Безопасно обрабатывает undefined, null, строки и массивы объектов с ролями.
 *
 * @param userRole - Массив ролей пользователя, объект или строка
 * @returns Путь до дашборда или '/' по умолчанию
 */
export function resolveDashboardPath(userRole: unknown): string {
  console.log('DEBUG_ROLES_INPUT:', userRole)

  const extractRoles = (input: unknown): string[] => {
    if (!input) return []

    if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
      return [String(input)]
    }

    if (Array.isArray(input)) {
      return input.flatMap((item) => extractRoles(item))
    }

    if (typeof input === 'object') {
      const obj = input as Record<string, unknown>

      return [
        ...extractRoles(obj.role),
        ...extractRoles(obj.roles),
        ...extractRoles(obj.authority),
        ...extractRoles(obj.authorities),
        ...extractRoles(obj.name),
        ...extractRoles(obj.code),
        ...extractRoles(obj.value),
      ]
    }

    return []
  }

  const roles = extractRoles(userRole)
    .map((role) => String(role).trim().toUpperCase())
    .filter(Boolean)

  const hasAnyRole = (...candidates: string[]) =>
    candidates.some((candidate) => {
      const normalized = candidate.toUpperCase()
      return roles.some((role) => role.includes(normalized))
    })

  // Проверяем роли в порядке приоритета: ADMIN > MENTOR > STUDENT
  if (hasAnyRole('ROLE_ADMIN', 'ADMIN')) {
    return '/admin/dashboard'
  }
  if (hasAnyRole('ROLE_MENTOR', 'MENTOR')) {
    return '/mentor/dashboard'
  }
  if (hasAnyRole('ROLE_STUDENT', 'STUDENT')) {
    return '/student/dashboard'
  }

  // Возвращаем путь по умолчанию
  return '/'
}
