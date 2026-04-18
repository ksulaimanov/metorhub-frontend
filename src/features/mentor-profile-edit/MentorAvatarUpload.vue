<template>
  <div class="flex flex-col gap-3 sm:flex-row">
    <label
        class="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-border-brand bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
    >
      <input
          type="file"
          class="hidden"
          accept="image/png,image/jpeg,image/webp"
          :disabled="uploading"
          @change="handleUpload"
      />
      {{ uploading ? t('mentorProfile.uploadingPhoto') : t('mentorProfile.uploadPhoto') }}
    </label>

    <AppButton
        v-if="hasAvatar"
        variant="danger"
        size="md"
        :loading="deleting"
        @click="confirmDelete"
    >
      {{ t('mentorProfile.deletePhoto') }}
    </AppButton>
  </div>

  <p v-if="message" class="mt-3 text-sm font-medium text-emerald-600">{{ message }}</p>
  <p v-if="error" class="mt-3 text-sm font-medium text-red-600">{{ error }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { http } from '@/shared/api/http'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { useToastStore } from '@/shared/lib/getApiErrorMessage'
import AppButton from '@/shared/ui/AppButton.vue'

const { t } = useI18n()
const { handleError } = useErrorHandler()
const toastStore = useToastStore()

defineProps<{
  hasAvatar: boolean
}>()

const emit = defineEmits<{
  (e: 'uploaded', payload: { avatarKey: string; avatarUrl: string }): void
  (e: 'deleted'): void
}>()

const uploading = ref(false)
const deleting = ref(false)
const message = ref('')
const error = ref('')

const handleUpload = async (event: Event) => {
  error.value = ''
  message.value = ''
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  uploading.value = true

  try {
    const { data } = await http.post('/api/mentor/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    emit('uploaded', { avatarKey: data.avatarKey, avatarUrl: data.avatarUrl })
    toastStore.success(t('mentorProfile.avatarUploaded'))
  } catch (e: any) {
    error.value = handleError(e, t('mentorProfile.avatarUploadError'), { toast: false })
  } finally {
    uploading.value = false
    input.value = ''
  }
}

const confirmDelete = async () => {
  if (!window.confirm(t('mentorProfile.confirmDeleteAvatar'))) return
  error.value = ''
  message.value = ''
  deleting.value = true

  try {
    await http.delete('/api/mentor/profile/avatar')
    emit('deleted')
    toastStore.success(t('mentorProfile.avatarDeleted'))
  } catch (e: any) {
    error.value = handleError(e, t('mentorProfile.avatarDeleteError'), { toast: false })
  } finally {
    deleting.value = false
  }
}
</script>

