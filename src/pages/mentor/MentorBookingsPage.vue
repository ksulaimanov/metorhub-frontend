<template>
  <PrivateLayout>
    <div class="space-y-8">
      <AppSectionTitle
          :title="t('mentorBookings.title')"
          :description="t('mentorBookings.description')"
      />

      <!-- ─── Status filter tabs ─── -->
      <div class="flex flex-wrap gap-2">
        <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            class="rounded-full px-4 py-2 text-sm font-medium transition"
            :class="activeTab === tab.value
              ? 'bg-brand text-white'
              : 'bg-white/5 backdrop-blur-xl text-slate-400 ring-1 ring-border-brand hover:bg-brand-soft'"
            @click="activeTab = tab.value"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="ml-1.5 rounded-full bg-surface/20 px-1.5 text-xs">{{ tab.count }}</span>
        </button>
      </div>

      <!-- ─── Loading ─── -->
      <AppLoadingState v-if="loading" :text="t('mentorBookings.loadingBookings')" />

      <!-- ─── Error ─── -->
      <AppErrorState
          v-else-if="pageError"
          :title="t('mentorBookings.loadError')"
          :description="pageError"
      >
        <template #actions>
          <AppButton variant="secondary" size="sm" @click="loadBookings">{{ t('common.retry') }}</AppButton>
        </template>
      </AppErrorState>

      <!-- ─── Empty ─── -->
      <div v-else-if="filteredBookings.length === 0" class="rounded-3xl bg-surface p-10 text-center shadow-sm ring-1 ring-border-brand">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft">
          <CalendarX class="h-6 w-6 text-brand" />
        </div>
        <h3 class="mt-4 text-lg font-semibold text-white">
          {{ activeTab === 'all' ? t('mentorBookings.emptyTitle') : t('mentorBookings.emptyFilterTitle') }}
        </h3>
        <p class="mt-2 text-sm text-text-secondary">
          {{ activeTab === 'all' ? t('mentorBookings.emptyDesc') : t('mentorBookings.emptyFilterDesc') }}
        </p>
        <RouterLink
            v-if="activeTab === 'all'"
            to="/mentor/slots"
            class="mt-5 inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          {{ t('mentorBookings.manageSlots') }}
        </RouterLink>
      </div>

      <!-- ─── Booking cards ─── -->
      <div v-else class="grid gap-4">
        <AppCard v-for="booking in filteredBookings" :key="booking.id" radius="lg" padding="md" class="group transition-all hover:ring-brand/40">
          <div class="flex flex-col gap-5">
            <!-- Header row: student info + status -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <!-- Student info -->
              <div
                class="flex items-center gap-3.5 cursor-pointer rounded-xl p-1.5 -ml-1.5 transition-colors hover:bg-surface-secondary"
                @click="openStudentPreview(booking)"
                title="Click to view student details"
              >
                <div class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-soft text-sm font-bold text-brand">
                  <img
                      v-if="booking.studentAvatarUrl"
                      :src="booking.studentAvatarUrl"
                      :alt="studentName(booking)"
                      class="h-full w-full object-cover"
                  />
                  <span v-else>{{ studentInitials(booking) }}</span>
                </div>
                <div class="min-w-0">
                  <p class="truncate text-base font-semibold text-text-primary">{{ studentName(booking) }}</p>
                  <p class="text-sm text-text-secondary">{{ formatDateTime(booking.startAt, booking.timezone) }}</p>
                </div>
              </div>

              <!-- Status badge + booking ID -->
              <div class="flex flex-wrap items-center gap-2">
                <AppBadge>{{ t(`common.lessonFormat.${booking.lessonFormat}`, booking.lessonFormat) }}</AppBadge>
                <AppBadge :variant="statusVariant(booking.status)">{{ formatStatus(booking.status) }}</AppBadge>
                <span class="text-xs text-text-secondary">#{{ booking.id }}</span>
              </div>
            </div>

            <!-- Time details -->
            <div class="grid gap-2 rounded-xl bg-surface-secondary p-3.5 text-sm sm:grid-cols-2">
              <div>
                <p class="text-xs text-text-secondary">{{ t('mentorBookings.startLabel') }}</p>
                <p class="mt-0.5 font-medium text-text-primary">{{ formatDateTime(booking.startAt, booking.timezone) }}</p>
              </div>
              <div>
                <p class="text-xs text-text-secondary">{{ t('mentorBookings.endLabel') }}</p>
                <p class="mt-0.5 font-medium text-text-primary">{{ formatDateTime(booking.endAt, booking.timezone) }}</p>
              </div>
            </div>

            <!-- Student note -->
            <div
                v-if="booking.studentNote"
                class="rounded-xl bg-brand-soft/30 px-4 py-3 text-sm text-text-primary ring-1 ring-border-brand/60"
            >
              <span class="font-medium">{{ t('mentorBookings.studentNote') }}:</span>
              {{ booking.studentNote }}
            </div>

            <!-- Mentor note (if previously added) -->
            <div
                v-if="booking.mentorNote"
                class="rounded-xl bg-brand-soft/30 px-4 py-3 text-sm text-text-primary ring-1 ring-border-brand/60"
            >
              <span class="font-medium">{{ t('mentorBookings.yourNote') }}:</span>
              {{ booking.mentorNote }}
            </div>

            <!-- Action buttons -->
            <div class="flex flex-wrap gap-3">
              <AppButton
                  v-if="canConfirm(booking.status)"
                  size="sm"
                  :loading="updatingId === booking.id"
                  @click="updateStatus(booking.id, 'CONFIRMED')"
              >
                {{ t('mentorBookings.confirm') }}
              </AppButton>

              <AppButton
                  v-if="canComplete(booking.status)"
                  size="sm"
                  :loading="updatingId === booking.id"
                  @click="updateStatus(booking.id, 'COMPLETED')"
              >
                {{ t('mentorBookings.complete') }}
              </AppButton>

              <AppButton
                  v-if="canCancel(booking.status)"
                  variant="danger"
                  size="sm"
                  :loading="updatingId === booking.id"
                  @click="confirmAndCancel(booking.id)"
              >
                {{ t('mentorBookings.cancel') }}
              </AppButton>
            </div>
          </div>
        </AppCard>
      </div>
    </div>

    <!-- Student Preview Side Panel -->
    <Teleport to="body">
      <Transition name="slide-panel">
        <div v-if="previewStudent" class="fixed inset-0 z-50 flex justify-end">
          <div class="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity" @click="closeStudentPreview" />
          <div class="relative w-full max-w-sm h-full bg-surface shadow-2xl flex flex-col">
            <button @click="closeStudentPreview" class="absolute top-4 right-4 z-20 p-2 rounded-full bg-surface/50 backdrop-blur-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors">
              <X class="h-5 w-5" />
            </button>
            <StudentPreviewCard :student="previewStudent" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CalendarX, X } from 'lucide-vue-next'
