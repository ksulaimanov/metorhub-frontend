<template>
  <div class="min-h-screen bg-slate-50">
    <div class="mx-auto max-w-6xl px-6 py-12">
      <div v-if="loading" class="text-slate-600">Загрузка профиля...</div>

      <template v-else-if="mentor">
        <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-4xl font-bold text-slate-900">
                  {{ mentor.firstName || 'Без имени' }} {{ mentor.lastName || '' }}
                </h1>

                <span
                    v-if="mentor.verified"
                    class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                >
                  Проверен
                </span>
              </div>

              <p class="mt-3 text-lg text-slate-600">{{ mentor.headline || 'Ментор MentorHub' }}</p>
            </div>

            <div class="rounded-2xl bg-slate-100 px-5 py-4 text-right">
              <p class="text-sm text-slate-500">Стоимость</p>
              <p class="mt-1 text-2xl font-bold text-slate-900">
                {{ mentor.pricePerHour ? `${mentor.pricePerHour} сом/час` : 'Не указана' }}
              </p>
            </div>
          </div>

          <div class="mt-8 grid gap-6 md:grid-cols-3">
            <div class="rounded-2xl bg-slate-50 p-5">
              <p class="text-sm text-slate-500">Рейтинг</p>
              <p class="mt-2 text-2xl font-bold text-slate-900">{{ mentor.averageRating ?? 0 }}</p>
            </div>

            <div class="rounded-2xl bg-slate-50 p-5">
              <p class="text-sm text-slate-500">Проведено занятий</p>
              <p class="mt-2 text-2xl font-bold text-slate-900">{{ mentor.lessonsCompleted ?? 0 }}</p>
            </div>

            <div class="rounded-2xl bg-slate-50 p-5">
              <p class="text-sm text-slate-500">Опыт</p>
              <p class="mt-2 text-2xl font-bold text-slate-900">
                {{ mentor.yearsExperience ? `${mentor.yearsExperience} лет` : 'Не указан' }}
              </p>
            </div>
          </div>

          <div class="mt-8">
            <h2 class="text-2xl font-semibold text-slate-900">О менторе</h2>
            <p class="mt-4 whitespace-pre-line leading-8 text-slate-700">
              {{ mentor.bio || 'Описание пока не добавлено.' }}
            </p>
          </div>

          <div class="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">Специализация</h3>
              <p class="mt-2 text-slate-600">{{ mentor.specialization || 'Не указана' }}</p>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-slate-900">Город</h3>
              <p class="mt-2 text-slate-600">{{ mentor.city || 'Не указан' }}</p>
            </div>
          </div>

          <div class="mt-8">
            <h3 class="text-lg font-semibold text-slate-900">Формат занятий</h3>
            <div class="mt-3 flex flex-wrap gap-3">
              <span v-if="mentor.lessonFormatOnline" class="rounded-full bg-slate-100 px-4 py-2 text-sm">Онлайн</span>
              <span v-if="mentor.lessonFormatOffline" class="rounded-full bg-slate-100 px-4 py-2 text-sm">Офлайн</span>
              <span v-if="mentor.lessonFormatHybrid" class="rounded-full bg-slate-100 px-4 py-2 text-sm">Гибрид</span>
            </div>
          </div>

          <div class="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">Адрес</h3>
              <p class="mt-2 text-slate-600">{{ mentor.addressText || 'Не указан' }}</p>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-slate-900">Ссылка на встречу</h3>
              <p class="mt-2 break-all text-slate-600">{{ mentor.meetingLink || 'Не указана' }}</p>
            </div>
          </div>
        </div>

        <section class="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 class="text-2xl font-semibold text-slate-900">Отзывы учеников</h2>

            <div v-if="reviews.length === 0" class="mt-6 text-slate-500">
              Пока нет отзывов.
            </div>

            <div v-else class="mt-6 space-y-4">
              <div
                  v-for="review in reviews"
                  :key="review.id"
                  class="rounded-2xl border border-slate-200 p-5"
              >
                <div class="flex items-center justify-between gap-4">
                  <p class="font-semibold text-slate-900">Оценка: {{ review.rating }}/5</p>
                  <p class="text-sm text-slate-500">{{ formatDate(review.createdAt) }}</p>
                </div>

                <p class="mt-3 whitespace-pre-line text-slate-700">
                  {{ review.comment || 'Без комментария' }}
                </p>
              </div>
            </div>
          </div>

          <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 class="text-2xl font-semibold text-slate-900">Доступные слоты</h2>

            <div v-if="slots.length === 0" class="mt-6 text-slate-500">
              Сейчас у ментора нет доступных слотов.
            </div>

            <div v-else class="mt-6 space-y-4">
              <div
                  v-for="slot in slots"
                  :key="slot.id"
                  class="rounded-2xl border border-slate-200 p-5"
              >
                <p class="font-semibold text-slate-900">{{ formatDateTime(slot.startAt) }}</p>
                <p class="mt-1 text-slate-600">{{ formatDateTime(slot.endAt) }}</p>
                <p class="mt-2 text-sm text-slate-600">Формат: {{ slot.lessonFormat }}</p>
                <p class="mt-1 text-sm text-slate-600">Часовой пояс: {{ slot.timezone }}</p>

                <p v-if="slot.meetingLink" class="mt-1 break-all text-sm text-slate-600">
                  Ссылка: {{ slot.meetingLink }}
                </p>

                <p v-if="slot.addressText" class="mt-1 text-sm text-slate-600">
                  Адрес: {{ slot.addressText }}
                </p>

                <div class="mt-4">
                  <textarea
                      v-model="slotNotes[slot.id]"
                      class="min-h-24 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                      placeholder="Комментарий к занятию"
                  />
                </div>

                <button
                    class="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="bookingLoadingId === slot.id"
                    @click="bookSlot(slot.id)"
                >
                  {{ bookingLoadingId === slot.id ? 'Запись...' : 'Записаться на занятие' }}
                </button>
              </div>
            </div>

            <p v-if="bookingMessage" class="mt-6 text-sm font-medium text-emerald-600">
              {{ bookingMessage }}
            </p>

            <p v-if="bookingError" class="mt-3 text-sm font-medium text-red-600">
              {{ bookingError }}
            </p>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { createStudentBooking } from '../../shared/api/bookingApi'
