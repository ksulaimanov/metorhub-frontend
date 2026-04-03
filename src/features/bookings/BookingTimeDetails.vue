<template>
  <div class="grid gap-2 rounded-xl bg-surface-secondary p-3.5 text-sm sm:grid-cols-2">
    <div>
      <p class="text-xs text-text-secondary">{{ t('bookings.startLabel') }}</p>
      <p class="mt-0.5 font-medium text-text-primary">{{ formatDateTime(startAt) }}</p>
    </div>
    <div>
      <p class="text-xs text-text-secondary">{{ t('bookings.endLabel') }}</p>
      <p class="mt-0.5 font-medium text-text-primary">{{ formatDateTime(endAt) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { formatDateTimeForDisplay } from '../../shared/lib/dateFormatter'

const { t } = useI18n()

defineProps<{
  startAt: string
  endAt: string
}>()

const formatDateTime = (v: string) => formatDateTimeForDisplay(v)
</script>

