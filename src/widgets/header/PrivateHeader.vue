<template>
  <header class="sticky top-0 z-30 border-b border-border-brand bg-surface/90 backdrop-blur">
    <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2 text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
          <AppLogo class="h-8 w-8" />
          JaiMentorship
        </RouterLink>

        <button
            class="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white md:hidden"
            @click="logout"
        >
          {{ t('auth.logout') }}
        </button>
      </div>

      <nav class="flex flex-wrap items-center gap-3 text-sm font-medium text-text-secondary">
        <template v-if="authStore.isStudent">
          <RouterLink
              to="/student/profile"
              class="rounded-xl px-3 py-2 transition hover:bg-brand-soft hover:text-text-primary"
          >
            {{ t('nav.studentProfile') }}
          </RouterLink>
          <RouterLink
              to="/student/bookings"
              class="rounded-xl px-3 py-2 transition hover:bg-brand-soft hover:text-text-primary"
          >
            {{ t('nav.studentBookings') }}
          </RouterLink>
        </template>

        <template v-if="authStore.isMentor">
          <RouterLink
              to="/mentor/profile"
              class="rounded-xl px-3 py-2 transition hover:bg-brand-soft hover:text-text-primary"
          >
            {{ t('nav.mentorProfile') }}
          </RouterLink>
          <RouterLink
              to="/mentor/slots"
              class="rounded-xl px-3 py-2 transition hover:bg-brand-soft hover:text-text-primary"
          >
            {{ t('nav.mentorSlots') }}
          </RouterLink>
          <RouterLink
              to="/mentor/bookings"
              class="rounded-xl px-3 py-2 transition hover:bg-brand-soft hover:text-text-primary"
          >
            {{ t('nav.mentorBookings') }}
          </RouterLink>
        </template>
      </nav>

      <div class="flex items-center gap-3">
        <NotificationBell v-if="authStore.isStudent" />

        <button
            class="hidden rounded-xl bg-brand px-4 py-2 text-white md:inline-flex"
            @click="logout"
        >
          {{ t('auth.logout') }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/entities/auth/model/authStore'
import AppLogo from '@/shared/ui/AppLogo.vue'
import NotificationBell from '@/widgets/header/NotificationBell.vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const logout = async () => {
  authStore.logout()
  await router.push('/login')
}
</script>
