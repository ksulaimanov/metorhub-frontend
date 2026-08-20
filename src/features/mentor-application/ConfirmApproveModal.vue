<template>
  <AppModal
    :model-value="modelValue"
    :title="t('admin.applications.confirmApproveTitle')"
    :description="t('admin.applications.confirmApproveDescription', { name: applicantName })"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #icon>
      <CheckCircle class="h-7 w-7 text-success" />
    </template>

    <template #actions>
      <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
        <AppButton
          variant="ghost"
          :disabled="loading"
          @click="emit('update:modelValue', false)"
        >
          {{ t('common.cancel') }}
        </AppButton>
        <AppButton
          variant="primary"
          :loading="loading"
          @click="emit('confirm')"
        >
          {{ t('admin.applications.confirmApproveButton') }}
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { CheckCircle } from 'lucide-vue-next'
import AppModal from '@/shared/ui/AppModal.vue'
import AppButton from '@/shared/ui/AppButton.vue'

const { t } = useI18n()

defineProps<{
  modelValue: boolean
  applicantName: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()
</script>

