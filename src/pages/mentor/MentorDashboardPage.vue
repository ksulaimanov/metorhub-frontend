<template>
  <PrivateLayout>
    <div class="relative space-y-8 rounded-2xl p-6 bg-surface shadow-md border border-white/10 overflow-hidden">
      <KyrgyzOrnamentPattern :opacity="0.08" :scale="1.2" />
      <KyrgyzCornerOrnament position="top-right" :opacity="0.1" />

      <div class="relative">
        <h1 class="text-3xl font-bold text-white">{{ t('mentorDashboard.title') }}</h1>
        <p class="mt-2 text-text-secondary">{{ t('mentorDashboard.subtitle') }}</p>
      </div>

      <div class="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AppCard>
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-brand shadow-sm border border-white/5">
              <Calendar class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <p class="text-sm text-text-secondary">{{ t('mentorDashboard.totalBookings') }}</p>
              <p class="mt-1 text-3xl font-bold text-white">{{ dashboardData?.totalBookings ?? 0 }}</p>
            </div>
          </div>
        </AppCard>

        <AppCard>
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success-soft text-success">
              <Clock class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <p class="text-sm text-text-secondary">{{ t('mentorDashboard.upcoming') }}</p>
              <p class="mt-1 text-3xl font-bold text-success">
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
              <p class="text-sm text-text-secondary">{{ t('mentorDashboard.completed') }}</p>
              <p class="mt-1 text-3xl font-bold text-text-primary">{{ dashboardData?.completedBookings ?? 0 }}</p>
            </div>
          </div>
        </AppCard>

        <AppCard>
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning-soft text-warning">
              <Star class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <p class="text-sm text-text-secondary">{{ t('mentorDashboard.rating') }}</p>
              <div class="mt-1 flex items-baseline gap-2">
                <p class="text-3xl font-bold text-warning">
                  {{ dashboardData?.averageRating ? dashboardData.averageRating.toFixed(1) : '—' }}
                </p>
                <span class="text-sm text-text-secondary">/ 5.0</span>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      <div class="relative">
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
      </div>

      <div class="relative grid gap-4 sm:grid-cols-2">
        <button
            type="button"
            class="flex items-start gap-4 rounded-2xl border border-border-brand p-6 text-left transition hover:border-brand/40 hover:bg-brand-soft/30"
            @click="navigateToSlots"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <CalendarDays class="h-5 w-5" />
          </div>
          <div>
            <p class="font-semibold text-text-primary">{{ t('mentorDashboard.manageSlots') }}</p>
            <p class="mt-1 text-sm text-text-secondary">{{ t('mentorDashboard.manageSlotsDesc') }}</p>
          </div>
        </button>

        <button
            type="button"
            class="flex items-start gap-4 rounded-2xl border border-border-brand p-6 text-left transition hover:border-brand/40 hover:bg-brand-soft/30"
            @click="navigateToProfile"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <User class="h-5 w-5" />
          </div>
          <div>
            <p class="font-semibold text-text-primary">{{ t('mentorDashboard.mentorProfile') }}</p>
            <p class="mt-1 text-sm text-text-secondary">{{ t('mentorDashboard.mentorProfileDesc') }}</p>
          </div>
        </button>
      </div>
    </div>
  </PrivateLayout>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Calendar, Clock, CheckCircle2, Star, CalendarDays, User } from 'lucide-vue-next'
import { getMentorDashboard } from '@/shared/api/dashboardApi'
import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage'
import type { MentorDashboard } from '@/shared/types/dashboard'
import PrivateLayout from '@/widgets/layout/PrivateLayout.vue'
import AppCard from '@/shared/ui/AppCard.vue'
import UpcomingEventsCard from '@/shared/ui/UpcomingEventsCard.vue'
import KyrgyzCornerOrnament from '@/shared/ui/KyrgyzCornerOrnament.vue'
import KyrgyzOrnamentPattern from '@/shared/ui/KyrgyzOrnamentPattern.vue'

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
