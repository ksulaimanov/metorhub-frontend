<template>
  <PublicLayout>
    <div class="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
      <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <h1 class="text-3xl font-bold text-slate-900">Вход</h1>
        <p class="mt-2 text-sm text-slate-600">Войдите, чтобы управлять профилем и занятиями.</p>

        <form class="mt-8 space-y-4" @submit.prevent="handleLogin">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
                v-model="email"
                type="email"
                class="w-full rounded-2xl border px-4 py-3 outline-none transition"
                :class="fieldClass(emailError)"
                placeholder="you@example.com"
            />
            <p v-if="emailError" class="mt-2 text-sm text-red-600">{{ emailError }}</p>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Пароль</label>
            <input
                v-model="password"
                type="password"
                class="w-full rounded-2xl border px-4 py-3 outline-none transition"
                :class="fieldClass(passwordError)"
                placeholder="Введите пароль"
            />
            <p v-if="passwordError" class="mt-2 text-sm text-red-600">{{ passwordError }}</p>
          </div>

          <AppErrorState
              v-if="errorMessage"
              title="Не удалось войти"
              :description="errorMessage"
          />

          <button
              type="submit"
              class="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              :disabled="loading"
          >
            {{ loading ? 'Вход...' : 'Войти' }}
          </button>
        </form>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '../../shared/api/http'
import { useAuthStore } from '../../stores/authStore'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const emailError = computed(() => {
  if (!email.value) return 'Введите email'
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  return valid ? '' : 'Введите корректный email'
})

const passwordError = computed(() => {
  if (!password.value) return 'Введите пароль'
  return password.value.length >= 8 ? '' : 'Пароль должен содержать минимум 8 символов'
})

const fieldClass = (hasError: string) =>
    hasError ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-slate-900'

const handleLogin = async () => {
  errorMessage.value = ''

  if (emailError.value || passwordError.value) {
    return
  }

  loading.value = true

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
    errorMessage.value = error?.response?.data?.error || 'Проверьте email и пароль'
  } finally {
    loading.value = false
  }
}
</script>