<template>
  <PrivateLayout>
    <div class="space-y-8">
      <AppSectionTitle
          :title="t('studentProfile.title')"
          :description="t('studentProfile.description')"
      />

      <AppLoadingState v-if="loading" :text="t('studentProfile.loadingProfile')" />

      <AppErrorState
          v-else-if="pageError"
          :title="t('studentProfile.loadError')"
          :description="pageError"
      >
        <template #actions>
          <AppButton variant="secondary" size="sm" @click="loadProfile">{{ t('common.retry') }}</AppButton>
        </template>
      </AppErrorState>

      <template v-else>
        <!-- VIEW MODE (default) -->
        <StudentProfileView
            v-if="mode === 'view'"
            :profile="form"
            @edit="mode = 'edit'"
        />

        <!-- EDIT MODE -->
        <template v-else>
          <!-- Profile header with avatar -->
          <AppCard>
            <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div class="flex items-center gap-5">
                <ProfileAvatar
                    :src="form.avatarUrl"
                    :first-name="form.firstName"
                    :last-name="form.lastName"
                    :alt="t('studentProfile.avatarAlt')"
                    size="lg"
                />

                <div class="min-w-0">
                  <h2 class="text-xl font-semibold text-white">{{ fullName }}</h2>
                  <p class="mt-1 text-sm text-slate-400">{{ t('studentProfile.avatarHint') }}</p>
                </div>
              </div>

              <div class="flex shrink-0 flex-col gap-3 sm:flex-row">
                <label
                    class="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-border-brand bg-white/5 backdrop-blur-xl px-4 py-3 text-sm font-semibold text-text-primary transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <input type="file" class="hidden" accept="image/png,image/jpeg,image/webp" :disabled="avatarUploading" @change="handleAvatarUpload" />
                  {{ avatarUploading ? t('studentProfile.uploadingPhoto') : t('studentProfile.uploadPhoto') }}
                </label>

                <AppButton
                    v-if="form.avatarUrl"
                    variant="danger"
                    size="md"
                    :loading="avatarDeleting"
                    @click="confirmAvatarDelete"
                >
                  {{ t('studentProfile.deletePhoto') }}
                </AppButton>
              </div>
            </div>

            <p v-if="avatarMessage" class="mt-4 text-sm font-medium text-emerald-600">{{ avatarMessage }}</p>
            <p v-if="avatarError" class="mt-4 text-sm font-medium text-red-600">{{ avatarError }}</p>
          </AppCard>

          <form class="space-y-6" @submit.prevent="saveProfile">
            <!-- Main info -->
            <AppCard>
              <div class="space-y-6">
                <div>
                  <h2 class="text-xl font-semibold text-text-primary">{{ t('studentProfile.sectionMain') }}</h2>
                  <p class="mt-1 text-sm text-text-secondary">{{ t('studentProfile.sectionMainHint') }}</p>
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                  <AppField :label="t('studentProfile.firstName')" :error="fieldErrors.firstName">
                    <AppInput v-model="form.firstName" :placeholder="t('studentProfile.firstNamePlaceholder')" />
                  </AppField>

                  <AppField :label="t('studentProfile.lastName')" :error="fieldErrors.lastName">
                    <AppInput v-model="form.lastName" :placeholder="t('studentProfile.lastNamePlaceholder')" />
                  </AppField>

                  <AppField :label="t('studentProfile.city')">
                    <AppInput v-model="form.city" :placeholder="t('studentProfile.cityPlaceholder')" />
                  </AppField>

                  <AppField :label="t('studentProfile.phone')" :hint="t('studentProfile.phoneHint')">
                    <AppInput v-model="form.phone" :placeholder="t('studentProfile.phonePlaceholder')" />
                  </AppField>

                  <AppField :label="t('studentProfile.timezone')" :hint="t('studentProfile.timezoneHint')" class="md:col-span-2">
                    <AppInput v-model="form.timezone" :placeholder="t('studentProfile.timezonePlaceholder')" />
                  </AppField>
                </div>
              </div>
            </AppCard>

            <!-- Bio -->
            <AppCard>
              <div class="space-y-6">
                <div>
                  <h2 class="text-xl font-semibold text-text-primary">About / Learning Goals</h2>
                  <p class="mt-1 text-sm text-text-secondary">This information will be displayed to your mentors to help them prepare for lessons with you.</p>
                </div>

                <AppField label="Tell us about yourself and your tech goals" hint="Minimum 50 characters is recommended.">
                  <AppTextarea v-model="form.bio" placeholder="E.g., I want to learn frontend development to build my own startup..." rows="5" />
                </AppField>
              </div>
            </AppCard>

            <!-- Social links -->
            <AppCard>
              <div class="space-y-6">
                <div>
                  <h2 class="text-xl font-semibold text-text-primary">{{ t('studentProfile.sectionSocial') }}</h2>
                  <p class="mt-1 text-sm text-text-secondary">{{ t('studentProfile.sectionSocialHint') }}</p>
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                  <AppField :label="t('studentProfile.instagramUrl')">
                    <AppInput v-model="form.instagramUrl" :placeholder="t('studentProfile.instagramPlaceholder')" />
                  </AppField>

                  <AppField :label="t('studentProfile.telegramUsername')">
                    <AppInput v-model="form.telegramUsername" :placeholder="t('studentProfile.telegramPlaceholder')" />
                  </AppField>

                  <AppField :label="t('studentProfile.publicEmail')" class="md:col-span-2">
                    <AppInput v-model="form.publicEmail" :placeholder="t('studentProfile.publicEmailPlaceholder')" />
                  </AppField>
                </div>
              </div>
            </AppCard>

            <!-- Submit -->
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="min-h-[24px]">
                <p v-if="successMessage" class="text-sm font-medium text-emerald-600">{{ successMessage }}</p>
                <p v-else-if="saveError" class="text-sm font-medium text-red-600">{{ saveError }}</p>
              </div>

              <div class="flex items-center gap-3">
                <AppButton variant="ghost" size="md" @click="handleCancel">
                  {{ t('common.cancel') }}
                </AppButton>
                <AppButton type="submit" size="lg" :loading="saving">
                  {{ t('studentProfile.saveChanges') }}
                </AppButton>
              </div>
            </div>
          </form>
        </template>
      </template>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { http } from '@/shared/api/http'
