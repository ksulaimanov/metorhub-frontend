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

/**
 * Функция для извлечения сообщения об ошибке из ответа API
 * Обрабатывает различные форматы ответа от бэкенда:
 * 1. Ошибки валидации с fieldErrors
 * 2. Простое сообщение об ошибке (message)
 * 3. Fallback текст если сервер не ответил или нет интернета
 */
export const getApiErrorMessage = (error: any, fallbackMessage: string = 'Произошла ошибка. Попробуйте ещё раз.'): string => {
    // Проверяем, есть ли ошибки валидации полей
    if (error?.response?.data?.fieldErrors && typeof error.response.data.fieldErrors === 'object') {
        const fieldErrors = error.response.data.fieldErrors
        const errorMessages = Object.values(fieldErrors).filter((msg) => typeof msg === 'string')

        if (errorMessages.length > 0) {
            // Возвращаем первую ошибку валидации
            return errorMessages[0] as string
        }
    }

    // Проверяем простое сообщение об ошибке
    if (error?.response?.data?.message && typeof error.response.data.message === 'string') {
        return error.response.data.message
    }

    // Проверяем поле error
    if (error?.response?.data?.error && typeof error.response.data.error === 'string') {
        return error.response.data.error
    }

    // Если это не ошибка сети/сервера, а другая axios ошибка
    if (error?.message && typeof error.message === 'string' && !error?.response) {
        // Это может быть ошибка сети или таймаута
        return fallbackMessage
    }

    // Возвращаем fallback сообщение по умолчанию
    return fallbackMessage
}
