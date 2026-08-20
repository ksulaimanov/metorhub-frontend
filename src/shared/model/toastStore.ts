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
