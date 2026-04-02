<template>
  <PublicLayout>
    <section class="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-10 sm:px-6">
      <div class="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
        <div class="hidden lg:block">
          <p class="inline-flex rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            {{ t('resetPassword.heroBadge') }}
          </p>

          <h1 class="mt-5 max-w-xl text-5xl font-bold leading-tight text-slate-900">
            {{ t('resetPassword.heroTitle') }}
          </h1>

          <p class="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            {{ t('resetPassword.heroSubtitle') }}
          </p>
        </div>

        <div class="w-full max-w-md justify-self-center rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h1 class="text-3xl font-bold text-slate-900">{{ t('resetPassword.title') }}</h1>
          <p class="mt-2 text-sm text-slate-600">
            {{ t('resetPassword.subtitle') }}
          </p>

          <form class="mt-8 space-y-5" @submit.prevent="handleSubmit">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('resetPassword.emailLabel') }}</label>
              <input
                  v-model.trim="email"
                  type="email"
                  autocomplete="email"
                  class="w-full rounded-2xl border px-4 py-3 outline-none transition"
                  :class="fieldClass(showValidation && !!emailError)"
                  :placeholder="t('resetPassword.emailPlaceholder')"
              />
              <p v-if="showValidation && emailError" class="mt-2 text-sm text-red-600">
                {{ emailError }}
              </p>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('resetPassword.codeLabel') }}</label>
              <input
                  v-model.trim="code"
                  inputmode="numeric"
                  maxlength="6"
                  class="w-full rounded-2xl border px-4 py-3 tracking-[0.35em] outline-none transition"
                  :class="fieldClass(showValidation && !!codeError)"
                  :placeholder="t('resetPassword.codePlaceholder')"
              />
              <p v-if="showValidation && codeError" class="mt-2 text-sm text-red-600">
                {{ codeError }}
              </p>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('resetPassword.newPasswordLabel') }}</label>
              <input
                  v-model="newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  class="w-full rounded-2xl border px-4 py-3 outline-none transition"
                  :class="fieldClass(showValidation && !!newPasswordError)"
                  :placeholder="t('resetPassword.newPasswordPlaceholder')"
              />
              <p v-if="showValidation && newPasswordError" class="mt-2 text-sm text-red-600">
                {{ newPasswordError }}
              </p>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('resetPassword.confirmPasswordLabel') }}</label>
              <input
                  v-model="confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  class="w-full rounded-2xl border px-4 py-3 outline-none transition"
                  :class="fieldClass(showValidation && !!confirmPasswordError)"
                  :placeholder="t('resetPassword.confirmPasswordPlaceholder')"
              />
              <p v-if="showValidation && confirmPasswordError" class="mt-2 text-sm text-red-600">
                {{ confirmPasswordError }}
              </p>
            </div>

            <button
                type="button"
                class="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                @click="showPassword = !showPassword"
            >
              {{ showPassword ? t('resetPassword.hidePassword') : t('resetPassword.showPassword') }}
            </button>

            <AppErrorState
                v-if="errorMessage"
                :title="t('resetPassword.errorTitle')"
                :description="errorMessage"
            />

            <div
                v-if="successMessage"
                class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
            >
              {{ successMessage }}
            </div>

            <button
                type="submit"
                class="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="loading"
            >
              {{ loading ? t('resetPassword.submitLoading') : t('resetPassword.submit') }}
            </button>

            <div class="text-center text-sm text-slate-600">
              {{ t('resetPassword.needNewCode') }}
              <RouterLink
                  :to="{ path: '/forgot-password', query: { email } }"
                  class="font-semibold text-slate-900 transition hover:opacity-70"
              >
                {{ t('resetPassword.needNewCodeLink') }}
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
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { http } from '../../shared/api/http'
import { useToastStore } from '../../shared/lib/getApiErrorMessage'
import { useErrorHandler } from '../../shared/composables/useErrorHandler'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()
const { handleError } = useErrorHandler()

const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const code = ref('')
const successMessage = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showValidation = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const emailError = computed(() => {
  if (!email.value) return t('resetPassword.emailRequired')
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  return valid ? '' : t('resetPassword.emailInvalid')
})

const codeError = computed(() => {
  if (!code.value) return t('resetPassword.codeRequired')
  return /^\d{6}$/.test(code.value) ? '' : t('resetPassword.codeInvalid')
})

const newPasswordError = computed(() => {
  if (!newPassword.value) return t('resetPassword.passwordRequired')
  return newPassword.value.length >= 8 ? '' : t('resetPassword.passwordMin')
})

const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return t('resetPassword.confirmRequired')
  return confirmPassword.value === newPassword.value ? '' : t('resetPassword.confirmMismatch')
})

const fieldClass = (hasError: boolean) =>
    hasError
        ? 'border-red-300 focus:border-red-500'
        : 'border-slate-300 focus:border-slate-900'

const handleSubmit = async () => {
  showValidation.value = true

  if (
      emailError.value ||
      codeError.value ||
      newPasswordError.value ||
      confirmPasswordError.value
  ) {
    return
  }

  loading.value = true

  try {
    await http.post('/api/auth/reset-password', {
      email: email.value,
      code: code.value,
      newPassword: newPassword.value,
    })

    toastStore.success(t('resetPassword.successToast'))

    setTimeout(async () => {
      await router.push('/login')
    }, 1200)
  } catch (error: any) {
    errorMessage.value = handleError(error, t('resetPassword.errorFallback'), { toast: false })
  } finally {
    loading.value = false
  }
}
</script>