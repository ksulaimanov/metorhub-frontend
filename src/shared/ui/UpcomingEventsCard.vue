<template>
  <AppCard>
    <!-- Header -->
    <div class="flex items-center justify-between gap-3 mb-6">
      <div>
        <h2 class="text-xl font-semibold text-text-primary">{{ title }}</h2>
        <p class="mt-1 text-sm text-text-secondary">{{ subtitle }}</p>
      </div>
      <div v-if="!loading && events.length > 0" class="text-sm font-semibold text-text-muted">
        {{ events.length }} {{ t('common.ofMax') }} 5
      </div>
    </div>

    <!-- Loading State -->
    <AppEventSkeleton v-if="loading" :count="3" />

    <!-- Error State -->
    <div
        v-else-if="error"
        class="rounded-2xl border border-danger-border bg-danger-soft p-4 text-center"
    >
      <p class="text-sm font-medium text-danger">{{ error }}</p>
      <button
          class="mt-3 text-sm font-semibold text-danger underline hover:text-danger"
          @click="$emit('retry')"
      >
        {{ t('common.retry') }}
      </button>
    </div>

    <!-- Empty State -->
    <div
        v-else-if="events.length === 0"
        class="rounded-2xl border border-dashed border-border-brand p-6 text-center"
    >
      <p class="text-sm font-medium text-text-secondary">{{ emptyMessage }}</p>
    </div>

    <!-- Events List -->
    <div v-else class="space-y-3">
      <div
          v-for="(event) in events"
          :key="event.id"
          class="rounded-2xl border border-border-brand p-4 transition hover:border-brand/30 hover:bg-brand-soft/20"
      >
        <!-- Event Header -->
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="min-w-0 flex-1">
            <h3 class="truncate text-sm font-semibold text-text-primary">
              {{ event.title }}
            </h3>
            <p class="mt-1 truncate text-xs text-text-muted">
              {{ event.studentName || event.mentorName }}
            </p>
          </div>
          <AppBadge :variant="statusVariant(event.status)" class="shrink-0">
            {{ t(`common.bookingStatus.${event.status}`, event.status) }}
          </AppBadge>
        </div>

        <!-- Event Details Grid -->
        <div class="space-y-2 text-xs text-text-secondary">
          <!-- Date/Time -->
          <div class="flex items-center gap-2">
            <span class="font-medium text-text-primary">🕒</span>
            <span>{{ formatDateTime(event.startAt, event.timezone) }}</span>
          </div>

          <!-- Format -->
          <div class="flex items-center gap-2">
            <span class="font-medium text-text-primary">📍</span>
            <span>{{ t(`common.lessonFormat.${event.lessonFormat}`, event.lessonFormat) }}</span>
          </div>

          <!-- Capacity (for mentors) -->
          <div v-if="event.capacity" class="flex items-center gap-2">
            <span class="font-medium text-text-primary">👥</span>
            <span>
              {{ event.bookedCount }}/{{ event.capacity }} ({{ t('common.free') }}: {{ event.availableSeats }})
            </span>
          </div>
        </div>

        <!-- Action Button -->
        <button
            v-if="actionButtonVisible"
            class="mt-3 w-full rounded-lg bg-brand-soft/50 px-3 py-2 text-xs font-semibold text-brand transition hover:bg-brand-soft active:bg-brand-soft/80"
            @click="$emit('event-click', event)"
        >
          {{ actionButtonLabel }}
        </button>
      </div>

      <!-- View All Button -->
      <button
          v-if="events.length > 0 && showViewAll"
          class="w-full rounded-lg border border-border-brand px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-brand-soft/30 active:bg-brand-soft/50"
          @click="$emit('view-all')"
      >
        {{ t('common.viewAllEvents') }}
      </button>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { UpcomingEvent } from '@/shared/types/dashboard'
import AppCard from '@/shared/ui/AppCard.vue'
import AppBadge from '@/shared/ui/AppBadge.vue'
import AppEventSkeleton from '@/shared/ui/AppEventSkeleton.vue'
import { formatSlotTime } from '@/shared/lib/dateFormatter'

const { t, locale } = useI18n()

interface Props {
  title: string
  subtitle: string
  events: UpcomingEvent[]
  loading?: boolean
  error?: string
  emptyMessage?: string
  actionButtonLabel?: string
  actionButtonVisible?: boolean
  showViewAll?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
  error: '',
  emptyMessage: '',
  actionButtonLabel: '',
  actionButtonVisible: true,
  showViewAll: true,
})

defineEmits<{
  retry: []
  'event-click': [event: UpcomingEvent]
  'view-all': []
}>()

const statusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
  const map: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    COMPLETED: 'info',
    CANCELLED: 'danger',
  }
  return map[status] || 'default'
}

const formatDateTime = (value: string, timezone?: string) => {
  if (timezone) {
    return formatSlotTime(value, timezone)
  }

  const date = new Date(value)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()

  const isTomorrow =
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()

  const dateLoc = locale.value === 'ky' ? 'ky-KG' : 'ru-RU'

  let dateStr = ''
  if (isToday) {
    dateStr = t('common.today')
  } else if (isTomorrow) {
    dateStr = t('common.tomorrow')
  } else {
    dateStr = date.toLocaleDateString(dateLoc, {
      month: 'short',
      day: 'numeric',
    })
  }

  const timeStr = date.toLocaleTimeString(dateLoc, {
    hour: '2-digit',
    minute: '2-digit',
  })

  return `${dateStr}, ${timeStr}`
}
</script>

