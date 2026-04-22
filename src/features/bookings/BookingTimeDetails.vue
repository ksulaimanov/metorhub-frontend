<template>
  <div class="grid gap-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]-secondary p-3.5 text-sm sm:grid-cols-2">
    <div>
      <p class="text-xs text-slate-400">{{ t('bookings.startLabel') }}</p>
      <p class="mt-0.5 font-medium text-white">{{ formatDateTime(startAt, timezone) }}</p>
    </div>
    <div>
      <p class="text-xs text-slate-400">{{ t('bookings.endLabel') }}</p>
      <p class="mt-0.5 font-medium text-text-primary">{{ formatDateTime(endAt, timezone) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { formatDateTimeForDisplay, formatSlotTime } from '@/shared/lib/dateFormatter'

const { t } = useI18n()

const { startAt, endAt, timezone } = defineProps<{
  startAt: string
  endAt: string
  timezone: string
}>()

const formatDateTime = (value: string, tz?: string) => tz ? formatSlotTime(value, tz) : formatDateTimeForDisplay(value)
</script>
