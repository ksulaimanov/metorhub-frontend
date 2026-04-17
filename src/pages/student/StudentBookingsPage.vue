<template>
  <PrivateLayout>
    <div class="space-y-8">
      <AppSectionTitle
          :title="t('studentBookings.title')"
          :description="t('studentBookings.description')"
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
      <AppLoadingState v-if="loading" :text="t('studentBookings.loadingBookings')" />

      <!-- ─── Error ─── -->
      <AppErrorState
          v-else-if="pageError"
          :title="t('studentBookings.loadError')"
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
          {{ activeTab === 'all' ? t('studentBookings.emptyTitle') : t('studentBookings.emptyFilterTitle') }}
        </h3>
        <p class="mt-2 text-sm text-text-secondary">
          {{ activeTab === 'all' ? t('studentBookings.emptyDesc') : t('studentBookings.emptyFilterDesc') }}
        </p>
        <RouterLink
            v-if="activeTab === 'all'"
            to="/mentors"
            class="mt-5 inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          {{ t('studentBookings.findMentor') }}
        </RouterLink>
      </div>

      <!-- ─── Booking cards ─── -->
      <div v-else class="grid gap-4">
        <AppCard v-for="booking in filteredBookings" :key="booking.id" radius="lg" padding="md">
          <div class="flex flex-col gap-5">
            <!-- Header row: mentor info + status -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <!-- Mentor info -->
              <div class="flex items-center gap-3.5">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-soft text-sm font-bold text-brand">
                  <img
                      v-if="booking.mentorAvatarUrl"
                      :src="booking.mentorAvatarUrl"
                      :alt="mentorName(booking)"
                      class="h-full w-full object-cover"
                  />
                  <span v-else>{{ mentorInitials(booking) }}</span>
                </div>
                <div class="min-w-0">
                  <p class="truncate text-base font-semibold text-text-primary">{{ mentorName(booking) }}</p>
                  <p class="text-sm text-text-secondary">{{ formatDateTime(booking.startAt) }}</p>
                </div>
              </div>

              <!-- Status badge -->
              <div class="flex flex-wrap items-center gap-2">
                <AppBadge>{{ t(`common.lessonFormat.${booking.lessonFormat}`, booking.lessonFormat) }}</AppBadge>
                <AppBadge :variant="statusVariant(booking.status)">{{ formatStatus(booking.status) }}</AppBadge>
              </div>
            </div>

            <!-- Time details -->
            <div class="grid gap-2 rounded-xl bg-surface-secondary p-3.5 text-sm sm:grid-cols-2">
              <div>
                <p class="text-xs text-text-secondary">{{ t('studentBookings.startLabel') }}</p>
                <p class="mt-0.5 font-medium text-text-primary">{{ formatDateTime(booking.startAt) }}</p>
              </div>
              <div>
                <p class="text-xs text-text-secondary">{{ t('studentBookings.endLabel') }}</p>
                <p class="mt-0.5 font-medium text-text-primary">{{ formatDateTime(booking.endAt) }}</p>
              </div>
            </div>

            <!-- Notes -->
            <div
                v-if="booking.studentNote"
                class="rounded-xl bg-brand-soft/30 px-4 py-3 text-sm text-text-primary ring-1 ring-border-brand/60"
            >
              <span class="font-medium">{{ t('studentBookings.yourNote') }}:</span>
              {{ booking.studentNote }}
            </div>

            <div
                v-if="booking.mentorNote"
                class="rounded-xl bg-brand-soft/30 px-4 py-3 text-sm text-text-primary ring-1 ring-border-brand/60"
            >
              <span class="font-medium">{{ t('studentBookings.mentorNote') }}:</span>
              {{ booking.mentorNote }}
            </div>

            <!-- Actions -->
            <div class="flex flex-wrap items-center gap-3">
              <AppButton
                  v-if="canCancel(booking.status)"
                  variant="danger"
                  size="sm"
                  :loading="cancelLoadingId === booking.id"
                  @click="cancelBooking(booking.id)"
              >
                {{ t('studentBookings.cancelBooking') }}
              </AppButton>

              <RouterLink
                  v-if="booking.mentorId"
                  :to="`/mentors/${booking.mentorId}`"
                  class="text-sm font-medium text-brand transition hover:text-brand-hover"
              >
                {{ t('studentBookings.viewMentor') }}
              </RouterLink>
            </div>

            <!-- Review section for completed bookings -->
            <div
                v-if="booking.status === 'COMPLETED' && !reviewSubmitted[booking.id]"
                class="rounded-xl border border-border-brand bg-surface-secondary p-5"
            >
              <h2 class="text-base font-semibold text-text-primary">{{ t('studentBookings.reviewTitle') }}</h2>
              <p class="mt-1 text-sm text-text-secondary">{{ t('studentBookings.reviewHint') }}</p>

              <div class="mt-4 grid gap-4">
                <select
                    v-model="reviewForms[booking.id].rating"
                    class="rounded-xl border border-border-brand bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  <option :value="5">{{ t('studentBookings.rating5') }}</option>
                  <option :value="4">{{ t('studentBookings.rating4') }}</option>
                  <option :value="3">{{ t('studentBookings.rating3') }}</option>
                  <option :value="2">{{ t('studentBookings.rating2') }}</option>
                  <option :value="1">{{ t('studentBookings.rating1') }}</option>
                </select>

                <textarea
                    v-model="reviewForms[booking.id].comment"
                    class="min-h-24 rounded-xl border border-border-brand bg-surface px-4 py-3 text-sm outline-none transition placeholder:text-text-secondary/60 focus:border-brand focus:ring-2 focus:ring-brand/20"
                    :placeholder="t('studentBookings.reviewPlaceholder')"
                />

                <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <AppButton
                      size="sm"
                      :loading="reviewLoadingId === booking.id"
                      @click="submitReview(booking.id)"
                  >
                    {{ t('studentBookings.submitReview') }}
                  </AppButton>

                  <p v-if="reviewErrors[booking.id]" class="text-sm font-medium text-red-600">
                    {{ reviewErrors[booking.id] }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Review submitted -->
            <div
                v-else-if="booking.status === 'COMPLETED' && reviewSubmitted[booking.id]"
                class="rounded-xl border border-emerald-200 bg-emerald-50 p-5"
            >
              <p class="font-semibold text-emerald-700">{{ t('studentBookings.reviewThanks') }}</p>
              <p class="mt-1 text-sm text-emerald-700">{{ t('studentBookings.reviewThanksDesc') }}</p>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CalendarX } from 'lucide-vue-next'
