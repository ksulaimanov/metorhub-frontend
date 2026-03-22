<template>
  <PublicLayout>
    <div class="mx-auto max-w-7xl px-6 py-12">
      <AppSectionTitle
          title="Каталог менторов"
          description="Выберите наставника по цели, формату и стоимости занятий."
      />

      <div class="mb-8 mt-8 grid gap-4 md:grid-cols-4">
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

      <AppLoadingState v-if="loading" text="Загрузка менторов..." />

      <AppEmptyState
          v-else-if="mentors.length === 0"
          title="Менторы не найдены"
          description="Попробуйте изменить фильтры или параметры поиска."
      />

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

            <AppBadge v-if="mentor.verified" variant="success">
              Проверен
            </AppBadge>
          </div>

          <p class="mt-4 text-sm text-slate-600">
            {{ mentor.specialization || 'Специализация пока не указана' }}
          </p>

          <div class="mt-6 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
            <AppBadge v-if="mentor.lessonFormatOnline">Онлайн</AppBadge>
            <AppBadge v-if="mentor.lessonFormatOffline">Офлайн</AppBadge>
            <AppBadge v-if="mentor.lessonFormatHybrid">Гибрид</AppBadge>
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

          <div class="mt-6 flex items-center justify-between">
            <span class="text-sm font-medium text-slate-500">Подробнее и запись</span>
            <span class="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Открыть
            </span>
          </div>
        </RouterLink>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { http } from '../../shared/api/http'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import AppSectionTitle from '../../shared/ui/AppSectionTitle.vue'
import AppLoadingState from '../../shared/ui/AppLoadingState.vue'
import AppEmptyState from '../../shared/ui/AppEmptyState.vue'
import AppBadge from '../../shared/ui/AppBadge.vue'

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