<template>
  <form class="space-y-6" @submit.prevent="$emit('save')">
    <!-- Main info section -->
    <AppCard>
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold text-white">{{ t('mentorProfile.sectionMain') }}</h2>
          <p class="mt-1 text-sm text-text-secondary">{{ t('mentorProfile.sectionMainHint') }}</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <AppField :label="t('mentorProfile.firstName')" :error="showValidation ? (fieldErrors.firstName || (!form.firstName ? t('validation.required') : '')) : ''">
            <AppInput v-model="form.firstName" :placeholder="t('mentorProfile.firstNamePlaceholder')" />
          </AppField>

          <AppField :label="t('mentorProfile.lastName')" :error="showValidation ? (fieldErrors.lastName || (!form.lastName ? t('validation.required') : '')) : ''">
            <AppInput v-model="form.lastName" :placeholder="t('mentorProfile.lastNamePlaceholder')" />
          </AppField>

          <AppField :label="t('mentorProfile.headline')" :hint="t('mentorProfile.headlineHint')" class="md:col-span-2">
            <AppInput v-model="form.headline" :placeholder="t('mentorProfile.headlinePlaceholder')" />
          </AppField>

          <AppField :label="t('mentorProfile.specialization')">
            <AppInput v-model="form.specialization" :placeholder="t('mentorProfile.specializationPlaceholder')" />
          </AppField>

          <AppField :label="t('mentorProfile.city')">
            <AppInput v-model="form.city" :placeholder="t('mentorProfile.cityPlaceholder')" />
          </AppField>

          <AppField :label="t('mentorProfile.yearsExperience')">
            <input
                v-model.number="form.yearsExperience"
                type="number"
                min="0"
                class="w-full rounded-2xl border border-border-brand bg-surface border border-white/10 shadow-md px-4 py-3 text-sm outline-none transition placeholder:text-text-secondary focus:border-brand focus:ring-2 focus:ring-brand-soft"
                :placeholder="t('mentorProfile.yearsExperiencePlaceholder')"
            />
          </AppField>

          <AppField :label="t('mentorProfile.pricePerHour')">
            <input
                v-model.number="form.pricePerHour"
                type="number"
                min="0"
                class="w-full rounded-2xl border border-border-brand bg-surface px-4 py-3 text-sm outline-none transition placeholder:text-text-secondary focus:border-brand focus:ring-2 focus:ring-brand-soft"
                :placeholder="t('mentorProfile.pricePerHourPlaceholder')"
            />
          </AppField>
        </div>
      </div>
    </AppCard>

    <!-- Lesson format section -->
    <AppCard>
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold text-text-primary">{{ t('mentorProfile.sectionFormat') }}</h2>
          <p class="mt-1 text-sm text-text-secondary">{{ t('mentorProfile.sectionFormatHint') }}</p>
        </div>

        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label class="flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition"
                 :class="form.lessonFormatOnline ? 'border-brand bg-brand-soft/30' : 'border-border-brand hover:border-brand/50'">
            <input v-model="form.lessonFormatOnline" type="checkbox" class="mt-1 h-4 w-4 accent-brand" />
            <span class="block">
              <p class="font-medium text-text-primary">{{ t('mentorProfile.formatOnline') }}</p>
              <p class="text-sm text-text-secondary">{{ t('mentorProfile.formatOnlineDesc') }}</p>
            </span>
          </label>

          <label class="flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition"
                 :class="form.lessonFormatOffline ? 'border-brand bg-brand-soft/30' : 'border-border-brand hover:border-brand/50'">
            <input v-model="form.lessonFormatOffline" type="checkbox" class="mt-1 h-4 w-4 accent-brand" />
            <span class="block">
              <p class="font-medium text-text-primary">{{ t('mentorProfile.formatOffline') }}</p>
              <p class="text-sm text-text-secondary">{{ t('mentorProfile.formatOfflineDesc') }}</p>
            </span>
          </label>

          <label class="flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition"
                 :class="form.lessonFormatHybrid ? 'border-brand bg-brand-soft/30' : 'border-border-brand hover:border-brand/50'">
            <input v-model="form.lessonFormatHybrid" type="checkbox" class="mt-1 h-4 w-4 accent-brand" />
            <span class="block">
              <p class="font-medium text-text-primary">{{ t('mentorProfile.formatHybrid') }}</p>
              <p class="text-sm text-text-secondary">{{ t('mentorProfile.formatHybridDesc') }}</p>
            </span>
          </label>

          <label class="flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition"
                 :class="form.public ? 'border-brand bg-brand-soft/30' : 'border-border-brand hover:border-brand/50'">
            <input v-model="form.public" type="checkbox" class="mt-1 h-4 w-4 accent-brand" />
            <span class="block">
              <p class="font-medium text-text-primary">{{ t('mentorProfile.publicProfileLabel') }}</p>
              <p class="text-sm text-text-secondary">{{ t('mentorProfile.publicProfileDesc') }}</p>
            </span>
          </label>
        </div>

        <p v-if="formatError" class="text-sm font-medium text-danger">{{ formatError }}</p>
      </div>
    </AppCard>

    <!-- Contacts section -->
    <AppCard>
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold text-text-primary">{{ t('mentorProfile.sectionContacts') }}</h2>
          <p class="mt-1 text-sm text-text-secondary">{{ t('mentorProfile.sectionContactsHint') }}</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <AppField :label="t('mentorProfile.address')" class="md:col-span-2">
            <AppInput v-model="form.addressText" :placeholder="t('mentorProfile.addressPlaceholder')" />
          </AppField>

          <AppField :label="t('mentorProfile.meetingLink')" class="md:col-span-2">
            <AppInput v-model="form.meetingLink" :placeholder="t('mentorProfile.meetingLinkPlaceholder')" />
          </AppField>
        </div>
      </div>
    </AppCard>

    <!-- Social links section -->
    <AppCard>
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold text-text-primary">{{ t('mentorProfile.sectionSocial') }}</h2>
          <p class="mt-1 text-sm text-text-secondary">{{ t('mentorProfile.sectionSocialHint') }}</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <AppField :label="t('mentorProfile.instagramUrl')" :hint="t('mentorProfile.instagramHint')">
            <AppInput v-model="form.instagramUrl" :placeholder="t('mentorProfile.instagramPlaceholder')" />
          </AppField>

          <AppField :label="t('mentorProfile.telegramUsername')" :hint="t('mentorProfile.telegramHint')">
            <AppInput v-model="form.telegramUsername" :placeholder="t('mentorProfile.telegramPlaceholder')" />
          </AppField>

          <AppField :label="t('mentorProfile.publicEmail')" :hint="t('mentorProfile.publicEmailHint')" class="md:col-span-2">
            <AppInput v-model="form.publicEmail" :placeholder="t('mentorProfile.publicEmailPlaceholder')" />
          </AppField>
        </div>
      </div>
    </AppCard>

    <!-- Bio section -->
    <AppCard>
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold text-text-primary">{{ t('mentorProfile.sectionBio') }}</h2>
          <p class="mt-1 text-sm text-text-secondary">{{ t('mentorProfile.sectionBioHint') }}</p>
        </div>

        <AppField :label="t('mentorProfile.bioLabel')">
          <AppTextarea
              v-model="form.bio"
              :placeholder="t('mentorProfile.bioPlaceholder')"
              rows="6"
          />
        </AppField>
      </div>
    </AppCard>

    <!-- Submit -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-h-[24px]">
        <p v-if="successMessage" class="text-sm font-medium text-success">{{ successMessage }}</p>
        <p v-else-if="errorMessage" class="text-sm font-medium text-danger">{{ errorMessage }}</p>
      </div>

      <div class="flex items-center gap-3">
        <AppButton variant="ghost" size="md" @click="$emit('cancel')">
          {{ t('common.cancel') }}
        </AppButton>
        <AppButton type="submit" size="lg" :loading="saving">
          {{ t('mentorProfile.saveChanges') }}
        </AppButton>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppCard from '@/shared/ui/AppCard.vue'
import AppField from '@/shared/ui/AppField.vue'
import AppInput from '@/shared/ui/AppInput.vue'
import AppTextarea from '@/shared/ui/AppTextarea.vue'
import AppButton from '@/shared/ui/AppButton.vue'

const { t } = useI18n()

interface MentorProfileFormData {
  firstName: string
  lastName: string
  headline: string
  bio: string
  specialization: string
  yearsExperience: number
  lessonFormatOnline: boolean
  lessonFormatOffline: boolean
  lessonFormatHybrid: boolean
  city: string
  addressText: string
  meetingLink: string
  pricePerHour: number
  public: boolean
  instagramUrl: string
  telegramUsername: string
  publicEmail: string
}

const props = defineProps<{
  form: MentorProfileFormData
  saving: boolean
  successMessage: string
  errorMessage: string
  showValidation: boolean
  fieldErrors: Record<string, string>
}>()

defineEmits<{
  (e: 'save'): void
  (e: 'cancel'): void
}>()

const formatError = computed(() => {
  if (!props.form.lessonFormatOnline && !props.form.lessonFormatOffline && !props.form.lessonFormatHybrid) {
    return t('mentorProfile.formatError')
  }
  return ''
})
</script>