import { getMentorBookings, updateMentorBookingStatus } from '@/shared/api/bookingApi'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { formatDateTimeForDisplay, formatSlotTime } from '@/shared/lib/dateFormatter'
import type { MentorBookingItem, BookingStatus } from '@/shared/types/booking'
import PrivateLayout from '@/widgets/layout/PrivateLayout.vue'
import AppSectionTitle from '@/shared/ui/AppSectionTitle.vue'
import AppCard from '@/shared/ui/AppCard.vue'
import AppBadge from '@/shared/ui/AppBadge.vue'
import AppButton from '@/shared/ui/AppButton.vue'
import AppLoadingState from '@/shared/ui/AppLoadingState.vue'
import AppErrorState from '@/shared/ui/AppErrorState.vue'
import StudentPreviewCard from '@/features/bookings/StudentPreviewCard.vue'

const { t } = useI18n()
const { handleError, handleSuccess } = useErrorHandler()

// ─── State ──────────────────────────────────────────────────────────────────

const bookings = ref<MentorBookingItem[]>([])
const loading = ref(false)
const pageError = ref('')
const updatingId = ref<number | null>(null)
const activeTab = ref<BookingStatus | 'all'>('all')

interface StudentPreview {
  firstName?: string
  lastName?: string
  username?: string
  avatarUrl?: string
  learningGoals?: string
  completedLessons?: number
  activeCourses?: number
}

const previewStudent = ref<StudentPreview | null>(null)

const openStudentPreview = (booking: MentorBookingItem) => {
  // In a real app, this could fetch full student profile from API
  previewStudent.value = {
    firstName: booking.studentFirstName ?? undefined,
    lastName: booking.studentLastName ?? undefined,
    username: undefined,
    avatarUrl: booking.studentAvatarUrl ?? undefined,
    learningGoals: booking.studentNote ?? undefined,
    completedLessons: Math.floor(Math.random() * 5),
    activeCourses: Math.floor(Math.random() * 2) + 1,
  }
}

const closeStudentPreview = () => {
  previewStudent.value = null
}

// ─── Tabs ───────────────────────────────────────────────────────────────────

const countByStatus = (status: BookingStatus) =>
    bookings.value.filter((b) => b.status === status).length

