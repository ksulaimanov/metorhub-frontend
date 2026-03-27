<template>
  <AuthSplitShell
      :badge="t('auth.registerHeroBadge')"
      :title="t('auth.registerHeroTitle')"
      :subtitle="t('auth.registerHeroSubtitle')"
  >
    <!-- Left info cards -->
    <template #cards>
      <FeatureCard :title="t('auth.registerStudentCardTitle')" :description="t('auth.registerStudentCardDesc')" />
      <FeatureCard>
        <template #title>{{ t('auth.registerMentorPrompt') }}</template>
        <RouterLink to="/mentor/apply" class="font-semibold text-brand underline transition hover:text-brand-hover">
          {{ t('auth.registerMentorPromptLink') }}
        </RouterLink>
      </FeatureCard>
    </template>

    <!-- Form -->
    <h1 class="text-2xl font-bold text-text-primary sm:text-3xl">{{ t('auth.registerTitle') }}</h1>
    <p class="mt-2 text-sm text-text-secondary">{{ t('auth.registerSubtitle') }}</p>

    <form class="mt-8 space-y-5" @submit.prevent="handleRegister">
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
              autocomplete="new-password"
              :error="showValidation && !!passwordError"
              :placeholder="t('auth.passwordPlaceholder')"
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

      <AppField :label="t('auth.confirmPassword')" :error="showValidation ? confirmPasswordError : ''">
        <AppInput
            v-model="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            :error="showValidation && !!confirmPasswordError"
            :placeholder="t('auth.confirmPasswordPlaceholder')"
        />
      </AppField>

      <AppErrorState
          v-if="errorMessage"
          :title="t('auth.registerFailed')"
          :description="errorMessage"
      />

      <InfoPanel v-if="successMessage" variant="success">
        {{ successMessage }}
      </InfoPanel>

      <AppButton
          type="submit"
          size="lg"
          :loading="loading"
          class="w-full"
      >
        {{ loading ? t('auth.registerLoading') : t('auth.registerSubmit') }}
      </AppButton>

      <p class="text-center text-sm text-text-secondary">
        {{ t('auth.hasAccount') }}
        <RouterLink to="/login" class="font-semibold text-brand transition hover:text-brand-hover">
          {{ t('auth.loginSubmit') }}
        </RouterLink>
      </p>

      <!-- Mentor prompt for mobile (visible only when left panel is hidden) -->
      <p class="text-center text-sm text-text-secondary lg:hidden">
        {{ t('auth.registerMentorPrompt') }}
        <RouterLink to="/mentor/apply" class="font-semibold text-brand transition hover:text-brand-hover">
          {{ t('auth.registerMentorPromptLink') }}
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
import { useToastStore } from '../../shared/lib/getApiErrorMessage'
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
const toastStore = useToastStore()
const { handleError } = useErrorHandler()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
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

const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return t('validation.required')
  return confirmPassword.value === password.value ? '' : t('validation.passwordMismatch')
})

const handleRegister = async () => {
  showValidation.value = true
  errorMessage.value = ''
  successMessage.value = ''

  if (emailError.value || passwordError.value || confirmPasswordError.value) {
    return
  }

  loading.value = true

  try {
    await http.post('/api/auth/register/student', {
      email: email.value,
      password: password.value,
    })

    toastStore.success(t('auth.registerSuccess'))

    setTimeout(async () => {
      await router.push({
        path: '/verify-email',
        query: { email: email.value },
      })
    }, 900)
  } catch (error: any) {
    errorMessage.value = handleError(error, t('auth.registerErrorFallback'))
  } finally {
    loading.value = false
  }
}
</script>