import {
  getPublicMentorProfile,
  getPublicMentorReviews,
  getPublicMentorSlots,
} from '../../shared/api/mentorPublicApi'
import type { AvailabilitySlot, MentorReview, PublicMentorProfile } from '../../shared/types/mentor'

const route = useRoute()

const loading = ref(true)
const mentor = ref<PublicMentorProfile | null>(null)
const reviews = ref<MentorReview[]>([])
const slots = ref<AvailabilitySlot[]>([])
const slotNotes = ref<Record<number, string>>({})
const bookingLoadingId = ref<number | null>(null)
const bookingMessage = ref('')
const bookingError = ref('')

const loadPage = async () => {
  loading.value = true

  try {
    const mentorId = String(route.params.id)

    const [mentorData, reviewData, slotData] = await Promise.all([
      getPublicMentorProfile(mentorId),
      getPublicMentorReviews(mentorId),
      getPublicMentorSlots(mentorId),
    ])

    mentor.value = mentorData
    reviews.value = reviewData
    slots.value = slotData
  } finally {
    loading.value = false
  }
}

const bookSlot = async (slotId: number) => {
  bookingMessage.value = ''
  bookingError.value = ''
  bookingLoadingId.value = slotId

  try {
    await createStudentBooking({
      availabilitySlotId: slotId,
      studentNote: slotNotes.value[slotId] || '',
    })

    bookingMessage.value = 'Вы успешно записались на занятие.'
    slots.value = slots.value.filter((slot) => slot.id !== slotId)
    delete slotNotes.value[slotId]
  } catch (error: any) {
    bookingError.value = error?.response?.data?.error || 'Не удалось записаться на занятие'
  } finally {
    bookingLoadingId.value = null
  }
}

const formatDate = (value: string) => {
  return new Date(value).toLocaleDateString('ru-RU')
}

const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString('ru-RU')
}

onMounted(loadPage)
</script>