<template>
  <PublicLayout>
    <section class="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-10 sm:px-6">
      <div class="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
        <div class="hidden lg:block">
          <p class="inline-flex rounded-full bg-brand-soft px-4 py-2 text-sm font-medium text-brand">
            {{ t('forgotPassword.heroBadge') }}
          </p>

          <h1 class="mt-5 max-w-xl text-5xl font-bold leading-tight text-text-primary">
            {{ t('forgotPassword.heroTitle') }}
          </h1>

          <p class="mt-6 max-w-lg text-lg leading-8 text-text-secondary">
            {{ t('forgotPassword.heroSubtitle') }}
          </p>
        </div>

        <div class="w-full max-w-md justify-self-center rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-border-brand sm:p-8">
          <h1 class="text-3xl font-bold text-text-primary">{{ t('forgotPassword.title') }}</h1>
          <p class="mt-2 text-sm text-text-secondary">
            {{ t('forgotPassword.subtitle') }}
          </p>

          <form class="mt-8 space-y-5" @submit.prevent="handleSubmit">
            <div>
              <label class="mb-2 block text-sm font-medium text-text-primary">{{ t('forgotPassword.emailLabel') }}</label>
              <input
                  v-model.trim="email"
                  type="email"
                  autocomplete="email"
                  class="w-full rounded-2xl border px-4 py-3 outline-none transition"
                  :class="fieldClass(showValidation && !!emailError)"
                  :placeholder="t('forgotPassword.emailPlaceholder')"
              />
              <p v-if="showValidation && emailError" class="mt-2 text-sm text-red-600">
                {{ emailError }}
              </p>
            </div>

            <AppErrorState
                v-if="errorMessage"
                :title="t('forgotPassword.errorTitle')"
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
                class="w-full rounded-2xl bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="loading"
            >
              {{ loading ? t('forgotPassword.submitLoading') : t('forgotPassword.submit') }}
            </button>

            <div class="text-center text-sm text-text-secondary">
              {{ t('forgotPassword.backToLogin') }}
              <RouterLink to="/login" class="font-semibold text-brand transition hover:text-brand-hover">
                {{ t('forgotPassword.backToLoginLink') }}
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

const { t } = useI18n()
const router = useRouter()
const toastStore = useToastStore()
const { handleError } = useErrorHandler()

const email = ref('')
const errorMessage = ref('')
const loading = ref(false)

const showValidation = ref(false)
const successMessage = ref('')

const emailError = computed(() => {
  if (!email.value) return t('forgotPassword.emailRequired')
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  return valid ? '' : t('forgotPassword.emailInvalid')
})

const fieldClass = (hasError: boolean) =>
    hasError
        ? 'border-red-300 focus:border-red-500'
        : 'border-border-brand focus:border-brand'

const handleSubmit = async () => {
  showValidation.value = true

  if (emailError.value) return

  loading.value = true

  try {
    await http.post('/api/auth/forgot-password', {
      email: email.value,
    })

    toastStore.success(t('forgotPassword.successToast'))

    setTimeout(async () => {
      await router.push({
        path: '/reset-password',
        query: { email: email.value },
      })
    }, 1000)
  } catch (error: any) {
    errorMessage.value = handleError(error, t('forgotPassword.errorFallback'), { toast: false })
  } finally {
    loading.value = false
  }
}
</script>
