import type { Router } from 'vue-router'
import { useAuthStore } from '@/entities/auth/model/authStore'
import { resolveDashboardPath } from '@/shared/lib/auth/resolveDashboardPath'

export function setupRouteGuards(router: Router) {
    const hasRequiredRole = (userRole: unknown, requiredRole: string): boolean => {
        const extractRoles = (input: unknown): string[] => {
            if (!input) return []
            if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') return [String(input)]
            if (Array.isArray(input)) return input.flatMap((item) => extractRoles(item))
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
        const roles = extractRoles(userRole).map(role => String(role).trim().toUpperCase())
        const normalizedRequired = requiredRole.toUpperCase()
        return roles.some((role) => role.includes(normalizedRequired) || normalizedRequired.includes(role))
    }

    router.beforeEach(async (to) => {
        const auth = useAuthStore()
        const requiresAuth = Boolean(to.meta.requiresAuth)
        const guestOnly = Boolean(to.meta.guestOnly)
        const requiredRole = to.meta.role as string | undefined

        if (auth.isAuthenticated && auth.isEmailVerified === false && to.path !== '/verify-email') {
            return { path: '/verify-email', replace: true }
        }

        if (guestOnly && auth.isAuthenticated) {
            const dashboardPath = resolveDashboardPath(auth.roles ?? auth.user)
            if (to.path !== dashboardPath) {
                return { path: dashboardPath, replace: true }
            }
            return
        }

        if (requiresAuth && !auth.isAuthenticated) {
            const intended = to.fullPath
            return {
                path: '/login',
                query: intended !== '/' ? { redirect: intended } : undefined,
                replace: true,
            }
        }

        if (requiredRole && auth.isAuthenticated && !hasRequiredRole(auth.roles ?? auth.user, requiredRole)) {
            const dashboardPath = resolveDashboardPath(auth.roles ?? auth.user)
            if (to.path !== dashboardPath) {
                return { path: dashboardPath, replace: true }
            }
        }

        if (to.path === '/verify-email') {
            return
        }

        // allow navigation
    })

    router.afterEach((to) => {
        document.title = (to.meta.title as string) || 'JaiMentorship'
    })
}
