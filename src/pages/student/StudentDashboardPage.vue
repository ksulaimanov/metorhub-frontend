<template>
  <PrivateLayout>
    <div class="relative space-y-8 rounded-2xl p-6 bg-white/5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/10 overflow-hidden">
      <KyrgyzOrnamentPattern :opacity="0.08" :scale="1.2" />
      <KyrgyzCornerOrnament position="top-right" :opacity="0.1" />

      <!-- Header -->
      <div class="relative">
        <h1 class="text-3xl font-bold text-white">{{ t('studentDashboard.greeting', { name: displayName }) }}</h1>
        <p class="mt-2 text-slate-400">{{ t('studentDashboard.subtitle') }}</p>
      </div>

      <!-- Stats Cards -->
      <div class="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AppCard>
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-soft shadow-[0_0_15px_rgba(108,92,231,0.2)] border border-white/5">
              <Calendar class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <p class="text-sm text-slate-400">{{ t('studentDashboard.totalBookings') }}</p>
              <p class="mt-1 text-3xl font-bold text-white">{{ dashboardData?.totalBookings ?? 0 }}</p>
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

      <!-- Level & Goal Progress (Glassmorphism) -->
      <div class="relative overflow-hidden rounded-2xl bg-surface/60 backdrop-blur-xl p-6 ring-1 ring-border-brand/40 shadow-lg shadow-brand/5">
        <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
        <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-accent text-white shadow-sm">
                <Target class="h-4 w-4" />
              </div>
              <h3 class="text-lg font-bold text-text-primary">Current Goal: Setup First Next.js Project</h3>
            </div>
            <p class="text-sm text-text-secondary mb-4">You have completed 3 out of 5 steps to reach your current learning goal.</p>

            <div class="flex items-center justify-between text-sm font-semibold mb-1.5">
              <span class="text-brand">Level 2: Explorer</span>
              <span class="text-text-muted">60% to Next Level</span>
            </div>
            <div class="h-3 w-full bg-surface-secondary rounded-full overflow-hidden shadow-inner flex">
              <div
                class="h-full bg-gradient-to-r from-brand to-accent rounded-full transition-all duration-1000 ease-out"
                style="width: 60%"
              />
            </div>
          </div>

          <div class="w-full md:w-auto shrink-0 flex items-center justify-center p-4 rounded-xl bg-surface/40 ring-1 ring-border-subtle">
            <div class="text-center">
              <p class="text-xs uppercase tracking-wider font-bold text-text-muted mb-1">Achievements</p>
              <div class="flex gap-2">
                <div class="h-10 w-10 flex items-center justify-center rounded-full bg-amber-50 ring-1 ring-amber-200" title="First Booking">🌟</div>
                <div class="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200" title="Completed 3 Lessons">🚀</div>
                <div class="h-10 w-10 flex items-center justify-center rounded-full bg-surface-secondary ring-1 ring-border-subtle opacity-50" title="Locked">🔒</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Events -->
      <div class="relative">
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
      </div>

      <!-- Empty State / CTA for No Completed Lessons -->
      <div v-if="(dashboardData?.completedBookings ?? 0) === 0" class="relative overflow-hidden rounded-3xl bg-surface/60 backdrop-blur-md p-10 text-center ring-1 ring-border-brand/40 shadow-sm">
        <div class="absolute inset-0 bg-gradient-to-br from-brand/5 to-accent/5 pointer-events-none" />
        <div class="relative z-10 max-w-md mx-auto flex flex-col items-center">
          <div class="h-24 w-24 mb-6 rounded-full bg-gradient-to-tr from-brand-soft to-surface shadow-inner ring-1 ring-border-subtle flex items-center justify-center">
            <span class="text-4xl">🎓</span>
          </div>
          <h3 class="text-2xl font-extrabold text-text-primary mb-2">У вас еще нет завершенных уроков</h3>
          <p class="text-text-secondary leading-relaxed mb-8">
            Начните свой путь к новым знаниям прямо сейчас. Выберите ментора, забронируйте первый звонок и достигайте своих целей быстрее!
          </p>
          <button
              class="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-2 pb-2.5 font-bold text-white shadow-md shadow-brand/20 transition hover:-translate-y-0.5 hover:bg-brand-hover active:scale-[0.98]"
              @click="navigateToMentors"
          >
            Записаться к первому ментору
          </button>
        </div>
      </div>

      <!-- Application Status Widget -->
      <div class="relative space-y-4">
        <InfoPanel v-if="appStatus && appStatus.status === 'PENDING'" variant="muted">
          <h3 class="text-lg font-semibold text-text-primary">{{ t('mentorApplication.widgetTitle') }}</h3>
          <p class="mt-2 text-text-secondary">
            {{ t('mentorApplication.widgetUnderReview') }}
          </p>
        </InfoPanel>
        <InfoPanel v-else-if="appStatus && appStatus.status === 'APPROVED'" variant="success">
          <h3 class="text-lg font-semibold">{{ t('mentorApplication.widgetApproved') }}</h3>
          <p class="mt-2 text-sm">
            {{ t('mentorApplication.widgetApprovedDesc') }}
          </p>
          <button
              class="mt-4 inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
              @click="switchToMentor"
          >
            {{ t('mentorApplication.widgetSwitch') }}
          </button>
        </InfoPanel>
        <InfoPanel v-else-if="appStatus && appStatus.status === 'REJECTED'" variant="error">
          <h3 class="text-lg font-semibold text-danger">{{ t('mentorApplication.widgetRejected') }}</h3>
          <p class="mt-2 text-sm text-danger/80">
            {{ appStatus.reviewComment || t('mentorApplication.widgetRejectedDesc') }}
          </p>
          <button
              class="mt-4 inline-flex rounded-xl bg-danger px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-danger/80"
              @click="reapply"
          >
            {{ t('mentorApplication.widgetReapply') }}
          </button>
        </InfoPanel>
      </div>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Calendar, Clock, CheckCircle2, Target } from 'lucide-vue-next'
import { useAuthStore } from '@/entities/auth/model/authStore'
import { getStudentDashboard } from '@/shared/api/dashboardApi'
import { getMyMentorApplicationStatus } from '@/shared/api/mentorApplicationApi'
import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage'
import type { StudentDashboard } from '@/shared/types/dashboard'
import type { MentorApplicationStatusResponse } from '@/shared/types/mentorApplication'
import PrivateLayout from '@/widgets/layout/PrivateLayout.vue'
import AppCard from '@/shared/ui/AppCard.vue'
import UpcomingEventsCard from '@/shared/ui/UpcomingEventsCard.vue'
import InfoPanel from '@/shared/ui/InfoPanel.vue'
import KyrgyzCornerOrnament from '@/shared/ui/KyrgyzCornerOrnament.vue'
import KyrgyzOrnamentPattern from '@/shared/ui/KyrgyzOrnamentPattern.vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const dashboardData = ref<StudentDashboard | null>(null)
const appStatus = ref<MentorApplicationStatusResponse | null>(null)
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

  try {
    appStatus.value = await getMyMentorApplicationStatus()
  } catch (err: any) {
    // Ignore 404, it means the user hasn't successfully submitted an application or it was deleted
    if (err?.response?.status !== 404) {
      console.error('Error fetching mentor application status:', err)
    }
  }
}

const switchToMentor = async () => {
  await authStore.fetchProfile()
  router.push('/mentor/dashboard')
}

const reapply = () => {
  router.push('/mentor/apply')
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
