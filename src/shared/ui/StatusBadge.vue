<template>
  <AppBadge :variant="badgeVariant">
    {{ label }}
  </AppBadge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppBadge from '@/shared/ui/AppBadge.vue'
import type { MentorApplicationStatus } from '@/shared/types/mentorApplication'

const props = defineProps<{
  status: MentorApplicationStatus
}>()

const { t } = useI18n()

const badgeVariant = computed(() => {
  const map: Record<MentorApplicationStatus, 'default' | 'success' | 'warning' | 'danger'> = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'danger',
  }
  return map[props.status] ?? 'default'
})

const label = computed(() => {
  const map: Record<MentorApplicationStatus, string> = {
    PENDING: t('admin.applications.statusPending'),
    APPROVED: t('admin.applications.statusApproved'),
    REJECTED: t('admin.applications.statusRejected'),
  }
  return map[props.status] ?? props.status
})
</script>

