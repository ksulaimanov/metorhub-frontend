<template>
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <RouterLink to="/" class="text-2xl font-bold text-slate-900">MentorHub</RouterLink>

      <nav class="flex items-center gap-4 text-sm font-medium text-slate-600">
        <template v-if="authStore.isStudent">
          <RouterLink to="/student/profile" class="hover:text-slate-900">Мой профиль</RouterLink>
          <RouterLink to="/student/bookings" class="hover:text-slate-900">Мои занятия</RouterLink>
        </template>

        <template v-if="authStore.isMentor">
          <RouterLink to="/mentor/profile" class="hover:text-slate-900">Профиль ментора</RouterLink>
          <RouterLink to="/mentor/slots" class="hover:text-slate-900">Слоты</RouterLink>
          <RouterLink to="/mentor/bookings" class="hover:text-slate-900">Записи учеников</RouterLink>
        </template>

        <button
            class="rounded-xl bg-slate-900 px-4 py-2 text-white"
            @click="logout"
        >
          Выйти
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const logout = async () => {
  authStore.logout()
  await router.push('/login')
}
</script>