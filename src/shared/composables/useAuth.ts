import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/entities/auth/model/authStore'
import { ROLES } from '@/shared/constants/app'
import { useToast } from '@/shared/composables/useToast'
import { resolveDashboardPath } from '@/shared/lib/auth/resolveDashboardPath'

/**
 * Composable для auth-операций в компонентах.
 * Централизует logout, redirect-after-login, role checks.
 */
export function useAuth() {
    const router = useRouter()
    const route = useRoute()
    const auth = useAuthStore()
    const toast = useToast()

    const isAuthenticated = computed(() => auth.isAuthenticated)
    const isStudent = computed(() => auth.isStudent)
    const isMentor = computed(() => auth.isMentor)
    const isAdmin = computed(() => auth.roles.includes(ROLES.ADMIN))

    function getSafeRedirectTarget(rawRedirect?: string): string | null {
        if (!rawRedirect || typeof rawRedirect !== 'string') {
            return null
        }

        // Разрешаем только внутренние пути вида /path, чтобы не допускать внешние redirect'ы.
        if (!rawRedirect.startsWith('/') || rawRedirect.startsWith('//')) {
            return null
        }

        const resolved = router.resolve(rawRedirect)
        if (resolved.meta.guestOnly) {
            return null
        }

        return resolved.fullPath
    }

    /** Redirect после успешного логина — сначала в intended route, потом в dashboard */
    async function redirectAfterLogin() {
        const redirect = getSafeRedirectTarget(route.query.redirect as string | undefined)
        const target = redirect || resolveDashboardPath(auth.roles)

        if (router.currentRoute.value.fullPath === target) {
            return
        }

        await router.replace(target)
    }

    async function logout() {
        auth.logout()
        await router.push('/login')
        toast.info('Вы вышли из аккаунта')
    }

    return {
        isAuthenticated,
        isStudent,
        isMentor,
        isAdmin,
        redirectAfterLogin,
        logout,
    }
}
