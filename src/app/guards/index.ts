import type { Router } from 'vue-router'
import { useAuthStore } from '@/entities/auth/model/authStore'
import { resolveDashboardPath } from '@/shared/lib/auth/resolveDashboardPath'

const AUTH_COOKIE_HINTS = ['token', 'auth', 'session', 'jwt', 'jsessionid', 'refresh']

const hasAuthCookie = () => {
    if (typeof document === 'undefined') {
        return false
    }

    const cookieNames = document.cookie
        .split(';')
        .map((chunk) => chunk.trim().split('=')[0]?.toLowerCase())
        .filter(Boolean) as string[]

    return cookieNames.some((name) => AUTH_COOKIE_HINTS.some((hint) => name.includes(hint)))
}


export function setupRouteGuards(router: Router) {
    let initialAuthCheck = false
    let authBootstrapPromise: Promise<void> | null = null

    const ensureAuthBootstrapped = async () => {
        const auth = useAuthStore()
        const hasSessionCandidate = auth.isAuthenticated || hasAuthCookie()

        if (!hasSessionCandidate || (initialAuthCheck && !authBootstrapPromise)) {
            return
        }

        if (auth.profileLoaded && auth.user) {
            initialAuthCheck = true
            return
        }

        authBootstrapPromise ??= auth
            .fetchProfile()
            .catch((err) => {
                if (err?.message === 'EMAIL_NOT_VERIFIED') {
                    // Это ожидаемая ситуация
                }
                return undefined
            })
            .finally(() => {
                initialAuthCheck = true
                authBootstrapPromise = null
            })

        await authBootstrapPromise
    }

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
        if (to.path === '/verify-email') {
            const auth = useAuthStore()
            // Даже если мы на verify-email, попробуем загрузить профиль, чтобы заполнить стор (если нужно),
            // но нам не нужно применять редирект тут.
            await ensureAuthBootstrapped().catch(() => {})
            return
        }

        const auth = useAuthStore()
        const requiresAuth = Boolean(to.meta.requiresAuth)
        const guestOnly = Boolean(to.meta.guestOnly)
        const requiredRole = to.meta.role as string | undefined

        await ensureAuthBootstrapped()

        console.log('Guard Check:', { to: to.path, isAuthenticated: auth.isAuthenticated, user: auth.user, isEmailVerified: auth.isEmailVerified })

        if (auth.isAuthenticated && auth.isEmailVerified === false) {
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

        // allow navigation
    })

    router.afterEach((to) => {
        document.title = (to.meta.title as string) || 'JaiMentorship'
    })
}
