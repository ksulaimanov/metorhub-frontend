<template>
  <AppCard>
    <!-- Header -->
    <div class="flex items-center justify-between gap-3 mb-6">
      <div>
        <h2 class="text-xl font-semibold text-slate-900">{{ title }}</h2>
        <p class="mt-1 text-sm text-slate-600">{{ subtitle }}</p>
      </div>
      <div v-if="!loading && events.length > 0" class="text-sm font-semibold text-slate-500">
        {{ events.length }} {{ t('common.ofMax') }} 5
      </div>
    </div>

    <!-- Loading State -->
    <AppEventSkeleton v-if="loading" :count="3" />

    <!-- Error State -->
    <div
        v-else-if="error"
        class="rounded-2xl border border-red-200 bg-red-50 p-4 text-center"
    >
      <p class="text-sm font-medium text-red-700">{{ error }}</p>
      <button
          class="mt-3 text-sm font-semibold text-red-600 underline hover:text-red-700"
          @click="$emit('retry')"
      >
        {{ t('common.retry') }}
      </button>
    </div>

    <!-- Empty State -->
    <div
        v-else-if="events.length === 0"
        class="rounded-2xl border border-dashed border-slate-300 p-6 text-center"
    >
      <p class="text-sm font-medium text-slate-600">{{ emptyMessage }}</p>
    </div>

    <!-- Events List -->
    <div v-else class="space-y-3">
      <div
          v-for="(event) in events"
          :key="event.id"
          class="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
      >
        <!-- Event Header -->
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="min-w-0 flex-1">
            <h3 class="truncate text-sm font-semibold text-slate-900">
              {{ event.title }}
            </h3>
            <p class="mt-1 truncate text-xs text-slate-500">
              {{ event.studentName || event.mentorName }}
            </p>
          </div>
          <AppBadge :variant="statusVariant(event.status)" class="shrink-0">
            {{ t(`common.bookingStatus.${event.status}`, event.status) }}
          </AppBadge>
        </div>

        <!-- Event Details Grid -->
        <div class="space-y-2 text-xs text-slate-600">
          <!-- Date/Time -->
          <div class="flex items-center gap-2">
            <span class="font-medium text-slate-700">🕒</span>
            <span>{{ formatDateTime(event.startAt) }}</span>
          </div>

          <!-- Format -->
          <div class="flex items-center gap-2">
            <span class="font-medium text-slate-700">📍</span>
            <span>{{ t(`common.lessonFormat.${event.lessonFormat}`, event.lessonFormat) }}</span>
          </div>

          <!-- Capacity (for mentors) -->
          <div v-if="event.capacity" class="flex items-center gap-2">
            <span class="font-medium text-slate-700">👥</span>
            <span>
              {{ event.bookedCount }}/{{ event.capacity }} ({{ t('common.free') }}: {{ event.availableSeats }})
            </span>
          </div>
        </div>

        <!-- Action Button -->
        <button
            v-if="actionButtonVisible"
            class="mt-3 w-full rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 active:bg-slate-300"
            @click="$emit('event-click', event)"
        >
          {{ actionButtonLabel }}
        </button>
      </div>

      <!-- View All Button -->
      <button
          v-if="events.length > 0 && showViewAll"
          class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
          @click="$emit('view-all')"
      >
        {{ t('common.viewAllEvents') }}
      </button>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { UpcomingEvent } from '../../shared/types/dashboard'
import AppCard from './AppCard.vue'
import AppBadge from './AppBadge.vue'
import AppEventSkeleton from './AppEventSkeleton.vue'

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
  const map: Record<string, any> = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    COMPLETED: 'info',
    CANCELLED: 'danger',
  }
  return map[status] || 'default'
}

const formatDateTime = (value: string) => {
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

