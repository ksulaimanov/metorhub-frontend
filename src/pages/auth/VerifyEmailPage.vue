<template>
  <PublicLayout>
    <section class="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-10 sm:px-6">
      <div class="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
        <div class="hidden lg:block">
          <p class="inline-flex rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            {{ t('auth.verifyHeroBadge') }}
          </p>

          <h1 class="mt-5 max-w-xl text-5xl font-bold leading-tight text-slate-900">
            {{ t('auth.verifyHeroTitle') }}
          </h1>

          <p class="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            {{ t('auth.verifyHeroSubtitle') }}
          </p>

          <div class="mt-8 grid max-w-xl gap-4">
            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 class="text-lg font-semibold text-slate-900">{{ t('auth.verifyHeroSecureTitle') }}</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                {{ t('auth.verifyHeroSecureDesc') }}
              </p>
            </div>

            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 class="text-lg font-semibold text-slate-900">{{ t('auth.verifyHeroFastTitle') }}</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                {{ t('auth.verifyHeroFastDesc') }}
              </p>
            </div>
          </div>
        </div>

        <div class="w-full max-w-md justify-self-center rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h1 class="text-3xl font-bold text-slate-900">{{ t('auth.verifyTitle') }}</h1>
          <p class="mt-2 text-sm text-slate-600">
            {{ t('auth.verifySubtitle') }}
          </p>

          <form class="mt-8 space-y-5" @submit.prevent="handleVerify">
            <AppField :label="t('auth.email')" :error="showValidation ? emailError : ''">
              <AppInput
                  v-model.trim="email"
                  type="email"
                  autocomplete="email"
                  :error="showValidation && !!emailError"
                  :placeholder="t('auth.emailPlaceholder')"
              />
            </AppField>

            <AppField :label="t('auth.verifyCode')" :error="showValidation ? codeError : ''">
              <AppInput
                  v-model.trim="code"
                  inputmode="numeric"
                  maxlength="6"
                  :error="showValidation && !!codeError"
                  :placeholder="t('auth.verifyCodePlaceholder')"
                  class="tracking-[0.35em]"
              />
            </AppField>

            <AppErrorState
                v-if="errorMessage"
                :title="t('auth.verifyFailed')"
                :description="errorMessage"
            />

            <div
                v-if="successMessage"
                class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
            >
              {{ successMessage }}
            </div>

            <AppButton
                type="submit"
                size="lg"
                :loading="verifying"
                class="w-full"
            >
              {{ verifying ? t('auth.verifyLoading') : t('auth.verifySubmit') }}
            </AppButton>
          </form>

          <div class="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p class="text-sm font-medium text-slate-900">{{ t('auth.verifyNoCode') }}</p>
            <p class="mt-1 text-sm text-slate-600">
              {{ t('auth.verifyNoCodeDesc') }}
            </p>

            <AppButton
                variant="secondary"
                size="lg"
                :loading="resending"
                :disabled="resendCooldown > 0"
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
          </div>

          <div class="mt-6 text-center text-sm text-slate-600">
            {{ t('auth.verifyAlreadyDone') }}
            <RouterLink to="/login" class="font-semibold text-slate-900 transition hover:opacity-70">
              {{ t('auth.loginSubmit') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { http } from '../../shared/api/http'
import { useToastStore } from '../../shared/lib/getApiErrorMessage'
import { useErrorHandler } from '../../shared/composables/useErrorHandler'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'
import AppField from '../../shared/ui/AppField.vue'
import AppInput from '../../shared/ui/AppInput.vue'
import AppButton from '../../shared/ui/AppButton.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()
const { handleError } = useErrorHandler()

const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const code = ref('')
const showValidation = ref(false)

const verifying = ref(false)
const resending = ref(false)

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
  showValidation.value = true

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
      await router.push('/login')
    }, 1200)
  } catch (error: any) {
    errorMessage.value = handleError(error, t('auth.verifyErrorFallback'))
  } finally {
    verifying.value = false
  }
}

const handleResend = async () => {
  showValidation.value = true

  if (emailError.value) {
    return
  }

  resending.value = true

  try {
    await http.post('/api/auth/resend-verification', {
      email: email.value,
    })

    toastStore.success(t('auth.verifyResendSuccess'))
    startCooldown(60)
  } catch (error: any) {
    errorMessage.value = handleError(error, t('auth.verifyResendFailed'))
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