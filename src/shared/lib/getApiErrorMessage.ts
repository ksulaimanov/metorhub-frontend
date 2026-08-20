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
