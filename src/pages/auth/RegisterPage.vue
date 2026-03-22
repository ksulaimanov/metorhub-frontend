<template>
  <PublicLayout>
    <div class="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
      <div class="w-full max-w-xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
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
                placeholder="Минимум 8 символов"
            />
            <p v-if="passwordError" class="mt-2 text-sm text-red-600">{{ passwordError }}</p>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Подтверждение пароля</label>
            <input
                v-model="confirmPassword"
                type="password"
                class="w-full rounded-2xl border px-4 py-3 outline-none transition"
                :class="fieldClass(confirmPasswordError)"
                placeholder="Повторите пароль"
            />
            <p v-if="confirmPasswordError" class="mt-2 text-sm text-red-600">{{ confirmPasswordError }}</p>
          </div>

          <AppErrorState
              v-if="errorMessage"
              title="Не удалось зарегистрироваться"
              :description="errorMessage"
          />

          <div
              v-if="successMessage"
              class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            {{ successMessage }}
          </div>

          <button
              type="submit"
              class="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              :disabled="loading"
          >
            {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
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
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'

const router = useRouter()

const role = ref<'student' | 'mentor'>('student')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
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

const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return 'Подтвердите пароль'
  return confirmPassword.value === password.value ? '' : 'Подтверждение пароля не совпадает'
})

const fieldClass = (hasError: string) =>
    hasError ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-slate-900'

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (emailError.value || passwordError.value || confirmPasswordError.value) {
    return
  }

  loading.value = true

  try {
    const endpoint =
        role.value === 'mentor'
            ? '/api/auth/register/mentor'
            : '/api/auth/register/student'

    await http.post(endpoint, {
      email: email.value,
      password: password.value,
    })

    successMessage.value = 'Регистрация прошла успешно. Теперь войдите в аккаунт.'
    setTimeout(async () => {
      await router.push('/login')
    }, 900)
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.error || 'Не удалось выполнить регистрацию'
  } finally {
    loading.value = false
  }
}
</script>