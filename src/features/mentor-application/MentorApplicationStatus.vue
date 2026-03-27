<template>
  <div class="space-y-6">
    <form v-if="!statusData" class="space-y-5" @submit.prevent="handleCheck">
      <AppField :label="t('mentorApplication.statusEmail')" :error="showValidation ? emailError : ''" required>
        <AppInput
            v-model.trim="email"
            type="email"
            autocomplete="email"
            :error="showValidation && !!emailError"
            :placeholder="t('mentorApplication.emailPlaceholder')"
        />
      </AppField>

      <AppField :label="t('mentorApplication.statusToken')" :error="showValidation ? tokenError : ''" required>
        <AppInput
            v-model.trim="token"
            :error="showValidation && !!tokenError"
            :placeholder="t('mentorApplication.statusTokenPlaceholder')"
        />
      </AppField>

      <AppErrorState
          v-if="errorMessage"
          :title="t('mentorApplication.statusCheckFailed')"
          :description="errorMessage"
      />

      <AppButton
          type="submit"
          size="lg"
          :loading="loading"
          class="w-full"
      >
        {{ loading ? t('mentorApplication.statusChecking') : t('mentorApplication.statusCheck') }}
      </AppButton>
    </form>

    <div v-else class="space-y-4">
      <div class="flex items-center gap-3">
        <AppBadge :variant="statusVariant">{{ statusLabel }}</AppBadge>
      </div>

      <p class="text-sm text-text-secondary">{{ statusDescription }}</p>

      <div class="grid gap-3 text-sm">
        <div class="rounded-2xl bg-brand-soft/40 p-4 ring-1 ring-border-brand/60">
          <p class="font-medium text-text-primary">{{ t('mentorApplication.statusSubmittedAt') }}</p>
          <p class="mt-1 text-text-secondary">{{ formatDate(statusData.submittedAt) }}</p>
        </div>

        <div v-if="statusData.reviewedAt" class="rounded-2xl bg-brand-soft/40 p-4 ring-1 ring-border-brand/60">
          <p class="font-medium text-text-primary">{{ t('mentorApplication.statusReviewedAt') }}</p>
          <p class="mt-1 text-text-secondary">{{ formatDate(statusData.reviewedAt) }}</p>
        </div>

        <div v-if="statusData.reviewComment" class="rounded-2xl bg-brand-soft/40 p-4 ring-1 ring-border-brand/60">
          <p class="font-medium text-text-primary">{{ t('mentorApplication.statusReviewComment') }}</p>
          <p class="mt-1 text-text-secondary">{{ statusData.reviewComment }}</p>
        </div>
      </div>

      <AppButton variant="secondary" class="w-full" @click="reset">
        {{ t('common.back') }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { MentorApplicationStatusResponse } from '../../shared/types/mentorApplication'
import { getMentorApplicationStatus } from '../../shared/api/mentorApplicationApi'
import { useErrorHandler } from '../../shared/composables/useErrorHandler'
import AppField from '../../shared/ui/AppField.vue'
import AppInput from '../../shared/ui/AppInput.vue'
import AppButton from '../../shared/ui/AppButton.vue'
import AppBadge from '../../shared/ui/AppBadge.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'

const { t } = useI18n()
const route = useRoute()
const { handleError } = useErrorHandler()

const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const token = ref(typeof route.query.token === 'string' ? route.query.token : '')
const showValidation = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const statusData = ref<MentorApplicationStatusResponse | null>(null)

const emailError = computed(() => {
  if (!email.value) return t('validation.required')
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  return valid ? '' : t('validation.emailInvalid')
})

const tokenError = computed(() => {
  if (!token.value) return t('validation.required')
  return ''
})

const statusVariant = computed((): 'default' | 'success' | 'warning' | 'danger' => {
  if (!statusData.value) return 'default'
  const map: Record<string, 'success' | 'warning' | 'danger'> = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'danger',
  }
  return map[statusData.value.status] || 'default'
})

const statusLabel = computed(() => {
  if (!statusData.value) return ''
  const map: Record<string, string> = {
    PENDING: t('mentorApplication.statusPending'),
    APPROVED: t('mentorApplication.statusApproved'),
    REJECTED: t('mentorApplication.statusRejected'),
  }
  return map[statusData.value.status] || statusData.value.status
})

const statusDescription = computed(() => {
  if (!statusData.value) return ''
  const map: Record<string, string> = {
    PENDING: t('mentorApplication.statusPendingDesc'),
    APPROVED: t('mentorApplication.statusApprovedDesc'),
    REJECTED: t('mentorApplication.statusRejectedDesc'),
  }
  return map[statusData.value.status] || ''
})

const formatDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat('ru', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return value
  }
}

const handleCheck = async () => {
  showValidation.value = true
  errorMessage.value = ''

  if (emailError.value || tokenError.value) return

  loading.value = true

  try {
    statusData.value = await getMentorApplicationStatus(email.value, token.value)
  } catch (error: any) {
    errorMessage.value = handleError(error, t('mentorApplication.statusCheckFailed'))
  } finally {
    loading.value = false
  }
}

const reset = () => {
  statusData.value = null
  errorMessage.value = ''
}
</script>