import { getStudentBookings, cancelStudentBooking } from '@/shared/api/bookingApi'
import { createStudentReview } from '@/shared/api/reviewApi'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { formatDateTimeForDisplay } from '@/shared/lib/dateFormatter'
import type { StudentBookingItem, BookingStatus } from '@/shared/types/booking'
import PrivateLayout from '@/widgets/layout/PrivateLayout.vue'
import AppSectionTitle from '@/shared/ui/AppSectionTitle.vue'
import AppCard from '@/shared/ui/AppCard.vue'
import AppBadge from '@/shared/ui/AppBadge.vue'
import AppButton from '@/shared/ui/AppButton.vue'
import AppLoadingState from '@/shared/ui/AppLoadingState.vue'
import AppErrorState from '@/shared/ui/AppErrorState.vue'

const { t } = useI18n()
const { handleError, handleSuccess } = useErrorHandler()

// ─── State ──────────────────────────────────────────────────────────────────

const bookings = ref<StudentBookingItem[]>([])
const loading = ref(false)
const pageError = ref('')
const cancelLoadingId = ref<number | null>(null)
const reviewLoadingId = ref<number | null>(null)
const activeTab = ref<BookingStatus | 'all'>('all')

interface ReviewForm { rating: number; comment: string }
const reviewForms = ref<Record<number, ReviewForm>>({})
const reviewErrors = ref<Record<number, string>>({})
const reviewSubmitted = ref<Record<number, boolean>>({})

// ─── Tabs ───────────────────────────────────────────────────────────────────

