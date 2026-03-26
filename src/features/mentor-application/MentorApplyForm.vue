<template>
  <div class="space-y-6">
    <div v-if="submitted" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
      <h2 class="text-lg font-semibold text-emerald-700">{{ t('mentorApplication.submitSuccess') }}</h2>
      <p class="mt-2 text-sm text-emerald-700">
        {{ t('mentorApplication.submitSuccessDesc') }}
      </p>
      <RouterLink
          :to="{ path: '/mentor/application/status', query: { email: form.email, token: submittedToken } }"
          class="mt-4 inline-flex rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        {{ t('mentorApplication.checkStatus') }}
      </RouterLink>
    </div>

    <form v-else class="space-y-5" @submit.prevent="handleSubmit">
      <AppField :label="t('mentorApplication.name')" :error="showValidation ? nameError : ''" required>
        <AppInput
            v-model.trim="form.name"
            :error="showValidation && !!nameError"
            :placeholder="t('mentorApplication.namePlaceholder')"
        />
      </AppField>

      <AppField :label="t('mentorApplication.email')" :error="showValidation ? emailError : ''" required>
        <AppInput
            v-model.trim="form.email"
            type="email"
            autocomplete="email"
            :error="showValidation && !!emailError"
            :placeholder="t('mentorApplication.emailPlaceholder')"
        />
      </AppField>

      <AppField :label="t('mentorApplication.phone')" :error="showValidation ? phoneError : ''" required>
        <AppInput
            v-model.trim="form.phone"
            type="tel"
            :error="showValidation && !!phoneError"
            :placeholder="t('mentorApplication.phonePlaceholder')"
        />
      </AppField>

      <AppField :label="t('mentorApplication.motivation')" :error="showValidation ? motivationError : ''" required>
        <AppTextarea
            v-model="form.motivation"
            :error="showValidation && !!motivationError"
            :placeholder="t('mentorApplication.motivationPlaceholder')"
            rows="4"
        />
      </AppField>

      <AppField :label="t('mentorApplication.experience')" :error="showValidation ? experienceError : ''" required>
        <AppTextarea
            v-model="form.experience"
            :error="showValidation && !!experienceError"
            :placeholder="t('mentorApplication.experiencePlaceholder')"
            rows="3"
        />
      </AppField>

      <AppField :label="t('mentorApplication.specializations')" :error="showValidation ? specializationsError : ''" required>
        <div class="grid gap-2 sm:grid-cols-2">
          <label
              v-for="(optLabel, key) in specializationOptions"
              :key="key"
              class="flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition"
              :class="form.specializations.includes(key) ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'"
          >
            <input
                type="checkbox"
                :checked="form.specializations.includes(key)"
                class="h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                @change="toggleSpecialization(key)"
            />
            <span class="text-sm font-medium text-slate-700">{{ optLabel }}</span>
          </label>
        </div>
      </AppField>

      <AppErrorState
          v-if="errorMessage"
          :title="t('mentorApplication.submitFailed')"
          :description="errorMessage"
      />

      <AppButton
          type="submit"
          size="lg"
          :loading="loading"
          class="w-full"
      >
        {{ loading ? t('mentorApplication.submitting') : t('mentorApplication.submit') }}
      </AppButton>

      <div class="text-center text-sm text-slate-600">
        {{ t('mentorApplication.hasAccount') }}
        <RouterLink to="/login" class="font-semibold text-slate-900 transition hover:opacity-70">
          {{ t('mentorApplication.hasAccountLink') }}
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { submitMentorApplication } from '../../shared/api/mentorApplicationApi'
import { useErrorHandler } from '../../shared/composables/useErrorHandler'
import AppField from '../../shared/ui/AppField.vue'
import AppInput from '../../shared/ui/AppInput.vue'
import AppTextarea from '../../shared/ui/AppTextarea.vue'
import AppButton from '../../shared/ui/AppButton.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'

const { t, tm } = useI18n()
const { handleError } = useErrorHandler()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  motivation: '',
  experience: '',
  specializations: [] as string[],
})

const showValidation = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const submitted = ref(false)
const submittedToken = ref('')

const specializationOptions = computed(() => {
  const raw = tm('mentorApplication.specializationOptions')
  if (raw && typeof raw === 'object') {
    const result: Record<string, string> = {}
    for (const [key, val] of Object.entries(raw)) {
      result[key] = typeof val === 'string' ? val : String(val)
    }
    return result
  }
  return {} as Record<string, string>
})

const nameError = computed(() => {
  if (!form.name) return t('validation.required')
  return ''
})

const emailError = computed(() => {
  if (!form.email) return t('validation.required')
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  return valid ? '' : t('validation.emailInvalid')
})

const phoneError = computed(() => {
  if (!form.phone) return t('validation.required')
  const valid = /^\+?[\d\s()-]{7,}$/.test(form.phone)
  return valid ? '' : t('validation.phoneInvalid')
})

const motivationError = computed(() => {
  if (!form.motivation) return t('validation.required')
  return form.motivation.length >= 50 ? '' : t('validation.minLength', { min: 50 })
})

const experienceError = computed(() => {
  if (!form.experience) return t('validation.required')
  return ''
})

const specializationsError = computed(() => {
  return form.specializations.length === 0 ? t('validation.selectAtLeastOne') : ''
})

const toggleSpecialization = (key: string) => {
  const index = form.specializations.indexOf(key)
  if (index === -1) {
    form.specializations.push(key)
  } else {
    form.specializations.splice(index, 1)
  }
}

const hasErrors = computed(() =>
    !!nameError.value ||
    !!emailError.value ||
    !!phoneError.value ||
    !!motivationError.value ||
    !!experienceError.value ||
    !!specializationsError.value
)

const handleSubmit = async () => {
  showValidation.value = true
  errorMessage.value = ''

  if (hasErrors.value) return

  loading.value = true

  try {
    const response = await submitMentorApplication({
      name: form.name,
      email: form.email,
      phone: form.phone,
      motivation: form.motivation,
      experience: form.experience,
      specializations: form.specializations,
    })

    submittedToken.value = response.token
    submitted.value = true
  } catch (error: any) {
    errorMessage.value = handleError(error, t('mentorApplication.submitErrorFallback'))
  } finally {
    loading.value = false
  }
}
</script>


