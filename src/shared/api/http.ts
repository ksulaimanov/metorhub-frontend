import axios from 'axios'
import i18n from '@/shared/i18n'
import { useToastStore } from '@/shared/lib/getApiErrorMessage'
import router from '@/app/router'

const baseURL = import.meta.env.VITE_API_BASE_URL?.trim()
const REFRESH_ENDPOINTS = ['/api/auth/refresh', '/api/v1/auth/refresh']

if (!baseURL) {
    throw new Error('VITE_API_BASE_URL is not configured. Set it in your environment file before running the app.')
}

export const http = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
})

// --- Queue for 401 refresh ---
let isRefreshing = false
let isForceLoggingOut = false
let failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

// --- request: attach language ---
http.interceptors.request.use((config) => {
    // Attach language from i18n
    const currentLocale = i18n.global.locale?.value
    if (currentLocale) {
        config.headers['Accept-Language'] = currentLocale
    }

    return config
})

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        // --- Handle 429 Too Many Requests (rate limiting) ---
        if (error.response?.status === 429) {
            const t = i18n.global.t as (key: string) => string
            const toastStore = useToastStore()
            toastStore.warning(t('errors.rateLimited'))
            return Promise.reject(error)
        }

        // --- Handle 403 Forbidden ---
        if (error.response?.status === 403) {
            const t = i18n.global.t as (key: string) => string
            const toastStore = useToastStore()
            toastStore.error(t('errors.forbidden') || 'Access denied.')
            router.push('/')
            return Promise.reject(error)
        }

        const originalRequest = error.config

        // --- Handle 401 Unauthorized ---
        if (error.response?.status === 401 && originalRequest) {
            if (shouldSkipRefresh(originalRequest)) {
                return Promise.reject(error)
            }

            if (originalRequest._retry) {
                return Promise.reject(error)
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(() => {
                    return http(originalRequest)
                }).catch((err) => {
                    return Promise.reject(err)
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                // Try both refresh route variants to match backend API prefixing.
                await refreshSession()
                isRefreshing = false
                processQueue(null)
                return http(originalRequest)
            } catch (refreshError) {
                isRefreshing = false
                processQueue(refreshError)
                await forceLogout()
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    },
)

const AUTH_ENDPOINTS_SKIP_REFRESH = [
    ...REFRESH_ENDPOINTS,
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/register',
    '/api/auth/register/student',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/verify-email',
    '/api/auth/resend-verification',
]

function shouldSkipRefresh(config: any): boolean {
    const url = String(config?.url ?? '')
    return AUTH_ENDPOINTS_SKIP_REFRESH.some((path) => url.includes(path)) || config?.skipAuthRefresh === true
}

async function refreshSession(): Promise<void> {
    let lastError: unknown

    for (const refreshPath of REFRESH_ENDPOINTS) {
        try {
            await axios.post(`${baseURL}${refreshPath}`, {}, { withCredentials: true })
            return
        } catch (error) {
            lastError = error
        }
    }

    throw lastError
}

async function forceLogout(): Promise<void> {
    if (isForceLoggingOut) {
        return
    }

    isForceLoggingOut = true

    try {
        const { useAuthStore } = await import('@/entities/auth/model/authStore')
        const authStore = useAuthStore()
        await authStore.logout()
    } catch {
        localStorage.removeItem('auth-store')
        localStorage.removeItem('user')
        sessionStorage.clear()
    } finally {
        if (router.currentRoute.value.path !== '/login') {
            await router.replace('/login')
        }
        isForceLoggingOut = false
    }
}
