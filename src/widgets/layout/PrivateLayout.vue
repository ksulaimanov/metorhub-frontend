<template>
  <div class="flex min-h-screen flex-col bg-slate-50 text-slate-900">
    <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <nav class="flex gap-4">
          <router-link
              v-for="item in mobileNavItems"
              :key="item.to"
              :to="item.to"
              class="text-sm font-medium hover:text-blue-600"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <div class="flex items-center gap-3">
          <LanguageSwitcher />
          <button
              @click="logout"
              class="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
          >
            {{ t('privateNav.logout') }}
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto flex-1 w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppFooter from '../../shared/ui/AppFooter.vue'
import LanguageSwitcher from '../../shared/ui/LanguageSwitcher.vue'

const { t } = useI18n()

interface NavItem {
  label: string
  to: string
}

const getRoles = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('roles') || '[]')
  } catch {
    return []
  }
}

const roles = getRoles()
const isStudent = roles.includes('ROLE_STUDENT')
const isMentor = roles.includes('ROLE_MENTOR')
const isAdmin = roles.includes('ROLE_ADMIN')

const desktopNavItems = computed<NavItem[]>(() => {
  const items: NavItem[] = []

  if (isStudent) {
    items.push(
        { label: t('privateNav.studentProfile'), to: '/student/profile' },
        { label: t('privateNav.studentBookings'), to: '/student/bookings' },
    )
  }

  if (isMentor) {
    items.push(
        { label: t('privateNav.mentorProfile'), to: '/mentor/profile' },
        { label: t('privateNav.mentorSlots'), to: '/mentor/slots' },
        { label: t('privateNav.mentorBookings'), to: '/mentor/bookings' },
    )
  }

  if (isAdmin) {
    items.push(
        { label: t('privateNav.adminDashboard'), to: '/admin/dashboard' },
        { label: t('privateNav.adminApplications'), to: '/admin/mentor-applications' },
    )
  }

  return items
})

const mobileNavItems = desktopNavItems

const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('roles')
  localStorage.removeItem('session')
  window.location.href = '/login'
}
</script>