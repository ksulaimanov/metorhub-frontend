<template>
  <div class="space-y-8">
    <!-- Success state -->
    <div
      v-if="isSuccess"
      class="rounded-2xl border border-success-border bg-success-soft p-6 text-center"
    >
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-soft">
        <svg class="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 class="mt-4 text-lg font-bold text-text-primary">
        {{ t('mentorApplication.submitSuccess') }}
      </h3>
      <p class="mt-2 text-sm text-text-secondary">
        {{ t('mentorApplication.submitSuccessDesc') }}
      </p>
    </div>

    <!-- Live Preview Card -->
    <div v-if="!isSuccess" class="rounded-2xl border border-brand-border bg-brand-soft p-5">
      <h3 class="mb-4 text-sm font-semibold text-text-primary">
        {{ t('mentorApplication.previewTitle') }}
      </h3>
      <div class="flex items-start gap-4">
        <!-- Replaced with requested AppAvatar / ProfileAvatar component with Violet-600 background -->
        <ProfileAvatar
            :first-name="authStore.initials"
            size="lg"
            class="!h-14 !w-14 !bg-brand !text-lg !font-semibold !text-on-brand"
        />
        <div class="flex-1">
          <div class="text-base font-bold text-text-primary dark:text-white">
            {{ authStore.displayName || t('mentorApplication.previewNameFallback') }}
          </div>
          <div class="mt-1 text-sm text-text-secondary line-clamp-2">
            <span v-if="form.motivationText">{{ form.motivationText }}</span>
            <span v-else class="italic opacity-60">{{ t('mentorApplication.previewPlaceholder') }}</span>
          </div>
          <div v-if="form.portfolioUrl" class="mt-2 text-xs font-medium text-brand">
            {{ t('mentorApplication.previewPortfolioAttached') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Form -->
    <form v-if="!isSuccess" class="flex flex-col gap-6" @submit.prevent="handleSubmit">
      <AppField :label="t('mentorApplication.motivation')" :error="showValidation ? motivationTextError : ''" required>
        <AppTextarea
            v-model="form.motivationText"
            :error="showValidation && !!motivationTextError"
            :placeholder="t('mentorApplication.motivationPlaceholder')"
            rows="4"
        />
      </AppField>

      <AppField :label="t('mentorApplication.experience')" :error="showValidation ? experienceSummaryError : ''" required>
        <AppTextarea
            v-model="form.experienceSummary"
            :error="showValidation && !!experienceSummaryError"
            :placeholder="t('mentorApplication.experiencePlaceholder')"
            rows="3"
        />
      </AppField>

      <AppField :label="t('mentorApplication.portfolioUrl')" :error="showValidation ? portfolioUrlError : ''">
        <AppInput
            v-model.trim="form.portfolioUrl"
            type="url"
            :error="showValidation && !!portfolioUrlError"
            :placeholder="t('mentorApplication.portfolioUrlPlaceholder')"
        />
      </AppField>

      <AppErrorState
          v-if="errorMessage"
          :title="t('mentorApplication.submitFailed')"
          :description="errorMessage"
      />

      <div class="pt-2">
        <AppButton
            type="submit"
            size="lg"
            :loading="loading"
            class="w-full"
        >
          {{ loading ? t('mentorApplication.submitting') : t('mentorApplication.submit') }}
        </AppButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/entities/auth/model/authStore'
import { submitMentorApplication } from '@/shared/api/mentorApplicationApi'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import AppField from '@/shared/ui/AppField.vue'
import AppInput from '@/shared/ui/AppInput.vue'
import AppTextarea from '@/shared/ui/AppTextarea.vue'
import AppButton from '@/shared/ui/AppButton.vue'
import AppErrorState from '@/shared/ui/AppErrorState.vue'
import ProfileAvatar from '@/shared/ui/ProfileAvatar.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const { handleError } = useErrorHandler()

const form = reactive({
  motivationText: '',
  experienceSummary: '',
  portfolioUrl: '',
})

const showValidation = ref(false)
const loading = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')

const motivationTextError = computed(() => {
  if (!form.motivationText) return t('validation.required')
  if (form.motivationText.length < 50) return t('validation.minLength', { min: 50 })
  if (form.motivationText.length > 2000) return t('validation.maxLength', { max: 2000 })
  return ''
})

const experienceSummaryError = computed(() => {
  if (!form.experienceSummary) return t('validation.required')
  if (form.experienceSummary.length < 10) return t('validation.minLength', { min: 10 })
  if (form.experienceSummary.length > 2000) return t('validation.maxLength', { max: 2000 })
  return ''
})

const portfolioUrlError = computed(() => {
  if (!form.portfolioUrl) return ''
  try {
    new URL(form.portfolioUrl)
    return ''
  } catch {
    return t('validation.urlInvalid')
  }
})

const hasErrors = computed(() =>
    !!motivationTextError.value ||
    !!experienceSummaryError.value ||
    !!portfolioUrlError.value
)

const handleSubmit = async () => {
  showValidation.value = true
  errorMessage.value = ''

  if (hasErrors.value) return

  loading.value = true

  try {
    await submitMentorApplication({
      motivationText: form.motivationText,
      experienceSummary: form.experienceSummary,
      portfolioUrl: form.portfolioUrl || undefined,
    })

    isSuccess.value = true
  } catch (error: any) {
    if (error?.response?.status === 409) {
      errorMessage.value = t('mentorApplication.alreadySubmitted')
    } else {
      errorMessage.value = handleError(error, t('mentorApplication.submitErrorFallback'), { toast: false })
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@reference "../../assets/main.css";

/* Visual Contrast Cleanup for this form specifically */
:deep(label) {
  @apply text-text-primary font-semibold;
}
:deep(.text-text-secondary) {
  @apply text-text-secondary;
}
:deep(textarea),
:deep(input) {
  @apply text-text-primary bg-white border-border-default placeholder:text-text-secondary dark:placeholder:text-text-secondary;
}
</style>
