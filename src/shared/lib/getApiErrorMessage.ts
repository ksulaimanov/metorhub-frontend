import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
    id: number
    type: ToastType
    message: string
    duration: number
}

export const useToastStore = defineStore('toast', () => {
    const toasts = ref<ToastItem[]>([])

    const removeToast = (id: number) => {
        toasts.value = toasts.value.filter((toast) => toast.id !== id)
    }

    const pushToast = (
        message: string,
        type: ToastType = 'info',
        duration = 3500,
    ) => {
        const id = Date.now() + Math.floor(Math.random() * 1000)

        const toast: ToastItem = {
            id,
            type,
            message,
            duration,
        }

        toasts.value.push(toast)

        window.setTimeout(() => {
            removeToast(id)
        }, duration)
    }

    const success = (message: string, duration?: number) =>
        pushToast(message, 'success', duration)

    const error = (message: string, duration?: number) =>
        pushToast(message, 'error', duration)

    const info = (message: string, duration?: number) =>
        pushToast(message, 'info', duration)

    const warning = (message: string, duration?: number) =>
        pushToast(message, 'warning', duration)

    return {
        toasts,
        pushToast,
        removeToast,
        success,
        error,
        info,
        warning,
    }
})

interface ApiErrorShape {
    response?: {
        data?: {
            fieldErrors?: Record<string, string>
            message?: string
            error?: string
        }
    }
    message?: string
}

/**
 * Функция для извлечения сообщения об ошибке из ответа API
 * Обрабатывает различные форматы ответа от бэкенда:
 * 1. Ошибки валидации с fieldErrors
 * 2. Простое сообщение об ошибке (message)
 * 3. Fallback текст если сервер не ответил или нет интернета
 */
export const getApiErrorMessage = (error: unknown, fallbackMessage: string = 'Произошла ошибка. Попробуйте ещё раз.'): string => {
    const apiError = error as ApiErrorShape

    if (apiError?.response?.data?.fieldErrors && typeof apiError.response.data.fieldErrors === 'object') {
        const fieldErrors = apiError.response.data.fieldErrors
        const errorMessages = Object.values(fieldErrors).filter((msg) => typeof msg === 'string')

        if (errorMessages.length > 0) {
            return errorMessages[0] as string
        }
    }

    if (apiError?.response?.data?.message && typeof apiError.response.data.message === 'string') {
        return apiError.response.data.message
    }

    if (apiError?.response?.data?.error && typeof apiError.response.data.error === 'string') {
        return apiError.response.data.error
    }

    if (apiError?.message && typeof apiError.message === 'string' && !apiError?.response) {
        return fallbackMessage
    }

    return fallbackMessage
}
