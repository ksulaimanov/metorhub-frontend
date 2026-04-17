<template>
  <div class="grid gap-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]-secondary p-3.5 text-sm sm:grid-cols-2">
    <div>
      <p class="text-xs text-slate-400">{{ t('bookings.startLabel') }}</p>
      <p class="mt-0.5 font-medium text-white">{{ formatDateTime(startAt) }}</p>
    </div>
    <div>
      <p class="text-xs text-slate-400">{{ t('bookings.endLabel') }}</p>
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

