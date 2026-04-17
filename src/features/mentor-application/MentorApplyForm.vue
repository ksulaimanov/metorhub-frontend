<template>
  <div class="space-y-8">
    <!-- Success state -->
    <div
      v-if="isSuccess"
      class="rounded-2xl border border-green-500/20 bg-green-500/10 p-6 text-center"
    >
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
        <svg class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 class="mt-4 text-lg font-bold text-slate-900 dark:text-slate-300">
        {{ t('mentorApplication.submitSuccess') }}
      </h3>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {{ t('mentorApplication.submitSuccessDesc') }}
      </p>
    </div>

    <!-- Live Preview Card -->
    <div v-if="!isSuccess" class="rounded-2xl border border-violet-100 bg-violet-50/50 p-5 dark:border-violet-800 dark:bg-violet-900/20">
      <h3 class="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
        Предпросмотр профиля для учеников
      </h3>
      <div class="flex items-start gap-4">
        <!-- Replaced with requested AppAvatar / ProfileAvatar component with Violet-600 background -->
        <ProfileAvatar
            :first-name="authStore.initials"
            size="lg"
            class="!h-14 !w-14 !bg-gradient-to-br !from-violet-600 !to-indigo-500 !text-lg !font-bold !text-white !ring-2 !ring-white dark:!ring-slate-800"
        />
        <div class="flex-1">
          <div class="text-base font-bold text-slate-900 dark:text-white">
            {{ authStore.displayName || 'Имя Фамилия' }}
          </div>
          <div class="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            <span v-if="form.motivationText">{{ form.motivationText }}</span>
            <span v-else class="italic opacity-60">Заполните поля ниже, чтобы увидеть, как будет выглядеть ваш профиль...</span>
          </div>
          <div v-if="form.portfolioUrl" class="mt-2 text-xs font-medium text-violet-600 dark:text-violet-400">
            🔗 Портфолио прикреплено
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
import { useAuthStore } from '../../stores/authStore'
import { submitMentorApplication } from '../../shared/api/mentorApplicationApi'
import { useErrorHandler } from '../../shared/composables/useErrorHandler'
import AppField from '../../shared/ui/AppField.vue'
import AppInput from '../../shared/ui/AppInput.vue'
import AppTextarea from '../../shared/ui/AppTextarea.vue'
import AppButton from '../../shared/ui/AppButton.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'
import ProfileAvatar from '../../shared/ui/ProfileAvatar.vue'

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
  @apply text-slate-900 dark:text-slate-300 font-semibold;
}
:deep(.text-slate-400) {
  @apply text-slate-600 dark:text-slate-400;
}
:deep(textarea),
:deep(input) {
  @apply text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 placeholder:text-slate-400 dark:placeholder:text-slate-500;
}
</style>
