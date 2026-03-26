import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from './useToast'
import { ROLES } from '@/shared/constants/app'

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
    const isAdmin = computed(() => auth.roles.includes(ROLES.ADMIN as any))

    /** Redirect после успешного логина — сначала в intended route, потом в dashboard */
    function redirectAfterLogin() {
        const redirect = route.query.redirect as string | undefined
        if (redirect) {
            router.push(redirect)
            return
        }

        if (auth.isMentor) {
            router.push('/mentor/dashboard')
        } else if (auth.isStudent) {
            router.push('/student/dashboard')
        } else {
            router.push('/')
        }
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

