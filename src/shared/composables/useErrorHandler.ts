import { isAxiosError } from 'axios'
import { useI18n } from 'vue-i18n'
import { ErrorCodes } from '@/constants/errorCodes'
import { useToastStore } from '@/shared/lib/getApiErrorMessage'

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

function getBackendErrorMessage(error: unknown): string | null {
  if (!isAxiosError(error)) {
    return null
  }

  const errorCode = error.response?.data?.errorCode as string | undefined

  switch (errorCode) {
    case ErrorCodes.EMAIL_NOT_VERIFIED:
      return 'Пожалуйста, подтвердите ваш email.'
    case ErrorCodes.INVALID_CREDENTIALS:
      return 'Неверный email или пароль.'
    case ErrorCodes.ACCOUNT_DISABLED:
      return 'Аккаунт заблокирован.'
    case ErrorCodes.RATE_LIMIT_EXCEEDED:
    case ErrorCodes.TOO_MANY_REQUESTS:
      return 'Слишком много запросов. Попробуйте позже.'
    default:
      return null
  }
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
      error: unknown,
      fallbackMessage: string = 'Произошла ошибка. Попробуйте ещё раз.',
      options: HandleErrorOptions = {},
  ): string => {
    const { toast = true } = options
    let errorMessage = fallbackMessage

    const backendMessage = getBackendErrorMessage(error)
    if (backendMessage) {
      errorMessage = backendMessage
      if (toast) {
        toastStore.error(errorMessage)
      }
      return errorMessage
    }

    if (isAxiosError(error) && error.response?.status === 429) {
      errorMessage = t('errors.rateLimited')
      if (toast) {
        toastStore.warning(errorMessage)
      }
      return errorMessage
    }

    if (isAxiosError(error) && error.response?.data?.detail && typeof error.response.data.detail === 'string') {
      errorMessage = error.response.data.detail
    }
    else if (isAxiosError(error) && error.response?.data?.fieldErrors && typeof error.response.data.fieldErrors === 'object') {
      const errorMessages = Object.values(error.response.data.fieldErrors).filter(
        (msg) => typeof msg === 'string'
      )
      if (errorMessages.length > 0) {
        errorMessage = errorMessages[0] as string
      }
    }
    else if (isAxiosError(error) && error.response?.data?.message && typeof error.response.data.message === 'string') {
      errorMessage = error.response.data.message
    }
    else if (isAxiosError(error) && error.response?.data?.error && typeof error.response.data.error === 'string') {
      errorMessage = error.response.data.error
    }
    else if (error instanceof Error) {
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
