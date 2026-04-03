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
  active: boolean
  bookedCount: number
  capacity: number
}>()

const variant = computed<'success' | 'warning' | 'danger' | 'default'>(() => {
  if (!props.active) return 'default'
  if (props.bookedCount >= props.capacity) return 'danger'
  if (props.bookedCount > 0) return 'warning'
  return 'success'
})

const label = computed(() => {
  if (!props.active) return t('availability.inactive')
  if (props.bookedCount >= props.capacity) return t('availability.full')
  const free = props.capacity - props.bookedCount
  return t('availability.seatsLeft', { count: free })
})
</script>

