<template>
  <PrivateLayout>
    <div class="space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-text-primary">{{ t('adminDashboard.title') }}</h1>
        <p class="mt-2 text-text-secondary">{{ t('adminDashboard.subtitle') }}</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AppCard>
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <CalendarIcon class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <p class="text-sm text-text-secondary">{{ t('adminDashboard.totalBookings') }}</p>
              <p class="mt-1 text-3xl font-bold text-text-primary">{{ dashboardData?.stats.totalBookings ?? 0 }}</p>
              <p class="mt-1 text-xs text-text-muted">
                {{ dashboardData?.stats.completedBookings ?? 0 }} {{ t('adminDashboard.completed') }}
              </p>
            </div>
          </div>
        </AppCard>

        <AppCard>
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <UserCheck class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <p class="text-sm text-text-secondary">{{ t('adminDashboard.mentors') }}</p>
              <p class="mt-1 text-3xl font-bold text-brand">{{ dashboardData?.stats.totalMentors ?? 0 }}</p>
              <p class="mt-1 text-xs text-text-muted">{{ t('adminDashboard.activeMentors') }}</p>
            </div>
          </div>
        </AppCard>

        <AppCard>
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <GraduationCap class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <p class="text-sm text-text-secondary">{{ t('adminDashboard.students') }}</p>
              <p class="mt-1 text-3xl font-bold text-emerald-600">{{ dashboardData?.stats.totalStudents ?? 0 }}</p>
              <p class="mt-1 text-xs text-text-muted">{{ t('adminDashboard.activeStudents') }}</p>
            </div>
          </div>
        </AppCard>

        <AppCard>
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Star class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <p class="text-sm text-text-secondary">{{ t('adminDashboard.avgRating') }}</p>
              <div class="mt-1 flex items-baseline gap-2">
                <p class="text-3xl font-bold text-amber-500">{{ dashboardData?.stats.averageRating?.toFixed(1) ?? '—' }}</p>
                <span class="text-sm text-text-secondary">/ 5.0</span>
              </div>
            </div>
          </div>
        </AppCard>

        <AppCard>
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-accent">
              <Clock class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <p class="text-sm text-text-secondary">{{ t('adminDashboard.upcoming') }}</p>
              <p class="mt-1 text-3xl font-bold text-accent">
                {{ dashboardData?.stats.upcomingBookings ?? 0 }}
              </p>
              <p class="mt-1 text-xs text-text-muted">{{ t('adminDashboard.thisWeek') }}</p>
            </div>
          </div>
        </AppCard>

        <AppCard>
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp class="h-5 w-5" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm text-text-secondary">{{ t('adminDashboard.completion') }}</p>
              <div class="mt-1">
                <div class="flex items-baseline gap-2">
                  <p class="text-2xl font-bold text-text-primary">
                    {{ calculateCompletion }}%
                  </p>
                </div>
                <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-brand-soft">
                  <div
                      class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                      :style="{ width: `${calculateCompletion}%` }"
                  ></div>
                </div>
              </div>
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
            class="flex items-start gap-4 rounded-2xl border border-border-brand p-6 text-left transition hover:border-brand/40 hover:bg-brand-soft/30"
            @click="handleAdminAction('users')"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <Users class="h-5 w-5" />
          </div>
          <div>
            <span class="block font-semibold text-text-primary">{{ t('adminDashboard.manageUsers') }}</span>
            <span class="mt-1 block text-xs text-text-secondary">{{ t('adminDashboard.manageUsersDesc') }}</span>
          </div>
        </button>

        <button
            class="flex items-start gap-4 rounded-2xl border border-border-brand p-6 text-left transition hover:border-brand/40 hover:bg-brand-soft/30"
            @click="handleAdminAction('bookings')"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <CalendarIcon class="h-5 w-5" />
          </div>
          <div>
            <span class="block font-semibold text-text-primary">{{ t('adminDashboard.manageBookings') }}</span>
            <span class="mt-1 block text-xs text-text-secondary">{{ t('adminDashboard.manageBookingsDesc') }}</span>
          </div>
        </button>

        <button
            class="flex items-start gap-4 rounded-2xl border border-border-brand p-6 text-left transition hover:border-brand/40 hover:bg-brand-soft/30"
            @click="handleAdminAction('reports')"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <BarChart3 class="h-5 w-5" />
          </div>
          <div>
            <span class="block font-semibold text-text-primary">{{ t('adminDashboard.reports') }}</span>
            <span class="mt-1 block text-xs text-text-secondary">{{ t('adminDashboard.reportsDesc') }}</span>
          </div>
        </button>
      </div>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Calendar as CalendarIcon, Clock, UserCheck, GraduationCap, Star, TrendingUp, Users, BarChart3 } from 'lucide-vue-next'
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

