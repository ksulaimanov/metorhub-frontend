<template>
  <AuthSplitShell
      :badge="t('auth.loginHeroBadge')"
      :title="t('auth.loginHeroTitle')"
      :subtitle="t('auth.loginHeroSubtitle')"
  >
    <!-- Left info cards -->
    <template #cards>
      <FeatureCard :title="t('auth.loginHeroStudentTitle')" :description="t('auth.loginHeroStudentDesc')" />
      <FeatureCard :title="t('auth.loginHeroMentorTitle')" :description="t('auth.loginHeroMentorDesc')" />
    </template>

    <!-- Form -->
    <h1 class="text-2xl font-bold text-text-primary sm:text-3xl">{{ t('auth.loginTitle') }}</h1>
    <p class="mt-2 text-sm text-text-secondary">{{ t('auth.loginSubtitle') }}</p>

    <form class="mt-8 space-y-5" @submit.prevent="handleLogin">
      <AppField :label="t('auth.email')" :error="showValidation ? emailError : ''">
        <AppInput
            v-model.trim="email"
            type="email"
            autocomplete="email"
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
              :error="showValidation && !!passwordError"
              :placeholder="t('auth.passwordEnterPlaceholder')"
              class="pr-24"
          />
          <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-sm font-medium text-text-secondary transition hover:bg-brand-soft hover:text-brand"
              @click="showPassword = !showPassword"
          >
            {{ showPassword ? t('auth.hidePassword') : t('auth.showPassword') }}
          </button>
        </div>
      </AppField>

      <AppErrorState
          v-if="errorMessage"
          :title="t('auth.loginFailed')"
          :description="errorMessage"
      />

      <div class="text-right">
        <RouterLink
            to="/forgot-password"
            class="text-sm font-medium text-brand transition hover:text-brand-hover"
        >
          {{ t('auth.forgotPassword') }}
        </RouterLink>
      </div>

      <!-- Verify-email rescue block -->
      <InfoPanel
          v-if="errorMessage && errorMessage.toLowerCase().includes('подтвержден')"
          variant="muted"
      >
        <p class="font-medium text-text-primary">{{ t('auth.loginNeedVerify') }}</p>
        <p class="mt-1 text-text-secondary">{{ t('auth.loginNeedVerifyDesc') }}</p>
        <RouterLink
            class="mt-3 inline-flex rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
            :to="{ path: '/verify-email', query: { email } }"
        >
          {{ t('auth.loginGoVerify') }}
        </RouterLink>
      </InfoPanel>

      <AppButton
          type="submit"
          size="lg"
          :loading="loading"
          class="w-full"
      >
        {{ loading ? t('auth.loginLoading') : t('auth.loginSubmit') }}
      </AppButton>

      <p class="text-center text-sm text-text-secondary">
        {{ t('auth.noAccount') }}
        <RouterLink to="/register" class="font-semibold text-brand transition hover:text-brand-hover">
          {{ t('auth.registerSubmit') }}
        </RouterLink>
      </p>
    </form>
  </AuthSplitShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { http } from '../../shared/api/http'
import { useAuthStore } from '../../stores/authStore'
import { useErrorHandler } from '../../shared/composables/useErrorHandler'
import AuthSplitShell from '../../shared/ui/AuthSplitShell.vue'
import FeatureCard from '../../shared/ui/FeatureCard.vue'
import InfoPanel from '../../shared/ui/InfoPanel.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'
import AppField from '../../shared/ui/AppField.vue'
import AppInput from '../../shared/ui/AppInput.vue'
import AppButton from '../../shared/ui/AppButton.vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const { handleError } = useErrorHandler()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)
const showValidation = ref(false)
const showPassword = ref(false)

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
  showValidation.value = true

  if (emailError.value || passwordError.value) {
    return
  }

  loading.value = true

  try {
    const { data } = await http.post('/api/auth/login', {
      email: email.value,
      password: password.value,
    })

    authStore.setAuth({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      email: data.email,
      roles: data.roles,
    })

    errorMessage.value = ''

    if (data.roles.includes('ROLE_MENTOR')) {
      await router.push('/mentor/dashboard')
      return
    }

    if (data.roles.includes('ROLE_STUDENT')) {
      await router.push('/student/dashboard')
      return
    }

    await router.push('/')
  } catch (error: any) {
    errorMessage.value = handleError(error, t('auth.loginErrorFallback'))
  } finally {
    loading.value = false
  }
}
</script>