<template>
  <AppBadge :variant="variant">
    {{ label }}
  </AppBadge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppBadge from '../../shared/ui/AppBadge.vue'

const { t } = useI18n()

const props = defineProps<{
  status: string
}>()

const variant = computed<'success' | 'warning' | 'danger' | 'info' | 'default'>(() => {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    COMPLETED: 'info',
    CANCELLED_BY_STUDENT: 'danger',
    CANCELLED_BY_MENTOR: 'danger',
  }
  return map[props.status] || 'default'
})

const label = computed(() =>
    t(`common.bookingStatus.${props.status}`, props.status),
)
</script>

