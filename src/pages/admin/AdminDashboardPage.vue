<template>
  <PrivateLayout>
    <div class="space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Администраторская панель</h1>
        <p class="mt-2 text-slate-600">Общая статистика и управление платформой</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AppCard>
          <p class="text-sm text-slate-500">Всего записей</p>
          <p class="mt-2 text-3xl font-bold text-slate-900">{{ dashboardData?.stats.totalBookings || 0 }}</p>
          <p class="mt-2 text-xs text-slate-500">
            {{ dashboardData?.stats.completedBookings || 0 }} завершено
          </p>
        </AppCard>

        <AppCard>
          <p class="text-sm text-slate-500">Ментории</p>
          <p class="mt-2 text-3xl font-bold text-blue-600">{{ dashboardData?.stats.totalMentors || 0 }}</p>
          <p class="mt-2 text-xs text-slate-500">активных ментеров</p>
        </AppCard>

        <AppCard>
          <p class="text-sm text-slate-500">Студентов</p>
          <p class="mt-2 text-3xl font-bold text-emerald-600">{{ dashboardData?.stats.totalStudents || 0 }}</p>
          <p class="mt-2 text-xs text-slate-500">активных студентов</p>
        </AppCard>

        <AppCard>
          <p class="text-sm text-slate-500">Средний рейтинг</p>
          <div class="mt-2 flex items-baseline gap-2">
            <p class="text-3xl font-bold text-yellow-500">{{ dashboardData?.stats.averageRating.toFixed(1) || '0.0' }}</p>
            <span class="text-sm text-slate-500">/ 5.0</span>
          </div>
        </AppCard>

        <AppCard>
          <p class="text-sm text-slate-500">Предстоящих</p>
          <p class="mt-2 text-3xl font-bold text-indigo-600">
            {{ dashboardData?.stats.upcomingBookings || 0 }}
          </p>
          <p class="mt-2 text-xs text-slate-500">на этой неделе</p>
        </AppCard>

        <AppCard>
          <p class="text-sm text-slate-500">Выполнение</p>
          <div class="mt-2">
            <div class="flex items-baseline gap-2">
              <p class="text-2xl font-bold text-slate-900">
                {{ calculateCompletion }}%
              </p>
            </div>
            <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                  class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                  :style="{ width: `${calculateCompletion}%` }"
              ></div>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Recent Events -->
      <UpcomingEventsCard
          title="Недавние события"
          subtitle="Последние записи на платформе"
          :events="dashboardData?.recentEvents || []"
          :loading="loading"
          :error="error"
          empty-message="Нет событий"
          :action-button-visible="false"
          :show-view-all="false"
          @retry="loadDashboard"
      />

      <!-- Admin Actions -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button
            class="rounded-2xl border border-slate-200 p-6 text-left transition hover:border-slate-300 hover:bg-slate-50"
            @click="handleAdminAction('users')"
        >
          <p class="text-2xl">👥</p>
          <p class="mt-3 font-semibold text-slate-900">Управление пользователями</p>
          <p class="mt-1 text-xs text-slate-600">Посмотрите и управляйте всеми пользователями</p>
        </button>

        <button
            class="rounded-2xl border border-slate-200 p-6 text-left transition hover:border-slate-300 hover:bg-slate-50"
            @click="handleAdminAction('bookings')"
        >
          <p class="text-2xl">📅</p>
          <p class="mt-3 font-semibold text-slate-900">Управление записями</p>
          <p class="mt-1 text-xs text-slate-600">Смотрите все записи на платформе</p>
        </button>

        <button
            class="rounded-2xl border border-slate-200 p-6 text-left transition hover:border-slate-300 hover:bg-slate-50"
            @click="handleAdminAction('reports')"
        >
          <p class="text-2xl">📊</p>
          <p class="mt-3 font-semibold text-slate-900">Отчёты</p>
          <p class="mt-1 text-xs text-slate-600">Аналитика и статистика платформы</p>
        </button>
      </div>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getAdminDashboard } from '../../shared/api/dashboardApi'
import { getApiErrorMessage, useToastStore } from '../../shared/lib/getApiErrorMessage'
import type { AdminDashboard } from '../../shared/types/dashboard'
import PrivateLayout from '../../widgets/layout/PrivateLayout.vue'
import AppCard from '../../shared/ui/AppCard.vue'
import UpcomingEventsCard from '../../shared/ui/UpcomingEventsCard.vue'

const toastStore = useToastStore()

const dashboardData = ref<AdminDashboard | null>(null)
const loading = ref(false)
const error = ref('')

const calculateCompletion = computed(() => {
  const stats = dashboardData.value?.stats
  if (!stats || stats.totalBookings === 0) return 0
  return Math.round((stats.completedBookings / stats.totalBookings) * 100)
})

const loadDashboard = async () => {
  loading.value = true
  error.value = ''

  try {
    dashboardData.value = await getAdminDashboard()
  } catch (err) {
    error.value = getApiErrorMessage(err as any, 'Не удалось загрузить данные.')
  } finally {
    loading.value = false
  }
}

const handleAdminAction = (action: string) => {
  toastStore.info(`Функция "${action}" скоро будет доступна`)
}

onMounted(loadDashboard)
</script>

