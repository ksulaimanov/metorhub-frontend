import { useToastStore } from '@/shared/model/toastStore'

/**
 * Тонкая обёртка над toast-стором.
 * Composable удобнее прямого useToastStore() в компонентах,
 * потому что при рефакторе стора менять придётся только здесь.
 */
export function useToast() {
    const store = useToastStore()

    return {
        success: (msg: string) => store.success(msg),
        error: (msg: string) => store.error(msg),
        info: (msg: string) => store.info(msg),
        warning: (msg: string) => store.warning(msg),
    }
}

