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
      />

      <template v-else>
        <AppCard>
          <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div class="flex items-center gap-4">
              <div class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-2xl font-bold text-slate-600">
                <img v-if="form.avatarUrl" :src="form.avatarUrl" :alt="t('studentProfile.avatarAlt')" class="h-full w-full object-cover" />
                <span v-else>{{ avatarInitials }}</span>
              </div>

              <div>
                <h2 class="text-xl font-semibold text-slate-900">{{ fullName }}</h2>
                <p class="mt-1 text-sm text-slate-600">{{ t('studentProfile.avatarHint') }}</p>
              </div>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row">
              <label class="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                <input type="file" class="hidden" accept="image/png,image/jpeg,image/webp" :disabled="avatarUploading" @change="handleAvatarUpload" />
                {{ avatarUploading ? t('studentProfile.uploadingPhoto') : t('studentProfile.uploadPhoto') }}
              </label>

              <button
                  v-if="form.avatarUrl"
                  type="button"
                  class="inline-flex items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="avatarDeleting"
                  @click="confirmAvatarDelete"
              >
                {{ avatarDeleting ? t('studentProfile.deletingPhoto') : t('studentProfile.deletePhoto') }}
              </button>
            </div>
          </div>

          <p v-if="avatarMessage" class="mt-4 text-sm font-medium text-emerald-600">{{ avatarMessage }}</p>
          <p v-if="avatarError" class="mt-4 text-sm font-medium text-red-600">{{ avatarError }}</p>
        </AppCard>

        <div class="grid gap-4 md:grid-cols-3">
          <AppCard>
            <p class="text-sm text-slate-500">{{ t('studentProfile.statName') }}</p>
            <p class="mt-2 text-lg font-semibold text-slate-900">{{ fullName }}</p>
          </AppCard>

          <AppCard>
            <p class="text-sm text-slate-500">{{ t('studentProfile.statCity') }}</p>
            <p class="mt-2 text-lg font-semibold text-slate-900">{{ form.city || t('studentProfile.notSpecified') }}</p>
          </AppCard>

          <AppCard>
            <p class="text-sm text-slate-500">{{ t('studentProfile.statTimezone') }}</p>
            <p class="mt-2 text-lg font-semibold text-slate-900">{{ form.timezone || t('studentProfile.notSpecified') }}</p>
          </AppCard>
        </div>

        <form class="space-y-6" @submit.prevent="saveProfile">
          <AppCard>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-semibold text-slate-900">{{ t('studentProfile.sectionMain') }}</h2>
                <p class="mt-1 text-sm text-slate-600">{{ t('studentProfile.sectionMainHint') }}</p>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('studentProfile.firstName') }}</label>
                  <input v-model.trim="form.firstName" class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" :placeholder="t('studentProfile.firstNamePlaceholder')" />
                  <p v-if="fieldErrors.firstName" class="mt-2 text-sm text-red-600">{{ fieldErrors.firstName }}</p>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('studentProfile.lastName') }}</label>
                  <input v-model.trim="form.lastName" class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" :placeholder="t('studentProfile.lastNamePlaceholder')" />
                  <p v-if="fieldErrors.lastName" class="mt-2 text-sm text-red-600">{{ fieldErrors.lastName }}</p>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('studentProfile.city') }}</label>
                  <input v-model.trim="form.city" class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" :placeholder="t('studentProfile.cityPlaceholder')" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('studentProfile.phone') }}</label>
                  <input v-model.trim="form.phone" class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" :placeholder="t('studentProfile.phonePlaceholder')" />
                  <p class="mt-2 text-xs text-slate-500">{{ t('studentProfile.phoneHint') }}</p>
                </div>

                <div class="md:col-span-2">
                  <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('studentProfile.timezone') }}</label>
                  <input v-model.trim="form.timezone" class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" :placeholder="t('studentProfile.timezonePlaceholder')" />
                  <p class="mt-2 text-xs text-slate-500">{{ t('studentProfile.timezoneHint') }}</p>
                </div>
              </div>
            </div>
          </AppCard>

          <AppCard>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-semibold text-slate-900">{{ t('studentProfile.sectionBio') }}</h2>
                <p class="mt-1 text-sm text-slate-600">{{ t('studentProfile.sectionBioHint') }}</p>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('studentProfile.bioLabel') }}</label>
                <textarea v-model.trim="form.bio" class="min-h-40 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" :placeholder="t('studentProfile.bioPlaceholder')" />
                <p class="mt-2 text-xs text-slate-500">{{ t('studentProfile.bioHint') }}</p>
              </div>
            </div>
          </AppCard>

          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="min-h-[24px]">
              <p v-if="successMessage" class="text-sm font-medium text-emerald-600">{{ successMessage }}</p>
              <p v-else-if="saveError" class="text-sm font-medium text-red-600">{{ saveError }}</p>
            </div>

            <button
                type="submit"
                class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="saving"
            >
              {{ saving ? t('studentProfile.saving') : t('studentProfile.saveChanges') }}
            </button>
          </div>
        </form>
      </template>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { http } from '../../shared/api/http'
import { useToastStore } from '../../shared/lib/getApiErrorMessage'
import { useErrorHandler } from '../../shared/composables/useErrorHandler'
import PrivateLayout from '../../widgets/layout/PrivateLayout.vue'
import AppCard from '../../shared/ui/AppCard.vue'
import AppSectionTitle from '../../shared/ui/AppSectionTitle.vue'
import AppLoadingState from '../../shared/ui/AppLoadingState.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'

const { t } = useI18n()
const toastStore = useToastStore()
const { handleError } = useErrorHandler()
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
})

const fieldErrors = reactive({
  firstName: '',
  lastName: '',
})

const fullName = computed(() => {
  const full = `${form.firstName} ${form.lastName}`.trim()
  return full || t('studentProfile.notFilled')
})

const avatarInitials = computed(() => {
  const first = form.firstName?.trim()?.[0] || ''
  const last = form.lastName?.trim()?.[0] || ''
  return (first + last).toUpperCase() || 'U'
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
  } catch (error) {
    console.error(error)
    saveError.value = handleError(error, t('studentProfile.saveError'))
  } finally {
    saving.value = false
  }
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