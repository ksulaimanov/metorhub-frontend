<template>
  <PublicLayout>
    <section class="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-10 sm:px-6">
      <div class="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
        <div class="hidden lg:block">
          <p class="inline-flex rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            {{ t('auth.registerHeroBadge') }}
          </p>

          <h1 class="mt-5 max-w-xl text-5xl font-bold leading-tight text-slate-900">
            {{ t('auth.registerHeroTitle') }}
          </h1>

          <p class="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            {{ t('auth.registerHeroSubtitle') }}
          </p>

          <div class="mt-8 grid max-w-xl gap-4">
            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 class="text-lg font-semibold text-slate-900">{{ t('auth.registerStudentCardTitle') }}</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                {{ t('auth.registerStudentCardDesc') }}
              </p>
            </div>

            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 class="text-lg font-semibold text-slate-900">{{ t('auth.registerMentorPrompt') }}</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                <RouterLink to="/mentor/apply" class="font-semibold text-slate-900 underline transition hover:opacity-70">
                  {{ t('auth.registerMentorPromptLink') }}
                </RouterLink>
              </p>
            </div>
          </div>
        </div>

        <div class="w-full max-w-xl justify-self-center rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h1 class="text-3xl font-bold text-slate-900">{{ t('auth.registerTitle') }}</h1>
          <p class="mt-2 text-sm text-slate-600">
            {{ t('auth.registerSubtitle') }}
          </p>

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
                    class="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
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

            <div
                v-if="successMessage"
                class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
            >
              {{ successMessage }}
            </div>

            <AppButton
                type="submit"
                size="lg"
                :loading="loading"
                class="w-full"
            >
              {{ loading ? t('auth.registerLoading') : t('auth.registerSubmit') }}
            </AppButton>

            <div class="text-center text-sm text-slate-600">
              {{ t('auth.hasAccount') }}
              <RouterLink to="/login" class="font-semibold text-slate-900 transition hover:opacity-70">
                {{ t('auth.loginSubmit') }}
              </RouterLink>
            </div>

            <div class="text-center text-sm text-slate-600 lg:hidden">
              {{ t('auth.registerMentorPrompt') }}
              <RouterLink to="/mentor/apply" class="font-semibold text-slate-900 transition hover:opacity-70">
                {{ t('auth.registerMentorPromptLink') }}
              </RouterLink>
            </div>
          </form>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
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