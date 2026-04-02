<template>
  <PrivateLayout>
    <div class="space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-slate-900">{{ t('adminDashboard.title') }}</h1>
        <p class="mt-2 text-slate-600">{{ t('adminDashboard.subtitle') }}</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AppCard>
          <p class="text-sm text-slate-500">{{ t('adminDashboard.totalBookings') }}</p>
          <p class="mt-2 text-3xl font-bold text-slate-900">{{ dashboardData?.stats.totalBookings || 0 }}</p>
          <p class="mt-2 text-xs text-slate-500">
            {{ dashboardData?.stats.completedBookings || 0 }} {{ t('adminDashboard.completed') }}
          </p>
        </AppCard>

        <AppCard>
          <p class="text-sm text-slate-500">{{ t('adminDashboard.mentors') }}</p>
          <p class="mt-2 text-3xl font-bold text-blue-600">{{ dashboardData?.stats.totalMentors || 0 }}</p>
          <p class="mt-2 text-xs text-slate-500">{{ t('adminDashboard.activeMentors') }}</p>
        </AppCard>

        <AppCard>
          <p class="text-sm text-slate-500">{{ t('adminDashboard.students') }}</p>
          <p class="mt-2 text-3xl font-bold text-emerald-600">{{ dashboardData?.stats.totalStudents || 0 }}</p>
          <p class="mt-2 text-xs text-slate-500">{{ t('adminDashboard.activeStudents') }}</p>
        </AppCard>

        <AppCard>
          <p class="text-sm text-slate-500">{{ t('adminDashboard.avgRating') }}</p>
          <div class="mt-2 flex items-baseline gap-2">
            <p class="text-3xl font-bold text-yellow-500">{{ dashboardData?.stats.averageRating.toFixed(1) || '0.0' }}</p>
            <span class="text-sm text-slate-500">/ 5.0</span>
          </div>
        </AppCard>

        <AppCard>
          <p class="text-sm text-slate-500">{{ t('adminDashboard.upcoming') }}</p>
          <p class="mt-2 text-3xl font-bold text-indigo-600">
            {{ dashboardData?.stats.upcomingBookings || 0 }}
          </p>
          <p class="mt-2 text-xs text-slate-500">{{ t('adminDashboard.thisWeek') }}</p>
        </AppCard>

        <AppCard>
          <p class="text-sm text-slate-500">{{ t('adminDashboard.completion') }}</p>
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
          :title="t('adminDashboard.recentEvents')"
          :subtitle="t('adminDashboard.recentEventsSubtitle')"
          :events="dashboardData?.recentEvents || []"
          :loading="loading"
          :error="error"
          :empty-message="t('adminDashboard.noEvents')"
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
          <p class="mt-3 font-semibold text-slate-900">{{ t('adminDashboard.manageUsers') }}</p>
          <p class="mt-1 text-xs text-slate-600">{{ t('adminDashboard.manageUsersDesc') }}</p>
        </button>

        <button
            class="rounded-2xl border border-slate-200 p-6 text-left transition hover:border-slate-300 hover:bg-slate-50"
            @click="handleAdminAction('bookings')"
        >
          <p class="text-2xl">📅</p>
          <p class="mt-3 font-semibold text-slate-900">{{ t('adminDashboard.manageBookings') }}</p>
          <p class="mt-1 text-xs text-slate-600">{{ t('adminDashboard.manageBookingsDesc') }}</p>
        </button>

        <button
            class="rounded-2xl border border-slate-200 p-6 text-left transition hover:border-slate-300 hover:bg-slate-50"
            @click="handleAdminAction('reports')"
        >
          <p class="text-2xl">📊</p>
          <p class="mt-3 font-semibold text-slate-900">{{ t('adminDashboard.reports') }}</p>
          <p class="mt-1 text-xs text-slate-600">{{ t('adminDashboard.reportsDesc') }}</p>
        </button>
      </div>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getAdminDashboard } from '../../shared/api/dashboardApi'
import { getApiErrorMessage, useToastStore } from '../../shared/lib/getApiErrorMessage'
import type { AdminDashboard } from '../../shared/types/dashboard'
import PrivateLayout from '../../widgets/layout/PrivateLayout.vue'
import AppCard from '../../shared/ui/AppCard.vue'
import UpcomingEventsCard from '../../shared/ui/UpcomingEventsCard.vue'

const { t } = useI18n()
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
    error.value = getApiErrorMessage(err as any, t('adminDashboard.loadError'))
  } finally {
    loading.value = false
  }
}

const handleAdminAction = (action: string) => {
  toastStore.info(t('adminDashboard.featureSoon', { action }))
}

onMounted(loadDashboard)
</script>

