<template>
  <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center justify-between">
        <RouterLink to="/" class="text-2xl font-bold tracking-tight text-slate-900">
          JaiMentorship
        </RouterLink>

        <button
            class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white md:hidden"
            @click="logout"
        >
          {{ t('auth.logout') }}
        </button>
      </div>

      <nav class="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
        <template v-if="authStore.isStudent">
          <RouterLink
              to="/student/profile"
              class="rounded-xl px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {{ t('nav.studentProfile') }}
          </RouterLink>
          <RouterLink
              to="/student/bookings"
              class="rounded-xl px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {{ t('nav.studentBookings') }}
          </RouterLink>
        </template>

        <template v-if="authStore.isMentor">
          <RouterLink
              to="/mentor/profile"
              class="rounded-xl px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {{ t('nav.mentorProfile') }}
          </RouterLink>
          <RouterLink
              to="/mentor/slots"
              class="rounded-xl px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {{ t('nav.mentorSlots') }}
          </RouterLink>
          <RouterLink
              to="/mentor/bookings"
              class="rounded-xl px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {{ t('nav.mentorBookings') }}
          </RouterLink>
        </template>

        <button
            class="hidden rounded-xl bg-slate-900 px-4 py-2 text-white md:inline-flex"
            @click="logout"
        >
          {{ t('auth.logout') }}
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/authStore'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const logout = async () => {
  authStore.logout()
  await router.push('/login')
}
</script>