import { useToastStore } from '@/shared/lib/getApiErrorMessage'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import PrivateLayout from '@/widgets/layout/PrivateLayout.vue'
import AppCard from '@/shared/ui/AppCard.vue'
import AppButton from '@/shared/ui/AppButton.vue'
import AppField from '@/shared/ui/AppField.vue'
import AppInput from '@/shared/ui/AppInput.vue'
import AppTextarea from '@/shared/ui/AppTextarea.vue'
import AppSectionTitle from '@/shared/ui/AppSectionTitle.vue'
import AppLoadingState from '@/shared/ui/AppLoadingState.vue'
import AppErrorState from '@/shared/ui/AppErrorState.vue'
import ProfileAvatar from '@/shared/ui/ProfileAvatar.vue'
import StudentProfileView from '@/features/student-profile/StudentProfileView.vue'

const { t } = useI18n()
const toastStore = useToastStore()
const { handleError } = useErrorHandler()

const mode = ref<'view' | 'edit'>('view')
const avatarMessage = ref('')
const successMessage = ref('')
const saveError = ref('')

const loading = ref(false)
const saving = ref(false)
const avatarUploading = ref(false)
const avatarDeleting = ref(false)

const pageError = ref('')
const avatarError = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  avatarKey: '',
  avatarUrl: '',
  bio: '',
  timezone: '',
  phone: '',
  city: '',
  instagramUrl: '',
  telegramUsername: '',
  publicEmail: '',
})

const fieldErrors = reactive({
  firstName: '',
  lastName: '',
})

const fullName = computed(() => {
  const full = `${form.firstName} ${form.lastName}`.trim()
  return full || t('studentProfile.notFilled')
})

const validate = () => {
  fieldErrors.firstName = ''
  fieldErrors.lastName = ''
  let isValid = true

  if (!form.firstName.trim()) {
    fieldErrors.firstName = t('studentProfile.firstNameRequired')
    isValid = false
  }

  if (!form.lastName.trim()) {
    fieldErrors.lastName = t('studentProfile.lastNameRequired')
    isValid = false
  }

  return isValid
}

const loadProfile = async () => {
  loading.value = true
  pageError.value = ''

  try {
    const { data } = await http.get('/api/student/profile')
    Object.assign(form, data)
  } catch (error) {
    console.error(error)
    pageError.value = t('studentProfile.pageLoadError')
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  if (!validate()) {
    toastStore.error(t('studentProfile.validationError'))
    return
  }

  saving.value = true
  saveError.value = ''
  successMessage.value = ''

  try {
    await http.put('/api/student/profile', form)
    successMessage.value = t('studentProfile.saveSuccess')
    toastStore.success(t('studentProfile.saveSuccess'))
    mode.value = 'view'
  } catch (error) {
    console.error(error)
    saveError.value = handleError(error, t('studentProfile.saveError'))
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  mode.value = 'view'
  loadProfile()
}

const handleAvatarUpload = async (event: Event) => {
  avatarError.value = ''
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  avatarUploading.value = true

  try {
    const { data } = await http.post('/api/student/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    form.avatarKey = data.avatarKey
    form.avatarUrl = data.avatarUrl
    toastStore.success(t('studentProfile.avatarUploaded'))
  } catch (error: any) {
    console.error(error)
    avatarError.value = handleError(error, t('studentProfile.avatarUploadError'))
  } finally {
    avatarUploading.value = false
    input.value = ''
  }
}

const confirmAvatarDelete = async () => {
  if (!window.confirm(t('studentProfile.confirmDeleteAvatar'))) return
  await handleAvatarDelete()
}

const handleAvatarDelete = async () => {
  avatarDeleting.value = true

  try {
    await http.delete('/api/student/profile/avatar')
    form.avatarKey = ''
    form.avatarUrl = ''
    toastStore.success(t('studentProfile.avatarDeleted'))
  } catch (error: any) {
    console.error(error)
    avatarError.value = handleError(error, t('studentProfile.avatarDeleteError'))
  } finally {
    avatarDeleting.value = false
  }
}

onMounted(loadProfile)
</script>
