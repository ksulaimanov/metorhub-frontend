<template>
  <AuthSplitShell
      :badge="t('auth.verifyHeroBadge')"
      :title="t('auth.verifyHeroTitle')"
      :subtitle="t('auth.verifyHeroSubtitle')"
      :is-loading="isLoading"
  >
    <!-- Left info cards -->
    <template #cards="{ isLoading: shellLoading }">
      <AuthHeroCards :is-loading="shellLoading" />
    </template>

    <!-- Form -->
    <h1 class="text-2xl font-bold text-text-primary sm:text-3xl">{{ t('auth.verifyTitle') }}</h1>
    <p class="mt-2 text-sm text-text-secondary">{{ t('auth.verifySubtitle') }}</p>

    <form class="mt-8 space-y-5" @submit.prevent="handleVerify">
      <AppField :label="t('auth.email')" :error="showValidation ? (fieldErrors.email || emailError) : ''">
        <AppInput
            v-model.trim="email"
            type="email"
            autocomplete="email"
            :error="showValidation && !!(fieldErrors.email || emailError)"
            :placeholder="t('auth.emailPlaceholder')"
        />
      </AppField>

      <AppField :label="t('auth.verifyCode')" :error="showValidation ? (fieldErrors.code || codeError) : ''">
        <AppInput
            v-model.trim="code"
            inputmode="numeric"
            maxlength="6"
            :error="showValidation && !!(fieldErrors.code || codeError)"
            :placeholder="t('auth.verifyCodePlaceholder')"
            class="tracking-[0.35em]"
        />
      </AppField>

      <AppErrorState
          v-if="errorMessage"
          :title="t('auth.verifyFailed')"
          :description="errorMessage"
      />

      <InfoPanel v-if="successMessage" variant="success">
        {{ successMessage }}
      </InfoPanel>

      <AppButton
          type="submit"
          size="lg"
          :loading="verifying"
          :disabled="resending"
          class="w-full shadow-[0_0_20px_rgba(108,92,231,0.4)] transition-all hover:shadow-[0_4px_25px_rgba(108,92,231,0.6)]"
      >
        {{ verifying ? t('auth.verifyLoading') : t('auth.verifySubmit') }}
      </AppButton>
    </form>

    <!-- Resend block -->
    <InfoPanel class="mt-6" variant="muted">
      <p class="text-sm font-medium text-text-primary">{{ t('auth.verifyNoCode') }}</p>
      <p class="mt-1 text-sm text-text-secondary">{{ t('auth.verifyNoCodeDesc') }}</p>

      <AppButton
          variant="secondary"
          size="lg"
          :loading="resending"
          :disabled="resendCooldown > 0 || verifying"
          class="mt-4 w-full"
          @click="handleResend"
      >
        <span v-if="resending">{{ t('auth.verifyResending') }}</span>
        <span v-else-if="resendCooldown > 0">
          {{ t('auth.verifyResendCooldown', { seconds: resendCooldown }) }}
        </span>
        <span v-else>{{ t('auth.verifyResend') }}</span>
      </AppButton>

      <p v-if="resendMessage" class="mt-3 text-sm text-emerald-600">
        {{ resendMessage }}
      </p>
    </InfoPanel>

    <!-- Footer slot -->
    <template #footer>
      <p class="text-center text-sm text-text-secondary">
        {{ t('auth.verifyAlreadyDone') }}
        <RouterLink :to="loginLink" class="font-semibold text-brand-soft transition hover:text-brand-hover hover:underline">
          {{ t('auth.loginSubmit') }}
        </RouterLink>
      </p>
    </template>
  </AuthSplitShell>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { http } from '@/shared/api/http'
import { useToastStore } from '@/shared/lib/getApiErrorMessage'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { useFormErrors } from '@/shared/composables/useFormErrors'
import AuthSplitShell from '@/shared/ui/AuthSplitShell.vue'
import AuthHeroCards from '@/shared/ui/AuthHeroCards.vue'
import InfoPanel from '@/shared/ui/InfoPanel.vue'
import AppErrorState from '@/shared/ui/AppErrorState.vue'
import AppField from '@/shared/ui/AppField.vue'
import AppInput from '@/shared/ui/AppInput.vue'
import AppButton from '@/shared/ui/AppButton.vue'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()
const { handleError } = useErrorHandler()
const { fieldErrors, handleApiError, clearErrors } = useFormErrors()

const loginLink = computed(() => {
  const redirect = route.query.redirect as string | undefined
  return redirect ? { path: '/login', query: { redirect } } : '/login'
})

const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const code = ref('')
const showValidation = ref(false)

const verifying = ref(false)
const resending = ref(false)
const isLoading = computed(() => verifying.value || resending.value)

const errorMessage = ref('')
const successMessage = ref('')
const resendMessage = ref('')

const resendCooldown = ref(0)
let resendInterval: number | null = null

const emailError = computed(() => {
  if (!email.value) return t('validation.required')
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  return valid ? '' : t('validation.emailInvalid')
})

const codeError = computed(() => {
  if (!code.value) return t('validation.required')
  return /^\d{6}$/.test(code.value) ? '' : t('validation.codeInvalid')
})

const startCooldown = (seconds: number) => {
  resendCooldown.value = seconds

  if (resendInterval) {
    window.clearInterval(resendInterval)
  }

  resendInterval = window.setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value -= 1
      return
    }

    if (resendInterval) {
      window.clearInterval(resendInterval)
      resendInterval = null
    }
  }, 1000)
}

const handleVerify = async () => {
  if (verifying.value || resending.value) return

  showValidation.value = true
  errorMessage.value = ''
  clearErrors()

  if (emailError.value || codeError.value) {
    return
  }

  verifying.value = true

  try {
    await http.post('/api/auth/verify-email', {
      email: email.value,
      code: code.value,
    })

    toastStore.success(t('auth.verifySuccess'))

    setTimeout(async () => {
      const query: Record<string, string> = {}
      const redirect = route.query.redirect as string | undefined
      if (redirect) query.redirect = redirect
      await router.push({ path: '/login', query })
    }, 1200)
  } catch (error: unknown) {
    if (handleApiError(error)) {
      errorMessage.value = t('auth.verifyErrorFallback')
      return
    }

    errorMessage.value = handleError(error, t('auth.verifyErrorFallback'), { toast: false })
  } finally {
    verifying.value = false
  }
}

const handleResend = async () => {
  if (resending.value || verifying.value || resendCooldown.value > 0) return

  showValidation.value = true
  errorMessage.value = ''
  clearErrors()

  if (emailError.value) {
    return
  }

  resending.value = true

  try {
    await http.post('/api/auth/resend-verification', {
      email: email.value,
      locale: locale.value,
    })

    toastStore.success(t('auth.verifyResendSuccess'))
    startCooldown(60)
  } catch (error: unknown) {
    if (handleApiError(error)) {
      errorMessage.value = t('auth.verifyResendFailed')
      return
    }

    errorMessage.value = handleError(error, t('auth.verifyResendFailed'), { toast: false })
  } finally {
    resending.value = false
  }
}


onBeforeUnmount(() => {
  if (resendInterval) {
    window.clearInterval(resendInterval)
  }
})
</script>
