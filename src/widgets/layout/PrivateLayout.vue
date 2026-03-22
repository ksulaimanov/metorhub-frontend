<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div class="flex items-center gap-8">
          <RouterLink to="/" class="text-2xl font-bold tracking-tight text-slate-900">
            MentorHub
          </RouterLink>

          <nav class="hidden items-center gap-2 lg:flex">
            <RouterLink
                v-for="item in desktopNavItems"
                :key="item.to"
                :to="item.to"
                class="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                active-class="bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
            >
              {{ item.label }}
            </RouterLink>
          </nav>
        </div>

        <div class="hidden items-center gap-3 md:flex">
          <RouterLink
              to="/mentors"
              class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Каталог менторов
          </RouterLink>

          <button
              type="button"
              class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              @click="logout"
          >
            Выйти
          </button>
        </div>
      </div>

      <div class="border-t border-slate-200 bg-white lg:hidden">
        <div class="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          <RouterLink
              v-for="item in mobileNavItems"
              :key="item.to"
              :to="item.to"
              class="whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              active-class="bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
          >
            {{ item.label }}
          </RouterLink>

          <RouterLink
              to="/mentors"
              class="whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Каталог
          </RouterLink>

          <button
              type="button"
              class="whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              @click="logout"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

const desktopNavItems = computed<NavItem[]>(() => {
  const items: NavItem[] = []

  if (isStudent) {
    items.push(
        { label: 'Профиль ученика', to: '/student/profile' },
        { label: 'Мои записи', to: '/student/bookings' },
    )
  }

  if (isMentor) {
    items.push(
        { label: 'Профиль ментора', to: '/mentor/profile' },
        { label: 'Слоты', to: '/mentor/slots' },
        { label: 'Записи учеников', to: '/mentor/bookings' },
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