<template>
  <PrivateLayout>
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">{{ t('mentorDashboard.title') }}</h1>
        <p class="mt-2 text-slate-600">{{ t('mentorDashboard.subtitle') }}</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AppCard>
          <p class="text-sm text-slate-500">{{ t('mentorDashboard.totalBookings') }}</p>
          <p class="mt-2 text-3xl font-bold text-slate-900">{{ dashboardData?.totalBookings || 0 }}</p>
        </AppCard>

        <AppCard>
          <p class="text-sm text-slate-500">{{ t('mentorDashboard.upcoming') }}</p>
          <p class="mt-2 text-3xl font-bold text-emerald-600">
            {{ dashboardData?.upcomingEvents?.length || 0 }}
          </p>
        </AppCard>

        <AppCard>
          <p class="text-sm text-slate-500">{{ t('mentorDashboard.completed') }}</p>
          <p class="mt-2 text-3xl font-bold text-slate-900">{{ dashboardData?.completedBookings || 0 }}</p>
        </AppCard>

        <AppCard>
          <p class="text-sm text-slate-500">{{ t('mentorDashboard.rating') }}</p>
          <div class="mt-2 flex items-baseline gap-2">
            <p class="text-3xl font-bold text-yellow-500">
              {{ dashboardData?.averageRating ? dashboardData.averageRating.toFixed(1) : '0.0' }}
            </p>
            <span class="text-sm text-slate-500">/ 5.0</span>
          </div>
        </AppCard>
      </div>

      <UpcomingEventsCard
          :title="t('mentorDashboard.upcomingTitle')"
          :subtitle="t('mentorDashboard.upcomingSubtitle')"
          :events="dashboardData?.upcomingEvents || []"
          :loading="loading"
          :error="error"
          :empty-message="t('mentorDashboard.noUpcoming')"
          :action-button-label="t('mentorDashboard.goTo')"
          @retry="loadDashboard"
          @event-click="handleEventClick"
          @view-all="navigateToBookings"
      />

      <div class="grid gap-4 sm:grid-cols-2">
        <button
            type="button"
            class="rounded-2xl border border-slate-200 p-6 text-left transition hover:border-slate-300 hover:bg-slate-50"
            @click="navigateToSlots"
        >
          <p class="font-semibold text-slate-900">{{ t('mentorDashboard.manageSlots') }}</p>
          <p class="mt-1 text-sm text-slate-600">{{ t('mentorDashboard.manageSlotsDesc') }}</p>
        </button>

        <button
            type="button"
            class="rounded-2xl border border-slate-200 p-6 text-left transition hover:border-slate-300 hover:bg-slate-50"
            @click="navigateToProfile"
        >
          <p class="font-semibold text-slate-900">{{ t('mentorDashboard.mentorProfile') }}</p>
          <p class="mt-1 text-sm text-slate-600">{{ t('mentorDashboard.mentorProfileDesc') }}</p>
        </button>
      </div>
    </div>
  </PrivateLayout>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getMentorDashboard } from '../../shared/api/dashboardApi'
import { getApiErrorMessage } from '../../shared/lib/getApiErrorMessage'
import type { MentorDashboard } from '../../shared/types/dashboard'
import PrivateLayout from '../../widgets/layout/PrivateLayout.vue'
import AppCard from '../../shared/ui/AppCard.vue'
import UpcomingEventsCard from '../../shared/ui/UpcomingEventsCard.vue'

const { t } = useI18n()
const router = useRouter()

const dashboardData = ref<MentorDashboard | null>(null)
const loading = ref(false)
const error = ref('')

const loadDashboard = async () => {
  loading.value = true
  error.value = ''

  try {
    dashboardData.value = await getMentorDashboard()
  } catch (err) {
    error.value = getApiErrorMessage(err as any, t('mentorDashboard.loadError'))
  } finally {
    loading.value = false
  }
}

const handleEventClick = (event: any) => {
  router.push(`/mentor/bookings#booking-${event.id}`)
}

const navigateToBookings = () => {
  router.push('/mentor/bookings')
}

const navigateToSlots = () => {
  router.push('/mentor/slots')
}

const navigateToProfile = () => {
  router.push('/mentor/profile')
}

onMounted(loadDashboard)
</script>
