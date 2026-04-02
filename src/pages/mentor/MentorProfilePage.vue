<template>
  <PrivateLayout>
    <div class="space-y-8">
      <AppSectionTitle
          :title="t('mentorProfile.title')"
          :description="t('mentorProfile.description')"
      />

      <AppLoadingState v-if="loading" :text="t('mentorProfile.loadingProfile')" />

      <AppErrorState
          v-else-if="pageError"
          :title="t('mentorProfile.loadError')"
          :description="pageError"
      />

      <template v-else>
        <AppCard>
          <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div class="flex items-center gap-4">
              <div class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-2xl font-bold text-slate-600">
                <img
                    v-if="form.avatarUrl"
                    :src="form.avatarUrl"
                    :alt="t('mentorProfile.avatarAlt')"
                    class="h-full w-full object-cover"
                />
                <span v-else>{{ avatarInitials }}</span>
              </div>

              <div>
                <h2 class="text-xl font-semibold text-slate-900">{{ mentorName }}</h2>
                <p class="mt-1 text-sm text-slate-600">{{ t('mentorProfile.avatarHint') }}</p>
              </div>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row">
              <label class="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                <input type="file" class="hidden" accept="image/png,image/jpeg,image/webp" :disabled="avatarUploading" @change="handleAvatarUpload" />
                {{ avatarUploading ? t('mentorProfile.uploadingPhoto') : t('mentorProfile.uploadPhoto') }}
              </label>

              <button
                  v-if="form.avatarUrl"
                  type="button"
                  class="inline-flex items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="avatarDeleting"
                  @click="confirmAvatarDelete"
              >
                {{ avatarDeleting ? t('mentorProfile.deletingPhoto') : t('mentorProfile.deletePhoto') }}
              </button>
            </div>
          </div>

          <p v-if="avatarMessage" class="mt-4 text-sm font-medium text-emerald-600">{{ avatarMessage }}</p>
          <p v-if="avatarError" class="mt-4 text-sm font-medium text-red-600">{{ avatarError }}</p>
        </AppCard>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AppCard>
            <p class="text-sm text-slate-500">{{ t('mentorProfile.statRating') }}</p>
            <p class="mt-2 text-2xl font-bold text-slate-900">{{ form.averageRating || 0 }}</p>
          </AppCard>

          <AppCard>
            <p class="text-sm text-slate-500">{{ t('mentorProfile.statLessons') }}</p>
            <p class="mt-2 text-2xl font-bold text-slate-900">{{ form.lessonsCompleted || 0 }}</p>
          </AppCard>

          <AppCard>
            <p class="text-sm text-slate-500">{{ t('mentorProfile.statVisibility') }}</p>
            <div class="mt-3">
              <AppBadge :variant="form.public ? 'success' : 'default'">
                {{ form.public ? t('mentorProfile.publicProfile') : t('mentorProfile.hiddenProfile') }}
              </AppBadge>
            </div>
          </AppCard>

          <AppCard>
            <p class="text-sm text-slate-500">{{ t('mentorProfile.statStatus') }}</p>
            <div class="mt-3">
              <AppBadge :variant="form.verified ? 'success' : 'info'">
                {{ form.verified ? t('mentorProfile.verified') : t('mentorProfile.regular') }}
              </AppBadge>
            </div>
          </AppCard>
        </div>

        <form class="space-y-6" @submit.prevent="saveProfile">
          <AppCard>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-semibold text-slate-900">{{ t('mentorProfile.sectionMain') }}</h2>
                <p class="mt-1 text-sm text-slate-600">{{ t('mentorProfile.sectionMainHint') }}</p>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('mentorProfile.firstName') }}</label>
                  <input v-model="form.firstName" type="text" class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" :placeholder="t('mentorProfile.firstNamePlaceholder')" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('mentorProfile.lastName') }}</label>
                  <input v-model="form.lastName" type="text" class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" :placeholder="t('mentorProfile.lastNamePlaceholder')" />
                </div>

                <div class="md:col-span-2">
                  <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('mentorProfile.headline') }}</label>
                  <input v-model="form.headline" type="text" class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" :placeholder="t('mentorProfile.headlinePlaceholder')" />
                  <p class="mt-2 text-xs text-slate-500">{{ t('mentorProfile.headlineHint') }}</p>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('mentorProfile.specialization') }}</label>
                  <input v-model="form.specialization" type="text" class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" :placeholder="t('mentorProfile.specializationPlaceholder')" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('mentorProfile.city') }}</label>
                  <input v-model="form.city" type="text" class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" :placeholder="t('mentorProfile.cityPlaceholder')" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('mentorProfile.yearsExperience') }}</label>
                  <input v-model.number="form.yearsExperience" type="number" min="0" class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" :placeholder="t('mentorProfile.yearsExperiencePlaceholder')" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('mentorProfile.pricePerHour') }}</label>
                  <input v-model.number="form.pricePerHour" type="number" min="0" class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" :placeholder="t('mentorProfile.pricePerHourPlaceholder')" />
                </div>
              </div>
            </div>
          </AppCard>

          <AppCard>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-semibold text-slate-900">{{ t('mentorProfile.sectionFormat') }}</h2>
                <p class="mt-1 text-sm text-slate-600">{{ t('mentorProfile.sectionFormatHint') }}</p>
              </div>

              <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300">
                  <input v-model="form.lessonFormatOnline" type="checkbox" class="mt-1 h-4 w-4" />
                  <div>
                    <p class="font-medium text-slate-900">{{ t('mentorProfile.formatOnline') }}</p>
                    <p class="text-sm text-slate-600">{{ t('mentorProfile.formatOnlineDesc') }}</p>
                  </div>
                </label>

                <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300">
                  <input v-model="form.lessonFormatOffline" type="checkbox" class="mt-1 h-4 w-4" />
                  <div>
                    <p class="font-medium text-slate-900">{{ t('mentorProfile.formatOffline') }}</p>
                    <p class="text-sm text-slate-600">{{ t('mentorProfile.formatOfflineDesc') }}</p>
                  </div>
                </label>

                <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300">
                  <input v-model="form.lessonFormatHybrid" type="checkbox" class="mt-1 h-4 w-4" />
                  <div>
                    <p class="font-medium text-slate-900">{{ t('mentorProfile.formatHybrid') }}</p>
                    <p class="text-sm text-slate-600">{{ t('mentorProfile.formatHybridDesc') }}</p>
                  </div>
                </label>

                <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300">
                  <input v-model="form.public" type="checkbox" class="mt-1 h-4 w-4" />
                  <div>
                    <p class="font-medium text-slate-900">{{ t('mentorProfile.publicProfileLabel') }}</p>
                    <p class="text-sm text-slate-600">{{ t('mentorProfile.publicProfileDesc') }}</p>
                  </div>
                </label>
              </div>

              <p v-if="formatError" class="text-sm font-medium text-red-600">{{ formatError }}</p>
            </div>
          </AppCard>

          <AppCard>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-semibold text-slate-900">{{ t('mentorProfile.sectionContacts') }}</h2>
                <p class="mt-1 text-sm text-slate-600">{{ t('mentorProfile.sectionContactsHint') }}</p>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div class="md:col-span-2">
                  <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('mentorProfile.address') }}</label>
                  <input v-model="form.addressText" type="text" class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" :placeholder="t('mentorProfile.addressPlaceholder')" />
                </div>

                <div class="md:col-span-2">
                  <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('mentorProfile.meetingLink') }}</label>
                  <input v-model="form.meetingLink" type="text" class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" :placeholder="t('mentorProfile.meetingLinkPlaceholder')" />
                </div>
              </div>
            </div>
          </AppCard>

          <AppCard>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-semibold text-slate-900">{{ t('mentorProfile.sectionBio') }}</h2>
                <p class="mt-1 text-sm text-slate-600">{{ t('mentorProfile.sectionBioHint') }}</p>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('mentorProfile.bioLabel') }}</label>
                <textarea v-model="form.bio" class="min-h-40 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" :placeholder="t('mentorProfile.bioPlaceholder')" />
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
              {{ saving ? t('mentorProfile.saving') : t('mentorProfile.saveChanges') }}
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
import AppBadge from '../../shared/ui/AppBadge.vue'

