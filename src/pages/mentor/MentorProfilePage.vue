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
      >
        <template #actions>
          <AppButton variant="secondary" size="sm" @click="loadProfile">{{ t('common.retry') }}</AppButton>
        </template>
      </AppErrorState>

      <template v-else>
        <!-- VIEW MODE (default) -->
        <MentorProfileView
            v-if="mode === 'view'"
            :profile="form"
            @edit="mode = 'edit'"
        />

        <!-- EDIT MODE -->
        <template v-else>
          <!-- Profile header with avatar upload -->
          <MentorProfileHeader
              :first-name="form.firstName"
              :last-name="form.lastName"
              :avatar-url="form.avatarUrl"
              :headline="form.headline"
              :verified="form.verified"
              :instagram-url="form.instagramUrl"
              :telegram-username="form.telegramUsername"
              :public-email="form.publicEmail"
          >
            <template #actions>
              <MentorAvatarUpload
                  :has-avatar="!!form.avatarUrl"
                  @uploaded="onAvatarUploaded"
                  @deleted="onAvatarDeleted"
              />
            </template>
          </MentorProfileHeader>

          <!-- Edit form -->
          <MentorProfileEditForm
              :form="form"
              :saving="saving"
              :success-message="successMessage"
              :error-message="saveError"
              :show-validation="showValidation"
              :field-errors="fieldErrors"
              @save="saveProfile"
              @cancel="handleCancel"
          />
        </template>
      </template>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { http } from '@/shared/api/http'
import { useToastStore } from '@/shared/lib/getApiErrorMessage'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { useFormErrors } from '@/shared/composables/useFormErrors'
import PrivateLayout from '@/widgets/layout/PrivateLayout.vue'
import AppSectionTitle from '@/shared/ui/AppSectionTitle.vue'
import AppButton from '@/shared/ui/AppButton.vue'
import AppLoadingState from '@/shared/ui/AppLoadingState.vue'
import AppErrorState from '@/shared/ui/AppErrorState.vue'
import MentorProfileView from '@/features/mentor-profile/MentorProfileView.vue'
import MentorProfileHeader from '@/features/mentor-profile/MentorProfileHeader.vue'
import MentorAvatarUpload from '@/features/mentor-profile-edit/MentorAvatarUpload.vue'
import MentorProfileEditForm from '@/features/mentor-profile-edit/MentorProfileEditForm.vue'

const { t } = useI18n()
const toastStore = useToastStore()
const { handleError } = useErrorHandler()
const { fieldErrors, handleApiError, clearErrors } = useFormErrors()

const mode = ref<'view' | 'edit'>('view')
const loading = ref(false)
const saving = ref(false)
const pageError = ref('')
const saveError = ref('')
const successMessage = ref('')
const showValidation = ref(false)

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
  instagramUrl: '',
  telegramUsername: '',
  publicEmail: '',
})

const loadProfile = async () => {
  loading.value = true
  pageError.value = ''
  try {
    const { data } = await http.get('/api/mentor/profile')
    Object.assign(form, data)
  } catch (e) {
    pageError.value = handleError(e as unknown, t('mentorProfile.pageLoadError'), { toast: false })
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  showValidation.value = true
  clearErrors()

  if (!form.firstName || !form.lastName) return
  if (!form.lessonFormatOnline && !form.lessonFormatOffline && !form.lessonFormatHybrid) {
    toastStore.error(t('mentorProfile.formatError'))
    return
  }

  saving.value = true
  saveError.value = ''
  successMessage.value = ''

  try {
    await http.put('/api/mentor/profile', form)
    successMessage.value = t('mentorProfile.saveSuccess')
    toastStore.success(t('mentorProfile.saveSuccessToast'))
    showValidation.value = false
    mode.value = 'view'
  } catch (e: unknown) {
    if (handleApiError(e)) {
      saveError.value = t('mentorProfile.saveError')
      return
    }
    saveError.value = handleError(e, t('mentorProfile.saveError'), { toast: false })
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  mode.value = 'view'
  loadProfile()
}

const onAvatarUploaded = (payload: { avatarKey: string; avatarUrl: string }) => {
  form.avatarKey = payload.avatarKey
  form.avatarUrl = payload.avatarUrl
}

const onAvatarDeleted = () => {
  form.avatarKey = ''
  form.avatarUrl = ''
}

onMounted(loadProfile)
</script>
