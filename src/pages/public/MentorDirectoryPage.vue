<template>
  <div class="min-h-screen bg-slate-50">
    <div class="mx-auto max-w-7xl px-6 py-12">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-slate-900">Каталог менторов</h1>
        <p class="mt-2 text-slate-600">Выберите наставника по цели, формату и стоимости занятий.</p>
      </div>

      <div class="mb-8 grid gap-4 md:grid-cols-4">
        <input
          v-model="query"
          type="text"
          placeholder="Поиск по имени или специализации"
          class="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900 md:col-span-2"
        />

        <input
          v-model="city"
          type="text"
          placeholder="Город"
          class="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
        />

        <select
          v-model="sortBy"
          class="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
        >
          <option value="">По умолчанию</option>
          <option value="ratingDesc">По рейтингу</option>
          <option value="priceAsc">Сначала дешевле</option>
          <option value="priceDesc">Сначала дороже</option>
          <option value="experienceDesc">По опыту</option>
        </select>
      </div>

      <div class="mb-8 flex flex-wrap gap-3">
        <label class="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm ring-1 ring-slate-200">
          <input v-model="online" type="checkbox" />
          Онлайн
        </label>

        <label class="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm ring-1 ring-slate-200">
          <input v-model="offline" type="checkbox" />
          Офлайн
        </label>

        <label class="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm ring-1 ring-slate-200">
          <input v-model="hybrid" type="checkbox" />
          Гибрид
        </label>
      </div>

      <div v-if="loading" class="text-slate-600">Загрузка менторов...</div>

      <div v-else class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <RouterLink
          v-for="mentor in mentors"
          :key="mentor.id"
          :to="`/mentors/${mentor.id}`"
          class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-xl font-semibold text-slate-900">
                {{ mentor.firstName || 'Без имени' }} {{ mentor.lastName || '' }}
              </h3>
              <p class="mt-1 text-sm text-slate-500">{{ mentor.headline || 'Ментор MentorHub' }}</p>
            </div>

            <span
              v-if="mentor.verified"
              class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
            >
              Проверен
            </span>
          </div>

          <p class="mt-4 text-sm text-slate-600">
            {{ mentor.specialization || 'Специализация пока не указана' }}
          </p>

          <div class="mt-6 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
            <span v-if="mentor.lessonFormatOnline" class="rounded-full bg-slate-100 px-3 py-1">Онлайн</span>
            <span v-if="mentor.lessonFormatOffline" class="rounded-full bg-slate-100 px-3 py-1">Офлайн</span>
            <span v-if="mentor.lessonFormatHybrid" class="rounded-full bg-slate-100 px-3 py-1">Гибрид</span>
          </div>

          <div class="mt-6 flex items-center justify-between text-sm">
            <span class="text-slate-600">{{ mentor.city || 'Город не указан' }}</span>
            <span class="font-semibold text-slate-900">
              {{ mentor.pricePerHour ? `${mentor.pricePerHour} сом/час` : 'Цена не указана' }}
            </span>
          </div>

          <div class="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>Рейтинг: {{ mentor.averageRating ?? 0 }}</span>
            <span>Уроков: {{ mentor.lessonsCompleted ?? 0 }}</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { http } from '../../shared/api/http'

interface MentorDirectoryItem {
  id: number
  firstName: string | null
  lastName: string | null
  headline: string | null
  specialization: string | null
  city: string | null
  pricePerHour: number | null
  averageRating: number | null
  lessonsCompleted: number | null
  verified: boolean
  lessonFormatOnline: boolean
  lessonFormatOffline: boolean
  lessonFormatHybrid: boolean
}

const mentors = ref<MentorDirectoryItem[]>([])
const loading = ref(false)

const query = ref('')
const city = ref('')
const sortBy = ref('')
const online = ref(false)
const offline = ref(false)
const hybrid = ref(false)

const loadMentors = async () => {
  loading.value = true

  try {
    const { data } = await http.get('/api/public/mentors', {
      params: {
        query: query.value || undefined,
        city: city.value || undefined,
        sortBy: sortBy.value || undefined,
        online: online.value || undefined,
        offline: offline.value || undefined,
        hybrid: hybrid.value || undefined,
      },
    })

    mentors.value = data
  } finally {
    loading.value = false
  }
}

onMounted(loadMentors)

watch([query, city, sortBy, online, offline, hybrid], () => {
  loadMentors()
})
</script>