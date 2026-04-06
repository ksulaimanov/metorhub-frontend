<template>
  <PrivateLayout>
    <div class="space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-text-primary">{{ t('studentDashboard.greeting', { name: displayName }) }}</h1>
        <p class="mt-2 text-text-secondary">{{ t('studentDashboard.subtitle') }}</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AppCard>
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Calendar class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <p class="text-sm text-text-secondary">{{ t('studentDashboard.totalBookings') }}</p>
              <p class="mt-1 text-3xl font-bold text-text-primary">{{ dashboardData?.totalBookings ?? 0 }}</p>
            </div>
          </div>
        </AppCard>

        <AppCard>
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Clock class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <p class="text-sm text-text-secondary">{{ t('studentDashboard.upcoming') }}</p>
              <p class="mt-1 text-3xl font-bold text-emerald-600">
                {{ dashboardData?.upcomingEvents?.length ?? 0 }}
              </p>
            </div>
          </div>
        </AppCard>

        <AppCard>
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-accent">
              <CheckCircle2 class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <p class="text-sm text-text-secondary">{{ t('studentDashboard.completed') }}</p>
              <p class="mt-1 text-3xl font-bold text-text-primary">{{ dashboardData?.completedBookings ?? 0 }}</p>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Upcoming Events -->
      <UpcomingEventsCard
          :title="t('studentDashboard.upcomingTitle')"
          :subtitle="t('studentDashboard.upcomingSubtitle')"
          :events="dashboardData?.upcomingEvents || []"
          :loading="loading"
          :error="error"
          :empty-message="t('studentDashboard.noUpcoming')"
          :action-button-label="t('studentDashboard.goToLesson')"
          @retry="loadDashboard"
          @event-click="handleEventClick"
          @view-all="navigateToBookings"
      />

      <!-- CTA to Find Mentors -->
      <div v-if="(dashboardData?.upcomingEvents.length ?? 0) === 0" class="rounded-2xl bg-gradient-to-r from-brand-soft/60 to-brand-soft/20 p-6 ring-1 ring-border-brand">
        <h3 class="text-lg font-semibold text-text-primary">{{ t('studentDashboard.ctaTitle') }}</h3>
        <p class="mt-2 text-text-secondary">{{ t('studentDashboard.ctaDesc') }}</p>
        <button
            class="mt-4 inline-flex items-center justify-center rounded-2xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover active:scale-[0.98]"
            @click="navigateToMentors"
        >
          {{ t('studentDashboard.ctaButton') }}
        </button>
      </div>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Calendar, Clock, CheckCircle2 } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/authStore'
import { getStudentDashboard } from '../../shared/api/dashboardApi'
import { getApiErrorMessage } from '../../shared/lib/getApiErrorMessage'
import type { StudentDashboard } from '../../shared/types/dashboard'
import PrivateLayout from '../../widgets/layout/PrivateLayout.vue'
import AppCard from '../../shared/ui/AppCard.vue'
import UpcomingEventsCard from '../../shared/ui/UpcomingEventsCard.vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const dashboardData = ref<StudentDashboard | null>(null)
const loading = ref(false)
const error = ref('')

const displayName = authStore.displayName || t('roles.student')

const loadDashboard = async () => {
  loading.value = true
  error.value = ''

  try {
    dashboardData.value = await getStudentDashboard()
  } catch (err) {
    error.value = getApiErrorMessage(err as any, t('studentDashboard.loadError'))
  } finally {
    loading.value = false
  }
}

const handleEventClick = (event: any) => {
  router.push(`/student/bookings#booking-${event.id}`)
}

const navigateToBookings = () => {
  router.push('/student/bookings')
}

const navigateToMentors = () => {
  router.push('/mentors')
}

onMounted(loadDashboard)
</script>