const { t } = useI18n()
const toastStore = useToastStore()
const { handleError } = useErrorHandler()
const saveError = ref('')
const loading = ref(false)
const saving = ref(false)
const avatarUploading = ref(false)
const avatarDeleting = ref(false)

const pageError = ref('')
const avatarError = ref('')
const successMessage = ref('')
const avatarMessage = ref('')
const form = reactive({
  firstName: '',
  lastName: '',
  avatarKey: '',
  avatarUrl: '',
  headline: '',
  bio: '',
  specialization: '',
  yearsExperience: 0,
  lessonFormatOnline: false,
  lessonFormatOffline: false,
  lessonFormatHybrid: false,
  city: '',
  addressText: '',
  meetingLink: '',
  pricePerHour: 0,
  public: true,
  averageRating: 0,
  lessonsCompleted: 0,
  verified: false,
})

const mentorName = computed(() => {
  const full = `${form.firstName || ''} ${form.lastName || ''}`.trim()
  return full || t('mentorProfile.newMentor')
})

const avatarInitials = computed(() => {
  const first = form.firstName?.charAt(0) || ''
  const last = form.lastName?.charAt(0) || ''
  return (first + last).toUpperCase() || 'M'
})

const formatError = computed(() => {
  if (!form.lessonFormatOnline && !form.lessonFormatOffline && !form.lessonFormatHybrid) {
    return t('mentorProfile.formatError')
  }
  return ''
})

const loadProfile = async () => {
  loading.value = true
  pageError.value = ''

  try {
    const { data } = await http.get('/api/mentor/profile')
    Object.assign(form, data)
  } catch (error) {
    console.error(error)
    pageError.value = t('mentorProfile.pageLoadError')
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  if (formatError.value) {
    toastStore.error(formatError.value)
    return
  }

  saving.value = true
  saveError.value = ''
  successMessage.value = ''

  try {
    await http.put('/api/mentor/profile', form)
    successMessage.value = t('mentorProfile.saveSuccess')
    toastStore.success(t('mentorProfile.saveSuccessToast'))
  } catch (error) {
    saveError.value = handleError(error, t('mentorProfile.saveError'))
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
    const { data } = await http.post('/api/mentor/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    form.avatarKey = data.avatarKey
    form.avatarUrl = data.avatarUrl
    toastStore.success(t('mentorProfile.avatarUploaded'))
  } catch (error: any) {
    console.error(error)
    avatarError.value = handleError(error, t('mentorProfile.avatarUploadError'))
  } finally {
    avatarUploading.value = false
    input.value = ''
  }
}

const confirmAvatarDelete = async () => {
  if (!window.confirm(t('mentorProfile.confirmDeleteAvatar'))) return
  await handleAvatarDelete()
}

const handleAvatarDelete = async () => {
  avatarError.value = ''
  avatarDeleting.value = true

  try {
    await http.delete('/api/mentor/profile/avatar')
    form.avatarKey = ''
    form.avatarUrl = ''
    toastStore.success(t('mentorProfile.avatarDeleted'))
  } catch (error: any) {
    console.error(error)
    avatarError.value = handleError(error, t('mentorProfile.avatarDeleteError'))
  } finally {
    avatarDeleting.value = false
  }
}

onMounted(loadProfile)
</script>