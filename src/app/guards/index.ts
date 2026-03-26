import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { ROLES } from '@/shared/constants/app'


export function setupRouteGuards(router: Router) {
    router.beforeEach((to, _from, next) => {
        const auth = useAuthStore()
        const requiresAuth = Boolean(to.meta.requiresAuth)
        const requiredRole = to.meta.role as string | undefined

        if (requiresAuth && !auth.isAuthenticated) {
            const intended = to.fullPath
            next({ path: '/login', query: intended !== '/' ? { redirect: intended } : undefined })
            return
        }

        if (requiredRole && !auth.roles.includes(requiredRole as any)) {
            if (auth.roles.includes(ROLES.MENTOR as any)) {
                next('/mentor/dashboard')
                return
            }
            if (auth.roles.includes(ROLES.STUDENT as any)) {
                next('/student/dashboard')
                return
            }
            next('/')
            return
        }

        next()
    })

    router.afterEach((to) => {
        document.title = (to.meta.title as string) || 'MentorHub'
    })
}

