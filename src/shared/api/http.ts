import axios, { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import i18n from '@/shared/i18n'
import { useToastStore } from '@/shared/lib/getApiErrorMessage'
import router from '@/app/router'
import { ErrorCodes } from '@/constants/errorCodes'

const baseURL = import.meta.env.VITE_API_BASE_URL?.trim()
const REFRESH_ENDPOINTS = ['/api/auth/refresh', '/api/v1/auth/refresh']
const MUTATION_METHODS = new Set(['post', 'put', 'patch', 'delete'])

if (!baseURL) {
    throw new Error('VITE_API_BASE_URL is not configured. Set it in your environment file before running the app.')
}

function getCookie(name: string): string | undefined {
    if (typeof document === 'undefined') {
        return undefined
    }

    const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${name}=`))

    return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : undefined
}

function setHeader(config: InternalAxiosRequestConfig, name: string, value: string): void {
    if (config.headers instanceof AxiosHeaders) {
        config.headers.set(name, value)
        return
    }

    const headers = config.headers as Record<string, string | undefined>
    headers[name] = value
}

function isMutationMethod(method?: string): boolean {
    return Boolean(method && MUTATION_METHODS.has(method.toLowerCase()))
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

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
    skipAuthRefresh?: boolean
}

let isRefreshing = false
let isForceLoggingOut = false
let failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown): void => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve()
        }
    })
    failedQueue = []
}

http.interceptors.request.use((config) => {
    const currentLocale = i18n.global.locale?.value
    if (currentLocale) {
        setHeader(config, 'Accept-Language', currentLocale)
    }

    if (isMutationMethod(config.method)) {
        const csrfToken = getCookie('XSRF-TOKEN')
        if (csrfToken) {
            setHeader(config, 'X-XSRF-TOKEN', csrfToken)
        }
    }

    return config
})

http.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const responseStatus = error.response?.status
        const responseData = error.response?.data as { errorCode?: string; message?: string } | undefined
        const originalRequest = error.config as RetriableRequestConfig | undefined

        if (responseStatus === 404 || responseStatus === 405) {
            const t = i18n.global.t as (key: string) => string
            const toastStore = useToastStore()
            toastStore.error(responseStatus === 404 ? t('errors.notFound') || 'Resource not found.' : t('errors.methodNotAllowed') || 'Method not allowed.')
            return Promise.reject(error)
        }

        if (responseStatus === 429) {
            const t = i18n.global.t as (key: string) => string
            const toastStore = useToastStore()
            toastStore.warning(t('errors.rateLimited'))
            return Promise.reject(error)
        }

        if (responseStatus === 403) {
            const t = i18n.global.t as (key: string) => string
            const toastStore = useToastStore()
            toastStore.error(t('errors.forbidden') || 'Доступ запрещён')
            if (router.currentRoute.value.path !== '/') {
                await router.replace('/')
            }
            return Promise.reject(error)
        }

        if (responseStatus === 401 && responseData?.errorCode === ErrorCodes.EMAIL_NOT_VERIFIED) {
            return Promise.reject(error)
        }

        if (responseStatus === 401 && responseData?.errorCode === ErrorCodes.INVALID_CREDENTIALS) {
            return Promise.reject(error)
        }

        if (responseStatus === 401 && responseData?.errorCode === ErrorCodes.ACCOUNT_DISABLED) {
            return Promise.reject(error)
        }

        if (responseStatus === 401 && originalRequest) {
            if (shouldSkipRefresh(originalRequest)) {
                await forceLogout()
                return Promise.reject(error)
            }

            if (originalRequest._retry) {
                return Promise.reject(error)
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(() => http(originalRequest))
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                await refreshSession()
                processQueue(null)
                return http(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError)
                await forceLogout()
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
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

function shouldSkipRefresh(config: RetriableRequestConfig): boolean {
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
