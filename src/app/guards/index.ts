import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { ROLES } from '@/shared/constants/app'


export function setupRouteGuards(router: Router) {
    router.beforeEach((to) => {
        const auth = useAuthStore()
        const requiresAuth = Boolean(to.meta.requiresAuth)
        const requiredRole = to.meta.role as string | undefined

        if (requiresAuth && !auth.isAuthenticated) {
            const intended = to.fullPath
            return { path: '/login', query: intended !== '/' ? { redirect: intended } : undefined }
        }

        if (requiredRole && !auth.roles.includes(requiredRole as any)) {
            if (auth.roles.includes(ROLES.MENTOR as any)) {
                return '/mentor/dashboard'
            }
            if (auth.roles.includes(ROLES.STUDENT as any)) {
                return '/student/dashboard'
            }
            return '/'
        }

        // allow navigation
    })

    router.afterEach((to) => {
        document.title = (to.meta.title as string) || 'JaiMentorship'
    })
}

