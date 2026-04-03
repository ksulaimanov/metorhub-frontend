<template>
  <AppCard>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <p class="text-base font-semibold text-text-primary">
          {{ formatDateTime(slot.startAt) }} — {{ formatDateTime(slot.endAt) }}
        </p>
        <div class="mt-2 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
          <AppBadge>{{ t(`common.lessonFormat.${slot.lessonFormat}`, slot.lessonFormat) }}</AppBadge>
          <SlotStatusBadge :active="slot.active" :booked-count="slot.bookedCount" :capacity="slot.capacity" />
          <span v-if="slot.meetingLink" class="truncate">🔗 {{ t('availability.hasLink') }}</span>
          <span v-if="slot.addressText" class="truncate">📍 {{ slot.addressText }}</span>
        </div>
      </div>

      <div class="flex shrink-0 gap-2">
        <slot name="actions" />
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppCard from '../../shared/ui/AppCard.vue'
import AppBadge from '../../shared/ui/AppBadge.vue'
import SlotStatusBadge from './SlotStatusBadge.vue'
import { formatDateTimeForDisplay } from '../../shared/lib/dateFormatter'

const { t } = useI18n()

defineProps<{
  slot: {
    id: number
    startAt: string
    endAt: string
    lessonFormat: string
    meetingLink: string | null
    addressText: string | null
    capacity: number
    bookedCount: number
    active: boolean
  }
}>()

const formatDateTime = (value: string) => formatDateTimeForDisplay(value)
</script>


