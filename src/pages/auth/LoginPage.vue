<template>
  <PublicLayout>
    <section class="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-10 sm:px-6">
      <div class="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
        <div class="hidden lg:block">
          <p class="inline-flex rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            {{ t('auth.loginHeroBadge') }}
          </p>

          <h1 class="mt-5 max-w-xl text-5xl font-bold leading-tight text-slate-900">
            {{ t('auth.loginHeroTitle') }}
          </h1>

          <p class="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            {{ t('auth.loginHeroSubtitle') }}
          </p>

          <div class="mt-8 grid max-w-xl gap-4">
            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 class="text-lg font-semibold text-slate-900">{{ t('auth.loginHeroStudentTitle') }}</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                {{ t('auth.loginHeroStudentDesc') }}
              </p>
            </div>

            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 class="text-lg font-semibold text-slate-900">{{ t('auth.loginHeroMentorTitle') }}</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                {{ t('auth.loginHeroMentorDesc') }}
              </p>
            </div>
          </div>
        </div>

        <div class="w-full max-w-md justify-self-center rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h1 class="text-3xl font-bold text-slate-900">{{ t('auth.loginTitle') }}</h1>
          <p class="mt-2 text-sm text-slate-600">
            {{ t('auth.loginSubtitle') }}
          </p>

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
                    class="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
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
                  class="text-sm font-medium text-slate-700 transition hover:text-slate-900"
              >
                {{ t('auth.forgotPassword') }}
              </RouterLink>
            </div>

            <div
                v-if="errorMessage && errorMessage.toLowerCase().includes('подтвержден')"
                class="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200"
            >
              <p class="font-medium text-slate-900">{{ t('auth.loginNeedVerify') }}</p>
              <p class="mt-1">
                {{ t('auth.loginNeedVerifyDesc') }}
              </p>
              <RouterLink
                  class="mt-3 inline-flex rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:opacity-90"
                  :to="{ path: '/verify-email', query: { email } }"
              >
                {{ t('auth.loginGoVerify') }}
              </RouterLink>
            </div>

            <AppButton
                type="submit"
                size="lg"
                :loading="loading"
                class="w-full"
            >
              {{ loading ? t('auth.loginLoading') : t('auth.loginSubmit') }}
            </AppButton>

            <div class="text-center text-sm text-slate-600">
              {{ t('auth.noAccount') }}
              <RouterLink to="/register" class="font-semibold text-slate-900 transition hover:opacity-70">
                {{ t('auth.registerSubmit') }}
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
import { useAuthStore } from '../../stores/authStore'
import { useErrorHandler } from '../../shared/composables/useErrorHandler'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
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