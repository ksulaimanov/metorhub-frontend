<template>
  <AuthSplitShell
      :badge="t('resetPassword.heroBadge')"
      :title="t('resetPassword.heroTitle')"
      :subtitle="t('resetPassword.heroSubtitle')"
      :is-loading="loading"
  >
    <template #cards="{ isLoading }">
      <AuthHeroCards :is-loading="isLoading" />
    </template>

    <h1 class="text-2xl font-bold text-text-primary sm:text-3xl">{{ t('resetPassword.title') }}</h1>
    <p class="mt-2 text-sm text-text-secondary">
      {{ t('resetPassword.subtitle') }}
    </p>

    <form class="mt-8 space-y-2" @submit.prevent="handleSubmit">
      <AppField :label="t('resetPassword.emailLabel')" :error="showValidation ? emailError : ''">
        <AppInput
            v-model.trim="email"
            type="email"
            autocomplete="email"
            class="text-text-primary"
            :error="showValidation && !!emailError"
            :placeholder="t('resetPassword.emailPlaceholder')"
        />
      </AppField>

      <AppField :label="t('resetPassword.codeLabel')" :error="showValidation ? codeError : ''">
        <AppInput
            v-model.trim="code"
            inputmode="numeric"
            maxlength="6"
            class="tracking-[0.35em] text-text-primary"
            :error="showValidation && !!codeError"
            :placeholder="t('resetPassword.codePlaceholder')"
        />
      </AppField>

      <AppField :label="t('resetPassword.newPasswordLabel')" :error="showValidation ? newPasswordError : ''">
        <div class="relative">
          <AppInput
              v-model="newPassword"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              class="pr-24 text-text-primary"
              :error="showValidation && !!newPasswordError"
              :placeholder="t('resetPassword.newPasswordPlaceholder')"
          />
          <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary"
              @click="showPassword = !showPassword"
          >
            {{ showPassword ? t('resetPassword.hidePassword') : t('resetPassword.showPassword') }}
          </button>
        </div>
      </AppField>

      <AppField :label="t('resetPassword.confirmPasswordLabel')" :error="showValidation ? confirmPasswordError : ''">
        <AppInput
            v-model="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            class="text-text-primary"
            :error="showValidation && !!confirmPasswordError"
            :placeholder="t('resetPassword.confirmPasswordPlaceholder')"
        />
      </AppField>

      <AppErrorState
          v-if="errorMessage"
          class="!bg-red-500/10 !border-red-500/20"
          :title="t('resetPassword.errorTitle')"
          :description="errorMessage"
      />

      <InfoPanel v-if="successMessage" variant="success">
        {{ successMessage }}
      </InfoPanel>

      <AppButton
          type="submit"
          size="lg"
          :loading="loading"
          class="w-full shadow-[0_0_20px_rgba(108,92,231,0.4)] transition-all hover:shadow-[0_4px_25px_rgba(108,92,231,0.6)]"
      >
        {{ loading ? t('resetPassword.submitLoading') : t('resetPassword.submit') }}
      </AppButton>

      <div class="mt-6">
        <div class="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent border-0" />
      </div>
      <p class="pt-6 text-center text-sm text-text-secondary">
        {{ t('resetPassword.needNewCode') }}
        <RouterLink
            :to="{ path: '/forgot-password', query: { email } }"
            class="font-semibold text-brand-soft transition hover:text-brand-hover hover:underline"
        >
          {{ t('resetPassword.needNewCodeLink') }}
        </RouterLink>
      </p>
    </form>
  </AuthSplitShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { http } from '@/shared/api/http'
import { useToastStore } from '@/shared/lib/getApiErrorMessage'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
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

const handleSubmit = async () => {
  if (loading.value) return

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

    successMessage.value = t('resetPassword.successToast')
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
