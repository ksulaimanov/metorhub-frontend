<template>
  <PublicLayout>
    <section class="mx-auto max-w-7xl px-6 py-12">
      <AppSectionTitle
          title="Каталог менторов"
          description="Выберите наставника по цели, формату занятий, рейтингу и стоимости."
      />

      <div class="mt-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
        <div class="grid gap-4 md:grid-cols-4">
          <div class="md:col-span-2">
            <label class="mb-2 block text-sm font-medium text-slate-700">
              Поиск
            </label>
            <input
                v-model="query"
                type="text"
                placeholder="Имя, фамилия, специализация"
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              Город
            </label>
            <input
                v-model="city"
                type="text"
                placeholder="Например: Бишкек"
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              Сортировка
            </label>
            <select
                v-model="sortBy"
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
            >
              <option value="">По умолчанию</option>
              <option value="ratingDesc">По рейтингу</option>
              <option value="priceAsc">Сначала дешевле</option>
              <option value="priceDesc">Сначала дороже</option>
              <option value="experienceDesc">По опыту</option>
            </select>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap gap-3">
          <label class="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm ring-1 ring-slate-200">
            <input v-model="online" type="checkbox" />
            Онлайн
          </label>

          <label class="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm ring-1 ring-slate-200">
            <input v-model="offline" type="checkbox" />
            Офлайн
          </label>

          <label class="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm ring-1 ring-slate-200">
            <input v-model="hybrid" type="checkbox" />
            Гибрид
          </label>

          <button
              type="button"
              class="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              @click="resetFilters"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-slate-600">
          Найдено менторов: <span class="font-semibold text-slate-900">{{ mentors.length }}</span>
        </p>

        <p class="text-sm text-slate-500">
          Выбирайте профиль и переходите к подробной информации и записи.
        </p>
      </div>

      <div class="mt-6">
        <AppLoadingState v-if="loading" text="Загружаем менторов..." />

        <AppErrorState
            v-else-if="error"
            title="Не удалось загрузить каталог"
            :description="error"
        />

        <AppEmptyState
            v-else-if="mentors.length === 0"
            title="Менторы не найдены"
            description="Попробуйте изменить фильтры, город или параметры поиска."
        />

        <div v-else class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <RouterLink
              v-for="mentor in mentors"
              :key="mentor.id"
              :to="`/mentors/${mentor.id}`"
              class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div class="flex items-start gap-4">
              <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-lg font-bold text-slate-600">
                <img
                    v-if="mentor.avatarUrl"
                    :src="mentor.avatarUrl"
                    :alt="mentorName(mentor)"
                    class="h-full w-full object-cover"
                />
                <span v-else>{{ mentorInitials(mentor) }}</span>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0">
                    <h3 class="truncate text-xl font-semibold text-slate-900">
                      {{ mentorName(mentor) }}
                    </h3>
                    <p class="mt-1 text-sm text-slate-500">
                      {{ mentor.headline || 'Ментор MentorHub' }}
                    </p>
                  </div>

                  <AppBadge v-if="mentor.verified" variant="success">
                    Проверен
                  </AppBadge>
                </div>
              </div>
            </div>

            <p class="mt-4 line-clamp-2 text-sm text-slate-600">
              {{ mentor.specialization || 'Специализация пока не указана' }}
            </p>

            <div class="mt-5 flex flex-wrap gap-2 text-xs font-medium">
              <AppBadge v-if="mentor.lessonFormatOnline">Онлайн</AppBadge>
              <AppBadge v-if="mentor.lessonFormatOffline">Офлайн</AppBadge>
              <AppBadge v-if="mentor.lessonFormatHybrid">Гибрид</AppBadge>
            </div>

            <div class="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
              <div>
                <p class="text-slate-500">Город</p>
                <p class="mt-1 font-medium text-slate-900">
                  {{ mentor.city || 'Не указан' }}
                </p>
              </div>

              <div>
                <p class="text-slate-500">Стоимость</p>
                <p class="mt-1 font-medium text-slate-900">
                  {{ mentor.pricePerHour ? `${mentor.pricePerHour} сом/час` : 'Не указана' }}
                </p>
              </div>

              <div>
                <p class="text-slate-500">Рейтинг</p>
                <p class="mt-1 font-medium text-slate-900">
                  {{ mentor.averageRating ?? 0 }}
                </p>
              </div>

              <div>
                <p class="text-slate-500">Проведено занятий</p>
                <p class="mt-1 font-medium text-slate-900">
                  {{ mentor.lessonsCompleted ?? 0 }}
                </p>
              </div>
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
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { http } from '../../shared/api/http'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import AppSectionTitle from '../../shared/ui/AppSectionTitle.vue'
import AppLoadingState from '../../shared/ui/AppLoadingState.vue'
import AppEmptyState from '../../shared/ui/AppEmptyState.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'
import AppBadge from '../../shared/ui/AppBadge.vue'

interface MentorDirectoryItem {
  id: number
  firstName: string | null
  lastName: string | null
  avatarKey?: string | null
  avatarUrl?: string | null
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
const error = ref('')

const query = ref('')
const debouncedQuery = ref('')
const city = ref('')
const sortBy = ref('')
const online = ref(false)
const offline = ref(false)
const hybrid = ref(false)

let searchTimer: number | undefined

const mentorName = (mentor: MentorDirectoryItem) => {
  const fullName = `${mentor.firstName || ''} ${mentor.lastName || ''}`.trim()
  return fullName || 'Без имени'
}

const mentorInitials = (mentor: MentorDirectoryItem) => {
  const first = mentor.firstName?.trim()?.[0] || ''
  const last = mentor.lastName?.trim()?.[0] || ''
  return (first + last).toUpperCase() || 'M'
}

const resetFilters = () => {
  query.value = ''
  debouncedQuery.value = ''
  city.value = ''
  sortBy.value = ''
  online.value = false
  offline.value = false
  hybrid.value = false
}

const loadMentors = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data } = await http.get('/api/public/mentors', {
      params: {
        query: debouncedQuery.value || undefined,
        city: city.value || undefined,
        sortBy: sortBy.value || undefined,
        online: online.value || undefined,
        offline: offline.value || undefined,
        hybrid: hybrid.value || undefined,
      },
    })

    mentors.value = data
  } catch (e) {
    console.error(e)
    error.value = 'Попробуйте обновить страницу чуть позже.'
  } finally {
    loading.value = false
  }
}

onMounted(loadMentors)

watch(query, (value) => {
  window.clearTimeout(searchTimer)
  searchTimer = window.setTimeout(() => {
    debouncedQuery.value = value
  }, 350)
})

watch([debouncedQuery, city, sortBy, online, offline, hybrid], () => {
  loadMentors()
})
</script>