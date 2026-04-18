import type { Router } from 'vue-router'
import { useAuthStore } from '@/entities/auth/model/authStore'
import { resolveDashboardPath } from '@/shared/lib/auth/resolveDashboardPath'


export function setupRouteGuards(router: Router) {
    let initialAuthCheck = false

    router.beforeEach(async (to) => {
        const auth = useAuthStore()

        if (auth.isAuthenticated && !initialAuthCheck) {
            if (!auth.user) {
                await auth.fetchProfile()
            }
            initialAuthCheck = true
        }

        const requiresAuth = Boolean(to.meta.requiresAuth)
        const guestOnly = Boolean(to.meta.guestOnly)
        const requiredRole = to.meta.role as string | undefined

        if (guestOnly && auth.isAuthenticated) {
            return resolveDashboardPath(auth.roles)
        }

        if (requiresAuth && !auth.isAuthenticated) {
            const intended = to.fullPath
            return { path: '/login', query: intended !== '/' ? { redirect: intended } : undefined }
        }

        if (requiredRole && !auth.roles.includes(requiredRole as any)) {
            return resolveDashboardPath(auth.roles)
        }

        // allow navigation
    })

    router.afterEach((to) => {
        document.title = (to.meta.title as string) || 'JaiMentorship'
    })
}
