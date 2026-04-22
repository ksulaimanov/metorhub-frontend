import { ref } from 'vue'
import { isAxiosError } from 'axios'
import { ErrorCodes } from '@/constants/errorCodes'

interface ApiValidationError {
  errorCode?: string
  fieldErrors?: Record<string, string>
}

export function useFormErrors() {
  const fieldErrors = ref<Record<string, string>>({})

  function handleApiError(error: unknown): boolean {
    if (isAxiosError(error)) {
      const status = error.response?.status
      const data = error.response?.data as ApiValidationError | undefined

      if ((status === 400 || status === 422) && data?.errorCode === ErrorCodes.VALIDATION_ERROR && data.fieldErrors) {
        fieldErrors.value = data.fieldErrors
        return true
      }
    }

    fieldErrors.value = {}
    return false
  }

  function clearErrors() {
    fieldErrors.value = {}
  }

  return { fieldErrors, handleApiError, clearErrors }
}

