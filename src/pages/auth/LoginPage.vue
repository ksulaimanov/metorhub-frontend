<template>
  <PublicLayout>
    <section class="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-10 sm:px-6">
      <div class="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
        <div class="hidden lg:block">
          <p class="inline-flex rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            Добро пожаловать в MentorHub
          </p>

          <h1 class="mt-5 max-w-xl text-5xl font-bold leading-tight text-slate-900">
            Войдите и продолжайте обучение или менторство
          </h1>

          <p class="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Управляйте профилем, бронированиями, слотами и занятиями в одном месте.
          </p>

          <div class="mt-8 grid max-w-xl gap-4">
            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 class="text-lg font-semibold text-slate-900">Для учеников</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                Следите за записями, обновляйте профиль и быстрее находите подходящих менторов.
              </p>
            </div>

            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 class="text-lg font-semibold text-slate-900">Для менторов</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                Управляйте профилем, слотами, заявками учеников и развивайте личный бренд.
              </p>
            </div>
          </div>
        </div>

        <div class="w-full max-w-md justify-self-center rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h1 class="text-3xl font-bold text-slate-900">Вход</h1>
          <p class="mt-2 text-sm text-slate-600">
            Войдите, чтобы управлять профилем, занятиями и записями.
          </p>

          <form class="mt-8 space-y-5" @submit.prevent="handleLogin">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                  v-model.trim="email"
                  type="email"
                  autocomplete="email"
                  class="w-full rounded-2xl border px-4 py-3 outline-none transition"
                  :class="fieldClass(showValidation && !!emailError)"
                  placeholder="you@example.com"
              />
              <p v-if="showValidation && emailError" class="mt-2 text-sm text-red-600">
                {{ emailError }}
              </p>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Пароль</label>
              <div class="relative">
                <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    class="w-full rounded-2xl border px-4 py-3 pr-24 outline-none transition"
                    :class="fieldClass(showValidation && !!passwordError)"
                    placeholder="Введите пароль"
                />
                <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    @click="showPassword = !showPassword"
                >
                  {{ showPassword ? 'Скрыть' : 'Показать' }}
                </button>
              </div>
              <p v-if="showValidation && passwordError" class="mt-2 text-sm text-red-600">
                {{ passwordError }}
              </p>
            </div>

            <AppErrorState
                v-if="errorMessage"
                title="Не удалось войти"
                :description="errorMessage"
            />

            <div class="text-right">
              <RouterLink
                  to="/forgot-password"
                  class="text-sm font-medium text-slate-700 transition hover:text-slate-900"
              >
                Забыли пароль?
              </RouterLink>
            </div>

            <div
                v-if="errorMessage && errorMessage.toLowerCase().includes('подтвержден')"
                class="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200"
            >
              <p class="font-medium text-slate-900">Нужно подтвердить email</p>
              <p class="mt-1">
                Завершите подтверждение, чтобы войти в аккаунт.
              </p>
              <RouterLink
                  class="mt-3 inline-flex rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:opacity-90"
                  :to="{ path: '/verify-email', query: { email } }"
              >
                Перейти к подтверждению
              </RouterLink>
            </div>

            <button
                type="submit"
                class="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="loading"
            >
              {{ loading ? 'Вход...' : 'Войти' }}
            </button>

            <div class="text-center text-sm text-slate-600">
              Ещё нет аккаунта?
              <RouterLink to="/register" class="font-semibold text-slate-900 transition hover:opacity-70">
                Зарегистрироваться
              </RouterLink>
            </div>
          </form>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '../../shared/api/http'
import { useAuthStore } from '../../stores/authStore'
import { useErrorHandler } from '../../shared/composables/useErrorHandler'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'

const router = useRouter()
const authStore = useAuthStore()
const { handleError } = useErrorHandler()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)
const showValidation = ref(false)
const showPassword = ref(false)

const emailError = computed(() => {
  if (!email.value) return 'Введите email'
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  return valid ? '' : 'Введите корректный email'
})

const passwordError = computed(() => {
  if (!password.value) return 'Введите пароль'
  return password.value.length >= 8 ? '' : 'Пароль должен содержать минимум 8 символов'
})

const fieldClass = (hasError: boolean) =>
    hasError
        ? 'border-red-300 focus:border-red-500'
        : 'border-slate-300 focus:border-slate-900'

const handleLogin = async () => {
  showValidation.value = true

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

    errorMessage.value = ''

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
    errorMessage.value = handleError(error, 'Проверьте email и пароль и попробуйте снова.')
  } finally {
    loading.value = false
  }
}
</script>