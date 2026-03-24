import { useToastStore } from '../lib/getApiErrorMessage'

/**
 * Composable для централизованной обработки ошибок
 * Проверяет поля в порядке: detail → fieldErrors → message → error → error.message → fallback
 */
export const useErrorHandler = () => {
  const toastStore = useToastStore()

  const handleError = (
      error: any,
      fallbackMessage: string = 'Произошла ошибка. Попробуйте ещё раз.'
  ): string => {
    let errorMessage = fallbackMessage

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
      errorMessage = error.message
    }

    toastStore.error(errorMessage)
    return errorMessage
  }

  const handleSuccess = (message: string = 'Успешно выполнено') => {
    toastStore.success(message)
  }

  return { handleError, handleSuccess }
}