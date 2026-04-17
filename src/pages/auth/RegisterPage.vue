<template>
  <AuthSplitShell
      :badge="t('auth.registerHeroBadge')"
      :title="t('auth.registerHeroTitle')"
      :subtitle="t('auth.registerHeroSubtitle')"
  >
    <!-- Left info cards -->
    <template #cards>
      <FeatureCard class="!bg-white/5 !border-white/10 !text-white" :title="t('auth.registerStudentCardTitle')" :description="t('auth.registerStudentCardDesc')" />
      <FeatureCard class="!bg-white/5 !border-white/10 !text-white">
        <template #title>{{ t('auth.registerMentorPrompt') }}</template>
        <RouterLink to="/mentor/apply" class="font-semibold text-brand-soft underline transition hover:text-brand-hover">
          {{ t('auth.registerMentorPromptLink') }}
        </RouterLink>
      </FeatureCard>
    </template>

    <!-- Form -->
    <h1 class="text-2xl font-bold text-white sm:text-3xl">{{ t('auth.registerTitle') }}</h1>
    <p class="mt-2 text-sm text-slate-300">{{ t('auth.registerSubtitle') }}</p>

    <form class="mt-8 space-y-2" @submit.prevent="handleRegister">
      <AppField :label="t('auth.email')" :error="showValidation ? emailError : ''">
        <AppInput
            v-model.trim="email"
            type="email"
            autocomplete="email"
            class="text-white"
            :error="showValidation && !!emailError"
            :placeholder="t('auth.emailPlaceholder')"
        />
      </AppField>

      <AppField :label="t('auth.password')" :error="showValidation ? passwordError : ''" :hint="t('validation.passwordMin', { min: 8 })">
        <div class="relative">
          <AppInput
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              class="pr-24 text-white"
              :error="showValidation && !!passwordError"
              :placeholder="t('auth.passwordPlaceholder')"
          />
          <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              @click="showPassword = !showPassword"
          >
            {{ showPassword ? t('auth.hidePassword') : t('auth.showPassword') }}
          </button>
        </div>
      </AppField>

      <AppField :label="t('auth.passwordConfirm')" :error="showValidation ? passwordConfirmError : ''">
        <AppInput
            v-model="passwordConfirm"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            class="text-white"
            :error="showValidation && !!passwordConfirmError"
            :placeholder="t('auth.passwordConfirmPlaceholder')"
        />
      </AppField>

      <AppErrorState
          v-if="errorMessage"
          class="!bg-red-500/10 !border-red-500/20"
          :title="t('auth.registerFailed')"
          :description="errorMessage"
      />

      <div class="pt-4">
        <AppButton
            type="submit"
            size="lg"
            :loading="loading"
            class="w-full shadow-[0_0_20px_rgba(108,92,231,0.4)] transition-all hover:shadow-[0_4px_25px_rgba(108,92,231,0.6)]"
        >
          {{ loading ? t('auth.registerLoading') : t('auth.registerSubmit') }}
        </AppButton>
      </div>

      <div class="mt-6">
        <div class="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent border-0" />
      </div>
      <p class="pt-6 text-center text-sm text-slate-300">
        {{ t('auth.hasAccount') }}
        <RouterLink :to="loginLink" class="font-semibold text-brand-soft transition hover:text-brand-hover hover:underline">
          {{ t('auth.loginSubmit') }}
        </RouterLink>
      </p>
    </form>
  </AuthSplitShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { http } from '../../shared/api/http'
import { useToastStore } from '../../shared/lib/getApiErrorMessage'
import { useErrorHandler } from '../../shared/composables/useErrorHandler'
import AuthSplitShell from '../../shared/ui/AuthSplitShell.vue'
import FeatureCard from '../../shared/ui/FeatureCard.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'
import AppField from '../../shared/ui/AppField.vue'
import AppInput from '../../shared/ui/AppInput.vue'
import AppButton from '../../shared/ui/AppButton.vue'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()
const { handleError } = useErrorHandler()

const loginLink = computed(() => {
  const redirect = route.query.redirect as string | undefined
  return redirect ? { path: '/login', query: { redirect } } : '/login'
})

const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
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

const passwordConfirmError = computed(() => {
  if (!passwordConfirm.value) return t('validation.required')
  return passwordConfirm.value === password.value ? '' : t('validation.passwordMismatch')
})

const handleRegister = async () => {
  showValidation.value = true
  errorMessage.value = ''
  successMessage.value = ''

  if (emailError.value || passwordError.value || passwordConfirmError.value) {
    return
  }

  loading.value = true

  try {
    await http.post('/api/auth/register/student', {
      email: email.value,
      password: password.value,
      locale: locale.value,
    })

    toastStore.success(t('auth.registerSuccess'))

    setTimeout(async () => {
      const query: Record<string, string> = { email: email.value }
      const redirect = route.query.redirect as string | undefined
      if (redirect) query.redirect = redirect
      await router.push({ path: '/verify-email', query })
    }, 900)
  } catch (error: any) {
    errorMessage.value = handleError(error, t('auth.registerErrorFallback'), { toast: false })
  } finally {
    loading.value = false
  }
}
</script>
