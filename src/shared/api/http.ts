import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const http = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// --- request: attach access token ---
http.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

// --- response: handle 401 with token refresh ---
let isRefreshing = false
let pendingQueue: Array<{
    resolve: (token: string) => void
    reject: (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
    pendingQueue.forEach(({ resolve, reject }) => {
        if (token) resolve(token)
        else reject(error)
    })
    pendingQueue = []
}

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config

        // Skip refresh for login/register/refresh endpoints themselves
        if (
            !error.response ||
            error.response.status !== 401 ||
            original._retry ||
            original.url?.includes('/auth/')
        ) {
            return Promise.reject(error)
        }

        // If already refreshing — queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                pendingQueue.push({
                    resolve: (token: string) => {
                        original.headers.Authorization = `Bearer ${token}`
                        resolve(http(original))
                    },
                    reject,
                })
            })
        }

        original._retry = true
        isRefreshing = true

        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
            isRefreshing = false
            clearAuth()
            return Promise.reject(error)
        }

        try {
            const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken })

            localStorage.setItem('accessToken', data.accessToken)
            localStorage.setItem('refreshToken', data.refreshToken)

            original.headers.Authorization = `Bearer ${data.accessToken}`
            processQueue(null, data.accessToken)

            return http(original)
        } catch (refreshError) {
            processQueue(refreshError, null)
            clearAuth()
            return Promise.reject(refreshError)
        } finally {
            isRefreshing = false
        }
    },
)

function clearAuth() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('email')
    localStorage.removeItem('roles')
    window.location.href = '/login'
}
