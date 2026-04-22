<template>
  <AuthSplitShell
      :badge="t('auth.loginHeroBadge')"
      :title="t('auth.loginHeroTitle')"
      :subtitle="t('auth.loginHeroSubtitle')"
      :is-loading="loading"
  >
    <!-- Left info cards -->
    <template #cards="{ isLoading }">
      <AuthHeroCards :is-loading="isLoading" />
    </template>

    <!-- Form -->
    <h1 class="text-2xl font-bold text-text-primary sm:text-3xl">{{ t('auth.loginTitle') }}</h1>
    <p class="mt-2 text-sm text-text-secondary">{{ t('auth.loginSubtitle') }}</p>

    <form class="mt-8 space-y-2" @submit.prevent="handleLogin">
      <AppField :label="t('auth.email')" :error="showValidation ? emailError : ''">
        <AppInput
            v-model.trim="email"
            type="email"
            autocomplete="email"
            class="text-text-primary"
            :error="showValidation && !!emailError"
            :placeholder="t('auth.emailPlaceholder')"
        />
      </AppField>

      <AppField :label="t('auth.password')" :error="showValidation ? passwordError : ''">
        <div class="relative">
          <AppInput
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              class="pr-24 text-text-primary"
              :error="showValidation && !!passwordError"
              :placeholder="t('auth.passwordEnterPlaceholder')"
          />
          <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary"
              @click="showPassword = !showPassword"
          >
            {{ showPassword ? t('auth.hidePassword') : t('auth.showPassword') }}
          </button>
        </div>
      </AppField>

      <AppErrorState
          v-if="errorMessage"
          class="!bg-red-500/10 !border-red-500/20"
          :title="t('auth.loginFailed')"
          :description="errorMessage"
      />

      <div class="text-right pb-4">
        <RouterLink
            to="/forgot-password"
            class="text-sm font-medium text-brand-soft transition hover:text-brand-hover hover:underline"
        >
          {{ t('auth.forgotPassword') }}
        </RouterLink>
      </div>

      <!-- Verify-email rescue block -->
      <InfoPanel
          v-if="showVerifyHint"
          variant="muted"
          class="!bg-surface border border-border-brand"
      >
        <p class="font-medium text-text-primary">{{ t('auth.loginNeedVerify') }}</p>
        <p class="mt-1 text-text-secondary">{{ t('auth.loginNeedVerifyDesc') }}</p>
        <RouterLink
            class="mt-3 inline-flex rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-text-primary shadow-[0_0_15px_rgba(108,92,231,0.4)] transition hover:bg-brand-hover hover:-translate-y-0.5"
            :to="{ path: '/verify-email', query: { email } }"
        >
          {{ t('auth.loginGoVerify') }}
        </RouterLink>
      </InfoPanel>

      <AppButton
          type="submit"
          size="lg"
          :loading="loading"
          class="w-full shadow-[0_0_20px_rgba(108,92,231,0.4)] transition-all hover:shadow-[0_4px_25px_rgba(108,92,231,0.6)]"
      >
        {{ loading ? t('auth.loginLoading') : t('auth.loginSubmit') }}
      </AppButton>

      <div class="mt-6">
        <div class="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent border-0" />
      </div>
      <p class="pt-6 text-center text-sm text-text-secondary">
        {{ t('auth.noAccount') }}
        <RouterLink :to="registerLink" class="font-semibold text-brand-soft transition hover:text-brand-hover hover:underline">
          {{ t('auth.registerSubmit') }}
        </RouterLink>
      </p>
    </form>
  </AuthSplitShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { isAxiosError } from 'axios'
import { useAuthStore } from '@/entities/auth/model/authStore'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { useAuth } from '@/shared/composables/useAuth'
import { useToastStore } from '@/shared/lib/getApiErrorMessage'
import { ErrorCodes } from '@/constants/errorCodes'
import AuthSplitShell from '@/shared/ui/AuthSplitShell.vue'
import AuthHeroCards from '@/shared/ui/AuthHeroCards.vue'
import InfoPanel from '@/shared/ui/InfoPanel.vue'
import AppErrorState from '@/shared/ui/AppErrorState.vue'
import AppField from '@/shared/ui/AppField.vue'
import AppInput from '@/shared/ui/AppInput.vue'
import AppButton from '@/shared/ui/AppButton.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()
const { handleError } = useErrorHandler()
const { redirectAfterLogin } = useAuth()

const registerLink = computed(() => {
  const redirect = route.query.redirect as string | undefined
  return redirect ? { path: '/register', query: { redirect } } : '/register'
})

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)
const showValidation = ref(false)
const showPassword = ref(false)
const showVerifyHint = ref(false)

const emailError = computed(() => {
  if (!email.value) return t('validation.required')
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  return valid ? '' : t('validation.emailInvalid')
})

const passwordError = computed(() => {
  if (!password.value) return t('validation.required')
  return password.value.length >= 8 ? '' : t('validation.passwordMin', { min: 8 })
})

const handleLogin = async () => {
  if (loading.value) return

  showValidation.value = true
  showVerifyHint.value = false

  if (emailError.value || passwordError.value) {
    return
  }

  loading.value = true

  try {
    await authStore.login({ email: email.value, password: password.value })
    errorMessage.value = ''
    await redirectAfterLogin()
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const errorCode = error.response?.data?.errorCode as string | undefined

      if (error.response?.status === 401 && errorCode === ErrorCodes.EMAIL_NOT_VERIFIED) {
        showVerifyHint.value = true
        errorMessage.value = 'Пожалуйста, подтвердите ваш email.'
        toastStore.warning(errorMessage.value)
        await router.push({ path: '/verify-email', query: { email: authStore.pendingVerificationEmail || email.value } })
        return
      }

      if (error.response?.status === 401 && errorCode === ErrorCodes.INVALID_CREDENTIALS) {
        errorMessage.value = 'Неверный email или пароль.'
        toastStore.error(errorMessage.value)
        return
      }

      if (error.response?.status === 401 && errorCode === ErrorCodes.ACCOUNT_DISABLED) {
        errorMessage.value = 'Аккаунт заблокирован.'
        toastStore.error(errorMessage.value)
        return
      }
    }

    errorMessage.value = handleError(error, t('auth.loginErrorFallback'), { toast: false })
  } finally {
    loading.value = false
  }
}
</script>
