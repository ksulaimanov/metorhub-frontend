<template>
   <AuthSplitShell
      :badge="t('auth.verifyHeroBadge')"
      :title="t('auth.verifyHeroTitle')"
      :subtitle="t('auth.verifyHeroSubtitle')"
  >
    <!-- Left info cards -->
    <template #cards>
      <FeatureCard :title="t('auth.verifyHeroSecureTitle')" :description="t('auth.verifyHeroSecureDesc')" />
      <FeatureCard :title="t('auth.verifyHeroFastTitle')" :description="t('auth.verifyHeroFastDesc')" />
    </template>

    <!-- Form -->
    <h1 class="text-2xl font-bold text-text-primary sm:text-3xl">{{ t('auth.verifyTitle') }}</h1>
    <p class="mt-2 text-sm text-text-secondary">{{ t('auth.verifySubtitle') }}</p>

    <form class="mt-8 space-y-5" @submit.prevent="handleVerify">
      <AppField :label="t('auth.email')" :error="showValidation ? emailError : ''">
        <AppInput
            v-model.trim="email"
            type="email"
            autocomplete="email"
            :error="showValidation && !!emailError"
            :placeholder="t('auth.emailPlaceholder')"
        />
      </AppField>

      <AppField :label="t('auth.verifyCode')" :error="showValidation ? codeError : ''">
        <AppInput
            v-model.trim="code"
            inputmode="numeric"
            maxlength="6"
            :error="showValidation && !!codeError"
            :placeholder="t('auth.verifyCodePlaceholder')"
            class="tracking-[0.35em]"
        />
      </AppField>

      <AppErrorState
          v-if="errorMessage"
          :title="t('auth.verifyFailed')"
          :description="errorMessage"
      />

      <InfoPanel v-if="successMessage" variant="success">
        {{ successMessage }}
      </InfoPanel>

      <AppButton
          type="submit"
          size="lg"
          :loading="verifying"
          class="w-full"
      >
        {{ verifying ? t('auth.verifyLoading') : t('auth.verifySubmit') }}
      </AppButton>
    </form>

    <!-- Resend block -->
    <InfoPanel class="mt-6" variant="muted">
      <p class="text-sm font-medium text-text-primary">{{ t('auth.verifyNoCode') }}</p>
      <p class="mt-1 text-sm text-text-secondary">{{ t('auth.verifyNoCodeDesc') }}</p>

      <AppButton
          variant="secondary"
          size="lg"
          :loading="resending"
          :disabled="resendCooldown > 0"
          class="mt-4 w-full"
          @click="handleResend"
      >
        <span v-if="resending">{{ t('auth.verifyResending') }}</span>
        <span v-else-if="resendCooldown > 0">
          {{ t('auth.verifyResendCooldown', { seconds: resendCooldown }) }}
        </span>
        <span v-else>{{ t('auth.verifyResend') }}</span>
      </AppButton>

      <p v-if="resendMessage" class="mt-3 text-sm text-emerald-600">
        {{ resendMessage }}
      </p>
    </InfoPanel>

    <!-- Footer slot -->
    <template #footer>
      <p class="text-center text-sm text-text-secondary">
        {{ t('auth.verifyAlreadyDone') }}
        <RouterLink to="/login" class="font-semibold text-brand transition hover:text-brand-hover">
          {{ t('auth.loginSubmit') }}
        </RouterLink>
      </p>
    </template>
  </AuthSplitShell>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()
const { handleError } = useErrorHandler()

const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const code = ref('')
const showValidation = ref(false)

const verifying = ref(false)
const resending = ref(false)

const errorMessage = ref('')
const successMessage = ref('')
const resendMessage = ref('')

const resendCooldown = ref(0)
let resendInterval: number | null = null

const emailError = computed(() => {
  if (!email.value) return t('validation.required')
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  return valid ? '' : t('validation.emailInvalid')
})

const codeError = computed(() => {
  if (!code.value) return t('validation.required')
  return /^\d{6}$/.test(code.value) ? '' : t('validation.codeInvalid')
})

const startCooldown = (seconds: number) => {
  resendCooldown.value = seconds

  if (resendInterval) {
    window.clearInterval(resendInterval)
  }

  resendInterval = window.setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value -= 1
      return
    }

    if (resendInterval) {
      window.clearInterval(resendInterval)
      resendInterval = null
    }
  }, 1000)
}

const handleVerify = async () => {
  showValidation.value = true

  if (emailError.value || codeError.value) {
    return
  }

  verifying.value = true

  try {
    await http.post('/api/auth/verify-email', {
      email: email.value,
      code: code.value,
    })

    toastStore.success(t('auth.verifySuccess'))

    setTimeout(async () => {
      await router.push('/login')
    }, 1200)
  } catch (error: any) {
    errorMessage.value = handleError(error, t('auth.verifyErrorFallback'))
  } finally {
    verifying.value = false
  }
}

const handleResend = async () => {
  showValidation.value = true

  if (emailError.value) {
    return
  }

  resending.value = true

  try {
    await http.post('/api/auth/resend-verification', {
      email: email.value,
    })

    toastStore.success(t('auth.verifyResendSuccess'))
    startCooldown(60)
  } catch (error: any) {
    errorMessage.value = handleError(error, t('auth.verifyResendFailed'))
  } finally {
    resending.value = false
  }
}


onBeforeUnmount(() => {
  if (resendInterval) {
    window.clearInterval(resendInterval)
  }
})
</script>