const tabs = computed(() => [
  { value: 'all' as const, label: t('mentorBookings.tabAll'), count: bookings.value.length },
  { value: 'PENDING' as const, label: t('mentorBookings.tabPending'), count: countByStatus('PENDING') },
  { value: 'CONFIRMED' as const, label: t('mentorBookings.tabConfirmed'), count: countByStatus('CONFIRMED') },
  { value: 'COMPLETED' as const, label: t('mentorBookings.tabCompleted'), count: countByStatus('COMPLETED') },
  { value: 'CANCELLED_BY_MENTOR' as const, label: t('mentorBookings.tabCancelled'), count: countByStatus('CANCELLED_BY_MENTOR') + countByStatus('CANCELLED_BY_STUDENT') },
])

const filteredBookings = computed(() => {
  if (activeTab.value === 'all') return bookings.value
  if (activeTab.value === 'CANCELLED_BY_MENTOR') {
    return bookings.value.filter((b) =>
        b.status === 'CANCELLED_BY_STUDENT' || b.status === 'CANCELLED_BY_MENTOR',
    )
  }
  return bookings.value.filter((b) => b.status === activeTab.value)
})

// ─── Data loading ───────────────────────────────────────────────────────────

const loadBookings = async () => {
  loading.value = true
  pageError.value = ''
  try {
    bookings.value = await getMentorBookings()
  } catch (e) {
    pageError.value = handleError(e as any, t('mentorBookings.pageLoadError'), { toast: false })
  } finally {
    loading.value = false
  }
}

// ─── Actions ────────────────────────────────────────────────────────────────

const canConfirm = (status: BookingStatus) => status === 'PENDING'
const canComplete = (status: BookingStatus) => status === 'CONFIRMED'
const canCancel = (status: BookingStatus) => status === 'PENDING' || status === 'CONFIRMED'

const updateStatus = async (bookingId: number, status: BookingStatus) => {
  updatingId.value = bookingId
  try {
    await updateMentorBookingStatus(bookingId, status)
    const messages: Partial<Record<BookingStatus, string>> = {
      CONFIRMED: t('mentorBookings.toastConfirmed'),
      COMPLETED: t('mentorBookings.toastCompleted'),
    }
    handleSuccess(messages[status] || t('mentorBookings.statusUpdated'))
    await loadBookings()
  } catch (e) {
    handleError(e as any, t('mentorBookings.updateError'))
  } finally {
    updatingId.value = null
  }
}

const confirmAndCancel = async (bookingId: number) => {
  if (!window.confirm(t('mentorBookings.confirmCancel'))) return
  updatingId.value = bookingId
  try {
    await updateMentorBookingStatus(bookingId, 'CANCELLED_BY_MENTOR')
    handleSuccess(t('mentorBookings.toastCancelled'))
    await loadBookings()
  } catch (e) {
    handleError(e as any, t('mentorBookings.updateError'))
  } finally {
    updatingId.value = null
  }
}

// ─── Formatting ─────────────────────────────────────────────────────────────

const studentName = (b: MentorBookingItem) => {
  const full = `${b.studentFirstName || ''} ${b.studentLastName || ''}`.trim()
  return full || t('mentorBookings.unknownStudent')
}

const studentInitials = (b: MentorBookingItem) => {
  const first = b.studentFirstName?.trim()?.[0] || ''
  const last = b.studentLastName?.trim()?.[0] || ''
  return (first + last).toUpperCase() || 'S'
}

const formatDateTime = (value: string, timezone?: string) => timezone ? formatSlotTime(value, timezone) : formatDateTimeForDisplay(value)

const formatStatus = (value: BookingStatus) => {
  const map: Record<BookingStatus, string> = {
    PENDING: t('mentorBookings.statusPending'),
    CONFIRMED: t('mentorBookings.statusApproved'),
    CANCELLED_BY_STUDENT: t('mentorBookings.statusCancelledByStudent'),
    CANCELLED_BY_MENTOR: t('mentorBookings.statusCancelledByMentor'),
    COMPLETED: t('mentorBookings.statusDone'),
  }
  return map[value] || value
}

const statusVariant = (value: BookingStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
  const map: Record<BookingStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    CANCELLED_BY_STUDENT: 'danger',
    CANCELLED_BY_MENTOR: 'danger',
    COMPLETED: 'info',
  }
  return map[value] || 'default'
}


onMounted(loadBookings)
</script>

<style scoped>
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-panel-enter-from,
.slide-panel-leave-to {
  opacity: 0;
}
.slide-panel-enter-from > div:last-child {
  transform: translateX(100%);
}
.slide-panel-leave-to > div:last-child {
  transform: translateX(100%);
}
</style>
