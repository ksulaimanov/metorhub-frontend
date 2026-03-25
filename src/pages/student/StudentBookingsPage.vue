<template>
  <PrivateLayout>
    <div class="space-y-8">
      <AppSectionTitle
          title="Мои занятия"
          description="Следите за статусом записей, отменяйте занятия при необходимости и оставляйте отзывы после завершённых уроков."
      />

      <AppLoadingState v-if="loading" text="Загружаем ваши записи..." />

      <AppErrorState
          v-else-if="pageError"
          title="Не удалось загрузить записи"
          :description="pageError"
      />

      <AppEmptyState
          v-else-if="bookings.length === 0"
          title="У вас пока нет записей"
          description="Когда вы запишетесь к ментору, занятия появятся здесь."
      />

      <div v-else class="grid gap-4">
        <AppCard v-for="booking in bookings" :key="booking.id">
          <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div class="space-y-3">
                <p class="text-lg font-semibold text-slate-900">
                  {{ formatDateTime(booking.startAt) }} — {{ formatDateTime(booking.endAt) }}
                </p>

                <div class="flex flex-wrap items-center gap-3">
                  <AppBadge>{{ formatLessonFormat(booking.lessonFormat) }}</AppBadge>
                  <AppBadge :variant="statusVariant(booking.status)">
                    {{ formatStatus(booking.status) }}
                  </AppBadge>
                </div>

                <div class="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <p>
                    <span class="font-medium text-slate-800">Начало:</span>
                    {{ formatDateTime(booking.startAt) }}
                  </p>
                  <p>
                    <span class="font-medium text-slate-800">Окончание:</span>
                    {{ formatDateTime(booking.endAt) }}
                  </p>
                </div>

                <div
                    v-if="booking.studentNote"
                    class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200"
                >
                  <span class="font-medium text-slate-900">Ваш комментарий:</span>
                  {{ booking.studentNote }}
                </div>

                <div
                    v-if="booking.mentorNote"
                    class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200"
                >
                  <span class="font-medium text-slate-900">Комментарий ментора:</span>
                  {{ booking.mentorNote }}
                </div>
              </div>

              <button
                  v-if="canCancel(booking.status)"
                  class="rounded-2xl border border-red-300 px-4 py-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="cancelLoadingId === booking.id"
                  @click="cancelBooking(booking.id)"
              >
                {{ cancelLoadingId === booking.id ? 'Отмена...' : 'Отменить запись' }}
              </button>
            </div>

            <div
                v-if="booking.status === 'COMPLETED' && !reviewSubmitted[booking.id]"
                class="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <h2 class="text-lg font-semibold text-slate-900">Оставить отзыв</h2>
              <p class="mt-2 text-sm text-slate-600">
                Поделитесь впечатлением о занятии — это поможет другим ученикам.
              </p>

              <div class="mt-4 grid gap-4">
                <select
                    v-model="reviewForms[booking.id].rating"
                    class="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
                >
                  <option :value="5">5 — Отлично</option>
                  <option :value="4">4 — Хорошо</option>
                  <option :value="3">3 — Нормально</option>
                  <option :value="2">2 — Слабо</option>
                  <option :value="1">1 — Плохо</option>
                </select>

                <textarea
                    v-model="reviewForms[booking.id].comment"
                    class="min-h-28 rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
                    placeholder="Напишите, как прошло занятие"
                />

                <div class="flex flex-col gap-3 md:flex-row md:items-center">
                  <button
                      class="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      :disabled="reviewLoadingId === booking.id"
                      @click="submitReview(booking.id)"
                  >
                    {{ reviewLoadingId === booking.id ? 'Отправка...' : 'Отправить отзыв' }}
                  </button>

                  <p v-if="reviewMessages[booking.id]" class="text-sm font-medium text-emerald-600">
                    {{ reviewMessages[booking.id] }}
                  </p>

                  <p v-if="reviewErrors[booking.id]" class="text-sm font-medium text-red-600">
                    {{ reviewErrors[booking.id] }}
                  </p>
                </div>
              </div>
            </div>

            <div
                v-else-if="booking.status === 'COMPLETED' && reviewSubmitted[booking.id]"
                class="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
            >
              <p class="font-semibold text-emerald-700">Спасибо, отзыв отправлен.</p>
              <p class="mt-2 text-sm text-emerald-700">
                Ваше мнение помогает улучшать качество занятий на платформе.
              </p>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { http } from '../../shared/api/http'
