<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div class="w-full max-w-xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h1 class="text-3xl font-bold text-slate-900">Регистрация</h1>
      <p class="mt-2 text-sm text-slate-600">Выберите роль и создайте аккаунт в MentorHub.</p>

      <form class="mt-8 space-y-4" @submit.prevent="handleRegister">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">Роль</label>
          <select
              v-model="role"
              class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
          >
            <option value="student">Ученик</option>
            <option value="mentor">Ментор</option>
          </select>
        </div>

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
              placeholder="Минимум 8 символов"
          />
        </div>

        <p v-if="errorMessage" class="text-sm font-medium text-red-600">
          {{ errorMessage }}
        </p>

        <button
            type="submit"
            class="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '../../shared/api/http'

const router = useRouter()

const role = ref<'student' | 'mentor'>('student')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''

  try {
    const endpoint =
        role.value === 'mentor'
            ? '/api/auth/register/mentor'
            : '/api/auth/register/student'

    await http.post(endpoint, {
      email: email.value,
      password: password.value,
    })

    await router.push('/login')
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.error || 'Не удалось выполнить регистрацию'
  }
}
</script>