const countByStatus = (status: BookingStatus) =>
    bookings.value.filter((b) => b.status === status).length

const tabs = computed(() => [
  { value: 'all' as const, label: t('studentBookings.tabAll'), count: bookings.value.length },
  { value: 'PENDING' as const, label: t('studentBookings.tabPending'), count: countByStatus('PENDING') },
  { value: 'CONFIRMED' as const, label: t('studentBookings.tabConfirmed'), count: countByStatus('CONFIRMED') },
  { value: 'COMPLETED' as const, label: t('studentBookings.tabCompleted'), count: countByStatus('COMPLETED') },
  { value: 'CANCELLED_BY_STUDENT' as const, label: t('studentBookings.tabCancelled'), count: countByStatus('CANCELLED_BY_STUDENT') + countByStatus('CANCELLED_BY_MENTOR') },
])

const filteredBookings = computed(() => {
  if (activeTab.value === 'all') return bookings.value
  if (activeTab.value === 'CANCELLED_BY_STUDENT') {
    return bookings.value.filter((b) =>
        b.status === 'CANCELLED_BY_STUDENT' || b.status === 'CANCELLED_BY_MENTOR',
    )
  }
  return bookings.value.filter((b) => b.status === activeTab.value)
})

// ─── Data loading ───────────────────────────────────────────────────────────

const ensureReviewForm = (bookingId: number) => {
  if (!reviewForms.value[bookingId]) {
    reviewForms.value[bookingId] = { rating: 5, comment: '' }
  }
}

const loadBookings = async () => {
  loading.value = true
  pageError.value = ''
  try {
    bookings.value = await getStudentBookings()
    for (const booking of bookings.value) {
      ensureReviewForm(booking.id)
    }
  } catch (e) {
    pageError.value = handleError(e as any, t('studentBookings.pageLoadError'), { toast: false })
  } finally {
    loading.value = false
  }
}

// ─── Actions ────────────────────────────────────────────────────────────────

const canCancel = (status: BookingStatus) => status === 'PENDING' || status === 'CONFIRMED'

const cancelBooking = async (bookingId: number) => {
  cancelLoadingId.value = bookingId
  try {
    await cancelStudentBooking(bookingId)
    handleSuccess(t('studentBookings.cancelSuccess'))
    await loadBookings()
  } catch (e) {
    handleError(e as any, t('studentBookings.cancelError'))
  } finally {
    cancelLoadingId.value = null
  }
}

const submitReview = async (bookingId: number) => {
  reviewLoadingId.value = bookingId
  reviewErrors.value[bookingId] = ''
  try {
    const form = reviewForms.value[bookingId]
    await createStudentReview({ bookingId, rating: form.rating, comment: form.comment })
    reviewSubmitted.value[bookingId] = true
    handleSuccess(t('studentBookings.reviewThanks'))
  } catch (e: any) {
    reviewErrors.value[bookingId] = handleError(e, t('studentBookings.reviewError'), { toast: false })
  } finally {
    reviewLoadingId.value = null
  }
}

// ─── Formatting ─────────────────────────────────────────────────────────────

const mentorName = (b: StudentBookingItem) => {
  const full = `${b.mentorFirstName || ''} ${b.mentorLastName || ''}`.trim()
  return full || t('studentBookings.unknownMentor')
}

const mentorInitials = (b: StudentBookingItem) => {
  const first = b.mentorFirstName?.trim()?.[0] || ''
  const last = b.mentorLastName?.trim()?.[0] || ''
  return (first + last).toUpperCase() || 'M'
}

const formatDateTime = (value: string) => formatDateTimeForDisplay(value)

const formatStatus = (value: BookingStatus) => {
  const map: Record<BookingStatus, string> = {
    PENDING: t('studentBookings.statusPending'),
    CONFIRMED: t('studentBookings.statusConfirmed'),
    CANCELLED_BY_STUDENT: t('studentBookings.statusCancelledByStudent'),
    CANCELLED_BY_MENTOR: t('studentBookings.statusCancelledByMentor'),
    COMPLETED: t('studentBookings.statusCompleted'),
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
