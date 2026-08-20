<template>
  <AuthSplitShell
      :badge="t('forgotPassword.heroBadge')"
      :title="t('forgotPassword.heroTitle')"
      :subtitle="t('forgotPassword.heroSubtitle')"
      :is-loading="loading"
  >
    <template #cards="{ isLoading }">
      <AuthHeroCards :is-loading="isLoading" />
    </template>

    <h1 class="text-2xl font-bold text-text-primary sm:text-3xl">{{ t('forgotPassword.title') }}</h1>
    <p class="mt-2 text-sm text-text-secondary">
      {{ t('forgotPassword.subtitle') }}
    </p>

    <form class="mt-8 space-y-2" @submit.prevent="handleSubmit">
      <AppField :label="t('forgotPassword.emailLabel')" :error="showValidation ? (fieldErrors.email || emailError) : ''">
        <AppInput
            v-model.trim="email"
            type="email"
            autocomplete="email"
            class="text-text-primary"
            :error="showValidation && !!(fieldErrors.email || emailError)"
            :placeholder="t('forgotPassword.emailPlaceholder')"
        />
      </AppField>

      <AppErrorState
          v-if="errorMessage"
          class="!bg-danger-soft !border-danger-border"
          :title="t('forgotPassword.errorTitle')"
          :description="errorMessage"
      />

      <InfoPanel v-if="successMessage" variant="success">
        {{ successMessage }}
      </InfoPanel>

      <AppButton
          type="submit"
          size="lg"
          :loading="loading"
          class="w-full shadow-md transition-all hover:shadow-md"
      >
        {{ loading ? t('forgotPassword.submitLoading') : t('forgotPassword.submit') }}
      </AppButton>

      <div class="mt-6">
        <div class="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent border-0" />
      </div>
      <p class="pt-6 text-center text-sm text-text-secondary">
        {{ t('forgotPassword.backToLogin') }}
        <RouterLink to="/login" class="font-semibold text-brand transition hover:text-brand-hover hover:underline">
          {{ t('forgotPassword.backToLoginLink') }}
        </RouterLink>
      </p>
    </form>
  </AuthSplitShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { http } from '@/shared/api/http'
import { useToastStore } from '@/shared/model/toastStore'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { useFormErrors } from '@/shared/composables/useFormErrors'
import AuthSplitShell from '@/shared/ui/AuthSplitShell.vue'
import AuthHeroCards from '@/shared/ui/AuthHeroCards.vue'
import InfoPanel from '@/shared/ui/InfoPanel.vue'
import AppErrorState from '@/shared/ui/AppErrorState.vue'
import AppField from '@/shared/ui/AppField.vue'
import AppInput from '@/shared/ui/AppInput.vue'
import AppButton from '@/shared/ui/AppButton.vue'

const { t } = useI18n()
const router = useRouter()
const toastStore = useToastStore()
const { handleError } = useErrorHandler()
const { fieldErrors, handleApiError, clearErrors } = useFormErrors()

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

const handleSubmit = async () => {
  if (loading.value) return

  showValidation.value = true
  clearErrors()

  if (emailError.value) return

  loading.value = true

  try {
    await http.post('/api/auth/forgot-password', {
      email: email.value,
    })

    successMessage.value = t('forgotPassword.successToast')
    toastStore.success(t('forgotPassword.successToast'))

    setTimeout(async () => {
      await router.push({
        path: '/reset-password',
        query: { email: email.value },
      })
    }, 1000)
  } catch (error: unknown) {
    if (handleApiError(error)) {
      errorMessage.value = t('forgotPassword.errorFallback')
      return
    }

    errorMessage.value = handleError(error, t('forgotPassword.errorFallback'), { toast: false })
  } finally {
    loading.value = false
  }
}
</script>