import { createStudentReview } from '../../shared/api/reviewApi'
import { getApiErrorMessage } from '../../shared/lib/getApiErrorMessage'
import { formatDateTimeForDisplay } from '../../shared/lib/dateFormatter'
import PrivateLayout from '../../widgets/layout/PrivateLayout.vue'
import AppSectionTitle from '../../shared/ui/AppSectionTitle.vue'
import AppEmptyState from '../../shared/ui/AppEmptyState.vue'
import AppCard from '../../shared/ui/AppCard.vue'
import AppBadge from '../../shared/ui/AppBadge.vue'
import AppLoadingState from '../../shared/ui/AppLoadingState.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'

interface Booking {
  id: number
  startAt: string
  endAt: string
  lessonFormat: string
  status: string
  studentNote: string | null
  mentorNote: string | null
}

interface ReviewForm {
  rating: number
  comment: string
}

const bookings = ref<Booking[]>([])
const loading = ref(false)
const pageError = ref('')
const cancelLoadingId = ref<number | null>(null)
const reviewLoadingId = ref<number | null>(null)

const reviewForms = ref<Record<number, ReviewForm>>({})
const reviewMessages = ref<Record<number, string>>({})
const reviewErrors = ref<Record<number, string>>({})
const reviewSubmitted = ref<Record<number, boolean>>({})

const ensureReviewForm = (bookingId: number) => {
  if (!reviewForms.value[bookingId]) {
    reviewForms.value[bookingId] = {
      rating: 5,
      comment: '',
    }
  }
}

const loadBookings = async () => {
  loading.value = true
  pageError.value = ''

  try {
    const { data } = await http.get('/api/student/bookings')
    bookings.value = data

    for (const booking of bookings.value) {
      ensureReviewForm(booking.id)
    }
  } catch (error) {
    console.error('Ошибка загрузки записей ученика:', error)
    pageError.value = 'Попробуйте обновить страницу чуть позже.'
  } finally {
    loading.value = false
  }
}

const canCancel = (status: string) => status === 'PENDING' || status === 'CONFIRMED'

const cancelBooking = async (bookingId: number) => {
  cancelLoadingId.value = bookingId

  try {
    await http.patch(`/api/student/bookings/${bookingId}/cancel`)
    await loadBookings()
  } catch (error) {
    console.error('Ошибка отмены записи:', error)
    pageError.value = 'Не удалось отменить запись.'
  } finally {
    cancelLoadingId.value = null
  }
}

const submitReview = async (bookingId: number) => {
  reviewLoadingId.value = bookingId

  try {
    const form = reviewForms.value[bookingId]

    await createStudentReview({
      bookingId,
      rating: form.rating,
      comment: form.comment,
    })

    console.log('Отзыв успешно отправлен.')
    reviewSubmitted.value[bookingId] = true
  } catch (error: any) {
    getApiErrorMessage(error, 'Не удалось отправить отзыв.')
  } finally {
    reviewLoadingId.value = null
  }
}

const formatDateTime = (value: string) => formatDateTimeForDisplay(value)

const formatLessonFormat = (value: string) => {
  const map: Record<string, string> = {
    ONLINE: 'Онлайн',
    OFFLINE: 'Офлайн',
    HYBRID: 'Гибрид',
  }
  return map[value] || value
}

const formatStatus = (value: string) => {
  const map: Record<string, string> = {
    PENDING: 'Ожидает подтверждения',
    CONFIRMED: 'Подтверждено',
    CANCELLED_BY_STUDENT: 'Отменено учеником',
    CANCELLED_BY_MENTOR: 'Отменено ментором',
    COMPLETED: 'Завершено',
  }
  return map[value] || value
}

const statusVariant = (value: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
  const map: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
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