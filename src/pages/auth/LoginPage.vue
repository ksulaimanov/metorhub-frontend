<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h1 class="text-3xl font-bold text-slate-900">Вход</h1>
      <p class="mt-2 text-sm text-slate-600">Войдите, чтобы управлять профилем и занятиями.</p>

      <form class="mt-8 space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <input
              v-model="email"
              type="email"
              class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
              placeholder="you@example.com"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">Пароль</label>
          <input
              v-model="password"
              type="password"
              class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
              placeholder="Введите пароль"
          />
        </div>

        <p v-if="errorMessage" class="text-sm font-medium text-red-600">
          {{ errorMessage }}
        </p>

        <button
            type="submit"
            class="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Войти
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '../../shared/api/http'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''

  try {
    const { data } = await http.post('/api/auth/login', {
      email: email.value,
      password: password.value,
    })

    authStore.setAuth({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      email: data.email,
      roles: data.roles,
    })

    if (data.roles.includes('ROLE_MENTOR')) {
      await router.push('/mentor/profile')
      return
    }

    if (data.roles.includes('ROLE_STUDENT')) {
      await router.push('/student/profile')
      return
    }

    await router.push('/')
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.error || 'Не удалось войти в систему'
  }
}
</script>