<template>
  <AppModal
    :model-value="modelValue"
    :title="t('admin.applications.confirmRejectTitle')"
    :description="t('admin.applications.confirmRejectDescription', { name: applicantName })"
    @update:model-value="onClose"
  >
    <template #icon>
      <XCircle class="h-7 w-7 text-red-600" />
    </template>

    <template #default>
      <div class="space-y-2">
        <label class="block text-sm font-medium text-white">
          {{ t('admin.applications.rejectReasonLabel') }}
        </label>
        <AppTextarea
          v-model="reason"
          :placeholder="t('admin.applications.rejectReasonPlaceholder')"
          rows="3"
        />
        <p v-if="validationError" class="text-sm text-red-600">
          {{ validationError }}
        </p>
      </div>
    </template>

    <template #actions>
      <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
        <AppButton
          variant="ghost"
          :disabled="loading"
          @click="onClose(false)"
        >
          {{ t('common.cancel') }}
        </AppButton>
        <AppButton
          variant="danger"
          :loading="loading"
          @click="handleConfirm"
        >
          {{ t('admin.applications.confirmRejectButton') }}
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { XCircle } from 'lucide-vue-next'
import AppModal from '../../shared/ui/AppModal.vue'
import AppButton from '../../shared/ui/AppButton.vue'
import AppTextarea from '../../shared/ui/AppTextarea.vue'

const { t } = useI18n()

const props = defineProps<{
  modelValue: boolean
  applicantName: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', reason: string): void
}>()

const reason = ref('')
const validationError = ref('')

function handleConfirm() {
  validationError.value = ''
  if (!reason.value.trim()) {
    validationError.value = t('admin.applications.rejectReasonRequired')
    return
  }
  emit('confirm', reason.value.trim())
}

function onClose(value: boolean) {
  emit('update:modelValue', value)
}

// Reset state when modal closes
watch(() => props.modelValue, (open) => {
  if (!open) {
    reason.value = ''
    validationError.value = ''
  }
})
</script>

