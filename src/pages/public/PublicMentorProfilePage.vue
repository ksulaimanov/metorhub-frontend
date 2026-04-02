<template>
  <PublicLayout>
    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <!-- ─── Loading skeleton ─── -->
      <div v-if="loading" class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div class="space-y-6">
          <div class="animate-pulse rounded-[2rem] bg-white p-6 ring-1 ring-border-brand/80 md:p-8">
            <div class="flex flex-col gap-6 md:flex-row md:items-start">
              <div class="h-28 w-28 shrink-0 rounded-full bg-brand-soft" />
              <div class="flex-1 space-y-3">
                <div class="h-8 w-48 rounded bg-brand-soft" />
                <div class="h-4 w-64 rounded bg-brand-soft/60" />
                <div class="mt-4 flex gap-2">
                  <div class="h-7 w-16 rounded-full bg-brand-soft/50" />
                  <div class="h-7 w-16 rounded-full bg-brand-soft/50" />
                </div>
                <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div v-for="i in 4" :key="i" class="h-16 rounded-xl bg-brand-soft/40" />
                </div>
              </div>
            </div>
          </div>
          <div class="animate-pulse rounded-2xl bg-white p-6 ring-1 ring-border-brand/80">
            <div class="h-5 w-32 rounded bg-brand-soft" />
            <div class="mt-4 space-y-2">
              <div class="h-3 w-full rounded bg-brand-soft/40" />
              <div class="h-3 w-4/5 rounded bg-brand-soft/40" />
              <div class="h-3 w-3/5 rounded bg-brand-soft/40" />
            </div>
          </div>
        </div>
        <div class="animate-pulse rounded-2xl bg-white p-6 ring-1 ring-border-brand/80">
          <div class="h-5 w-40 rounded bg-brand-soft" />
          <div class="mt-4 h-3 w-full rounded bg-brand-soft/40" />
          <div class="mt-6 h-12 w-full rounded-xl bg-brand-soft" />
        </div>
      </div>

      <!-- ─── Error ─── -->
      <AppErrorState
          v-else-if="error"
          :title="t('publicMentorProfile.loadError')"
          :description="error"
      />

      <!-- ─── Profile content ─── -->
      <template v-else-if="mentor">
        <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <!-- ═══ Left column ═══ -->
          <div class="space-y-6">
            <!-- ── Profile hero card ── -->
            <div class="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-border-brand/80 md:p-8">
              <div class="flex flex-col gap-6 md:flex-row md:items-start">
                <!-- Avatar -->
                <div class="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-soft text-3xl font-bold text-brand">
                  <img v-if="mentor.avatarUrl" :src="mentor.avatarUrl" :alt="mentorName" class="h-full w-full object-cover" />
                  <span v-else>{{ mentorInitials }}</span>
                </div>

                <div class="min-w-0 flex-1">
                  <!-- Name + badge -->
                  <div class="flex flex-wrap items-center gap-3">
                    <h1 class="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">{{ mentorName }}</h1>
                    <AppBadge v-if="mentor.verified" variant="success">{{ t('publicMentorProfile.verified') }}</AppBadge>
                  </div>

                  <!-- Headline -->
                  <p class="mt-2 text-lg text-text-secondary">{{ mentor.headline || t('publicMentorProfile.defaultHeadline') }}</p>

                  <!-- Trust summary line -->
                  <div class="mt-3 flex flex-wrap items-center gap-4 text-sm">
                    <div v-if="mentor.averageRating" class="flex items-center gap-1.5">
                      <StarRating :rating="mentor.averageRating" :show-value="false" class="text-sm" />
                      <span class="font-semibold text-text-primary">{{ (mentor.averageRating).toFixed(1) }}</span>
                      <span v-if="reviews.length" class="text-text-secondary">({{ t('publicMentorProfile.reviewCount', { count: reviews.length }) }})</span>
                    </div>
                    <span v-if="mentor.lessonsCompleted" class="text-text-secondary">
                      {{ mentor.lessonsCompleted }} {{ t('publicMentorProfile.lessonsUnit') }}
                    </span>
                  </div>

                  <!-- Format badges -->
                  <div class="mt-4 flex flex-wrap gap-2">
                    <AppBadge v-if="mentor.lessonFormatOnline">{{ t('common.lessonFormat.ONLINE') }}</AppBadge>
                    <AppBadge v-if="mentor.lessonFormatOffline">{{ t('common.lessonFormat.OFFLINE') }}</AppBadge>
                    <AppBadge v-if="mentor.lessonFormatHybrid">{{ t('common.lessonFormat.HYBRID') }}</AppBadge>
                  </div>

                  <!-- Quick stats -->
                  <div class="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div class="rounded-xl bg-surface-secondary p-3.5">
                      <p class="text-xs text-text-secondary">{{ t('publicMentorProfile.specialization') }}</p>
                      <p class="mt-0.5 text-sm font-semibold text-text-primary">{{ mentor.specialization || t('publicMentorProfile.specNotSet') }}</p>
                    </div>
                    <div class="rounded-xl bg-surface-secondary p-3.5">
                      <p class="text-xs text-text-secondary">{{ t('publicMentorProfile.experience') }}</p>
                      <p class="mt-0.5 text-sm font-semibold text-text-primary">{{ mentor.yearsExperience ?? 0 }} {{ t('publicMentorProfile.yearsUnit') }}</p>
                    </div>
                    <div class="rounded-xl bg-surface-secondary p-3.5">
                      <p class="text-xs text-text-secondary">{{ t('publicMentorProfile.rating') }}</p>
                      <StarRating :rating="mentor.averageRating" class="mt-0.5 text-sm" />
                    </div>
                    <div class="rounded-xl bg-surface-secondary p-3.5">
                      <p class="text-xs text-text-secondary">{{ t('publicMentorProfile.lessonsCompleted') }}</p>
                      <p class="mt-0.5 text-sm font-semibold text-text-primary">{{ mentor.lessonsCompleted ?? 0 }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── About ── -->
            <AppCard>
              <h2 class="text-xl font-semibold text-text-primary">{{ t('publicMentorProfile.aboutMentor') }}</h2>
              <p class="mt-4 whitespace-pre-line leading-8 text-text-secondary">{{ mentor.bio || t('publicMentorProfile.noBio') }}</p>
            </AppCard>

            <!-- ── Lesson details ── -->
            <AppCard>
              <h2 class="text-xl font-semibold text-text-primary">{{ t('publicMentorProfile.lessonDetails') }}</h2>
              <div class="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <p class="text-sm text-text-secondary">{{ t('publicMentorProfile.city') }}</p>
                  <p class="mt-1 font-medium text-text-primary">{{ mentor.city || t('publicMentorProfile.cityNotSet') }}</p>
                </div>
                <div>
                  <p class="text-sm text-text-secondary">{{ t('publicMentorProfile.price') }}</p>
                  <p class="mt-1 font-medium text-text-primary">{{ mentor.pricePerHour ? `${mentor.pricePerHour} ${t('publicMentorProfile.priceSuffix')}` : t('publicMentorProfile.priceNotSet') }}</p>
                </div>
              </div>
            </AppCard>

            <!-- ── Reviews ── -->
            <AppCard>
              <ReviewList
                  :reviews="reviews"
                  :loading="reviewsLoading"
                  :error="reviewsError"
              />
            </AppCard>
          </div>

          <!-- ═══ Right column ═══ -->
          <div class="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <!-- ── Booking CTA card ── -->
            <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border-brand/80">
              <h2 class="text-xl font-semibold text-text-primary">{{ t('publicMentorProfile.bookingTitle') }}</h2>
              <p class="mt-2 text-sm text-text-secondary">{{ t('publicMentorProfile.bookingDesc') }}</p>

              <!-- Price highlight -->
              <div v-if="mentor.pricePerHour" class="mt-5 rounded-xl bg-brand-soft/50 p-4 text-center">
                <p class="text-2xl font-bold text-brand">{{ mentor.pricePerHour }} {{ t('publicMentorProfile.priceSuffix') }}</p>
              </div>

              <!-- Formats -->
              <div class="mt-5 rounded-xl bg-surface-secondary p-4 ring-1 ring-border-brand/50">
                <p class="text-xs font-medium text-text-secondary">{{ t('publicMentorProfile.formats') }}</p>
                <div class="mt-2 flex flex-wrap gap-2">
                  <AppBadge v-if="mentor.lessonFormatOnline">{{ t('common.lessonFormat.ONLINE') }}</AppBadge>
                  <AppBadge v-if="mentor.lessonFormatOffline">{{ t('common.lessonFormat.OFFLINE') }}</AppBadge>
                  <AppBadge v-if="mentor.lessonFormatHybrid">{{ t('common.lessonFormat.HYBRID') }}</AppBadge>
                </div>
              </div>

              <button
                  type="button"
                  class="mt-6 w-full rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-md shadow-brand/20 transition hover:bg-brand-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="!mentor.hasAvailableSlots"
                  @click="scrollToSlots"
              >
                {{ mentor.hasAvailableSlots ? t('publicMentorProfile.viewSlots') : t('publicMentorProfile.noAvailableSlots') }}
              </button>
            </div>

            <!-- ── Slots section ── -->
            <div id="slots" class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border-brand/80">
              <h2 class="text-xl font-semibold text-text-primary">{{ t('publicMentorProfile.slotsTitle') }}</h2>

              <!-- Slots loading skeleton -->
              <div v-if="slotsLoading" class="mt-5 space-y-3">
                <div v-for="i in 2" :key="i" class="animate-pulse rounded-xl bg-surface-secondary p-4">
                  <div class="h-4 w-48 rounded bg-brand-soft" />
                  <div class="mt-3 flex gap-2">
                    <div class="h-6 w-16 rounded-full bg-brand-soft/50" />
                    <div class="h-6 w-20 rounded-full bg-brand-soft/50" />
                  </div>
                </div>
              </div>

              <!-- Slots error -->
              <div v-else-if="slotsError" class="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                {{ slotsError }}
              </div>

              <!-- Slots empty -->
              <div v-else-if="slots.length === 0" class="mt-5 rounded-xl bg-surface-secondary p-6 text-center">
                <p class="text-sm font-medium text-text-primary">{{ t('publicMentorProfile.noSlots') }}</p>
                <p class="mt-1 text-xs text-text-secondary">{{ t('publicMentorProfile.noSlotsHint') }}</p>
              </div>

              <!-- Slots list -->
              <div v-else class="mt-5 space-y-4">
                <div
                    v-for="slot in slots"
                    :key="slot.id"
                    class="rounded-xl p-4 ring-1"
                    :class="isSlotPast(slot) ? 'bg-surface-secondary/50 ring-border-brand/30 opacity-60' : 'bg-surface-secondary ring-border-brand/50'"
                >
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div class="min-w-0">
                      <p class="text-base font-semibold text-text-primary">
                        {{ formatDateTime(slot.startAt) }} — {{ formatDateTime(slot.endAt) }}
                      </p>

                      <div class="mt-2 flex flex-wrap gap-1.5">
                        <AppBadge>{{ t(`common.lessonFormat.${slot.lessonFormat}`, slot.lessonFormat) }}</AppBadge>
                        <AppBadge v-if="isSlotPast(slot)" variant="default">{{ t('publicMentorProfile.slotPast') }}</AppBadge>
                        <AppBadge v-else-if="!slot.active" variant="danger">{{ t('publicMentorProfile.slotUnavailable') }}</AppBadge>
                        <AppBadge v-else-if="slot.availableSeats === 0" variant="danger">{{ t('publicMentorProfile.noSeats') }}</AppBadge>
                        <AppBadge v-else-if="slot.availableSeats === 1" variant="warning">{{ t('publicMentorProfile.lastSeat') }}</AppBadge>
                        <AppBadge v-else variant="success">{{ t('publicMentorProfile.available') }}: {{ slot.availableSeats }}</AppBadge>
                      </div>

                      <p v-if="!isSlotPast(slot) && slot.availableSeats > 1" class="mt-2 text-xs text-text-secondary">
                        {{ t('publicMentorProfile.groupAvailable', { count: slot.availableSeats }) }}
                      </p>
                    </div>

                    <button
                        type="button"
                        class="shrink-0 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="bookingLoadingId === slot.id || !slot.bookable || isSlotPast(slot)"
                        @click="toggleBookingForm(slot.id)"
                    >
                      {{ slotButtonLabel(slot) }}
                    </button>
                  </div>

                  <!-- Booking success card (replaces form after booking) -->
                  <div v-if="bookedSlotId === slot.id" class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                    <div class="flex items-start gap-3">
                      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 class="h-5 w-5 text-emerald-600" />
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="font-semibold text-emerald-800">{{ t('publicMentorProfile.bookingSuccessTitle') }}</p>
                        <p class="mt-1 text-sm text-emerald-700">
                          {{ t('publicMentorProfile.bookingSuccessDesc', { mentor: mentorName, date: formatDateTime(slot.startAt) }) }}
                        </p>
                        <div class="mt-4 flex flex-wrap gap-3">
                          <RouterLink
                              to="/student/bookings"
                              class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                          >
                            {{ t('publicMentorProfile.goToBookings') }}
                          </RouterLink>
                          <button
                              type="button"
                              class="rounded-lg border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                              @click="bookedSlotId = null"
                          >
                            {{ t('publicMentorProfile.backToSlots') }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Booking form -->
                  <div v-else-if="activeBookingFormId === slot.id && slot.bookable && !isSlotPast(slot)" class="mt-4 rounded-xl border border-border-brand bg-white p-4">
                    <label class="mb-1.5 block text-sm font-medium text-text-primary">{{ t('publicMentorProfile.noteLabel') }}</label>
                    <textarea
                        v-model.trim="studentNotes[slot.id]"
                        class="min-h-24 w-full rounded-xl border border-border-brand bg-white px-4 py-3 text-sm outline-none transition placeholder:text-text-secondary/60 focus:border-brand focus:ring-2 focus:ring-brand/20"
                        :placeholder="t('publicMentorProfile.notePlaceholder')"
                    />

                    <div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <button
                          type="button"
                          class="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                          :disabled="bookingLoadingId === slot.id"
                          @click="bookSlot(slot.id)"
                      >
                        {{ bookingLoadingId === slot.id ? t('publicMentorProfile.submitting') : t('publicMentorProfile.submit') }}
                      </button>
                      <p class="text-xs text-text-secondary">{{ t('publicMentorProfile.submitHint') }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getPublicMentorProfile, getPublicMentorReviews, getPublicMentorSlots } from '../../shared/api/mentorPublicApi'
import { createStudentBooking } from '../../shared/api/bookingApi'
import { useToastStore } from '../../shared/lib/getApiErrorMessage'
import { getApiErrorMessage } from '../../shared/lib/getApiErrorMessage'
import { formatDateTimeForDisplay } from '../../shared/lib/dateFormatter'
import type { PublicMentorProfile, AvailabilitySlot, MentorReview } from '../../shared/types/mentor'
import { CheckCircle2 } from 'lucide-vue-next'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import AppCard from '../../shared/ui/AppCard.vue'
import AppBadge from '../../shared/ui/AppBadge.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'
import StarRating from '../../shared/ui/StarRating.vue'
import ReviewList from '../../features/reviews/ReviewList.vue'

const { t } = useI18n()
const toastStore = useToastStore()
const route = useRoute()
const router = useRouter()

const mentor = ref<PublicMentorProfile | null>(null)
const loading = ref(false)
const error = ref('')

const slots = ref<AvailabilitySlot[]>([])
const slotsLoading = ref(false)
const slotsError = ref('')

const reviews = ref<MentorReview[]>([])
const reviewsLoading = ref(false)
const reviewsError = ref('')

const bookingLoadingId = ref<number | null>(null)
const activeBookingFormId = ref<number | null>(null)
const bookedSlotId = ref<number | null>(null)
const studentNotes = ref<Record<number, string>>({})

const mentorId = Number(route.params.id)

const mentorName = computed(() => {
  if (!mentor.value) return t('publicMentorProfile.mentorFallback')
  const full = `${mentor.value.firstName || ''} ${mentor.value.lastName || ''}`.trim()
  return full || t('publicMentorProfile.noName')
})

const mentorInitials = computed(() => {
  if (!mentor.value) return 'M'
  const first = mentor.value.firstName?.trim()?.[0] || ''
  const last = mentor.value.lastName?.trim()?.[0] || ''
  return (first + last).toUpperCase() || 'M'
})

const loadMentor = async () => {
  loading.value = true
  error.value = ''
  try {
    mentor.value = await getPublicMentorProfile(mentorId)
  } catch (e) {
    console.error(e)
    error.value = t('publicMentorProfile.pageLoadError')
  } finally {
    loading.value = false
  }
}

const loadSlots = async () => {
  slotsLoading.value = true
  slotsError.value = ''
  try {
    slots.value = await getPublicMentorSlots(mentorId)
  } catch (e) {
    console.error(e)
    slotsError.value = t('publicMentorProfile.slotsPageError')
  } finally {
    slotsLoading.value = false
  }
}

const loadReviews = async () => {
  reviewsLoading.value = true
  reviewsError.value = ''
  try {
    reviews.value = await getPublicMentorReviews(mentorId)
  } catch (e) {
    console.error(e)
    reviewsError.value = t('publicMentorProfile.reviewsLoadError')
  } finally {
    reviewsLoading.value = false
  }
}

const toggleBookingForm = (slotId: number) => {
  if (activeBookingFormId.value === slotId) {
    activeBookingFormId.value = null
    return
  }
  activeBookingFormId.value = slotId
  if (studentNotes.value[slotId] === undefined) {
    studentNotes.value[slotId] = ''
  }
}

const bookSlot = async (slotId: number) => {
  bookingLoadingId.value = slotId
  try {
    await createStudentBooking({
      availabilitySlotId: slotId,
      studentNote: studentNotes.value[slotId] || '',
    })
    // Show inline success card instead of just toast
    activeBookingFormId.value = null
    bookedSlotId.value = slotId
    studentNotes.value[slotId] = ''
    await loadSlots()
  } catch (e: any) {
    console.error(e)
    const status = e?.response?.status
    if (status === 401 || status === 403) {
      toastStore.error(t('publicMentorProfile.loginRequired'))
      await router.push({ path: '/login', query: { redirect: route.fullPath } })
      return
    }
    toastStore.error(getApiErrorMessage(e, t('publicMentorProfile.bookingError')))
  } finally {
    bookingLoadingId.value = null
  }
}

const isSlotPast = (slot: AvailabilitySlot) => new Date(slot.endAt) < new Date()

const slotButtonLabel = (slot: AvailabilitySlot) => {
  if (activeBookingFormId.value === slot.id) return t('publicMentorProfile.hideForm')
  if (isSlotPast(slot)) return t('publicMentorProfile.slotPastBtn')
  if (!slot.active) return t('publicMentorProfile.slotUnavailable')
  if (slot.availableSeats === 0) return t('publicMentorProfile.noSlotsBtn')
  return t('publicMentorProfile.bookBtn')
}

const formatDateTime = (value: string) => formatDateTimeForDisplay(value)

const scrollToSlots = () => {
  document.getElementById('slots')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(async () => {
  await loadMentor()
  await Promise.all([loadSlots(), loadReviews()])
})
</script>
