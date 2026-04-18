import { useToastStore } from '@/shared/lib/getApiErrorMessage'
import { useI18n } from 'vue-i18n'

export interface HandleErrorOptions {
  /** Show toast notification. Default: true. Set to false for inline-only error display. */
  toast?: boolean
}

/**
 * Raw error.message strings that should never be shown to users.
 * When matched, the fallback message is used instead.
 */
const RAW_ERROR_PATTERNS = [
  'network error',
  'timeout',
  'econnrefused',
  'econnaborted',
  'enotfound',
  'err_network',
  'failed to fetch',
  'load failed',
]

function isRawNetworkMessage(msg: string): boolean {
  const lower = msg.toLowerCase()
  return RAW_ERROR_PATTERNS.some((p) => lower.includes(p))
}

/**
 * Composable для централизованной обработки ошибок.
 * Проверяет поля в порядке: detail → fieldErrors → message → error → fallback.
 *
 * По умолчанию показывает toast. Если страница показывает ошибку inline (AppErrorState),
 * передайте `{ toast: false }`, чтобы избежать двойного отображения.
 */
export const useErrorHandler = () => {
  const toastStore = useToastStore()
  const { t } = useI18n()

  const handleError = (
      error: any,
      fallbackMessage: string = 'Произошла ошибка. Попробуйте ещё раз.',
      options: HandleErrorOptions = {},
  ): string => {
    const { toast = true } = options
    let errorMessage = fallbackMessage

    // Rate limiting — always show i18n message, skip backend body parsing
    if (error?.response?.status === 429) {
      errorMessage = t('errors.rateLimited')
      if (toast) {
        toastStore.warning(errorMessage)
      }
      return errorMessage
    }

    if (error?.response?.data?.detail && typeof error.response.data.detail === 'string') {
      errorMessage = error.response.data.detail
    }
    else if (error?.response?.data?.fieldErrors && typeof error.response.data.fieldErrors === 'object') {
      const errorMessages = Object.values(error.response.data.fieldErrors).filter(
        (msg) => typeof msg === 'string'
      )
      if (errorMessages.length > 0) {
        errorMessage = errorMessages[0] as string
      }
    }
    else if (error?.response?.data?.message && typeof error.response.data.message === 'string') {
      errorMessage = error.response.data.message
    }
    else if (error?.response?.data?.error && typeof error.response.data.error === 'string') {
      errorMessage = error.response.data.error
    }
    else if (error?.message && typeof error.message === 'string') {
      // Network-level errors (no response from server) — use fallback, not raw string
      if (isRawNetworkMessage(error.message)) {
        errorMessage = fallbackMessage
      } else {
        errorMessage = error.message
      }
    }

    if (toast) {
      toastStore.error(errorMessage)
    }

    return errorMessage
  }

  const handleSuccess = (message: string = 'Успешно выполнено') => {
    toastStore.success(message)
  }

  return { handleError, handleSuccess }
}
