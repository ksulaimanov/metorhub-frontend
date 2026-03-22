<template>
  <div class="min-h-screen bg-slate-50">
    <div class="mx-auto max-w-5xl px-6 py-12" v-if="mentor">
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
    </div>

    <div v-else class="mx-auto max-w-5xl px-6 py-12 text-slate-600">Загрузка профиля...</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { http } from '../../shared/api/http'

interface PublicMentorProfile {
  id: number
  firstName: string | null
  lastName: string | null
  headline: string | null
  bio: string | null
  specialization: string | null
  yearsExperience: number | null
  lessonFormatOnline: boolean
  lessonFormatOffline: boolean
  lessonFormatHybrid: boolean
  city: string | null
  addressText: string | null
  meetingLink: string | null
  pricePerHour: number | null
  averageRating: number | null
  lessonsCompleted: number | null
  verified: boolean
}

const route = useRoute()
const mentor = ref<PublicMentorProfile | null>(null)

const loadMentor = async () => {
  const { data } = await http.get(`/api/public/mentors/${route.params.id}`)
  mentor.value = data
}

onMounted(loadMentor)
</script>