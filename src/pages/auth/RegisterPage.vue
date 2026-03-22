<template>
  <PublicLayout>
    <section class="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-10 sm:px-6">
      <div class="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
        <div class="hidden lg:block">
          <p class="inline-flex rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            Создайте аккаунт в MentorHub
          </p>

          <h1 class="mt-5 max-w-xl text-5xl font-bold leading-tight text-slate-900">
            Начните путь как ученик или ментор
          </h1>

          <p class="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Выберите роль, зарегистрируйтесь и получите доступ к личному кабинету, занятиям и бронированиям.
          </p>

          <div class="mt-8 grid max-w-xl gap-4">
            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 class="text-lg font-semibold text-slate-900">Ученик</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                Ищите менторов, сравнивайте профили, записывайтесь на занятия и развивайте нужные навыки.
              </p>
            </div>

            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 class="text-lg font-semibold text-slate-900">Ментор</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                Создайте профессиональный профиль, управляйте слотами и работайте с учениками на одной платформе.
              </p>
            </div>
          </div>
        </div>

        <div class="w-full max-w-xl justify-self-center rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h1 class="text-3xl font-bold text-slate-900">Регистрация</h1>
          <p class="mt-2 text-sm text-slate-600">
            Выберите роль и создайте аккаунт в MentorHub.
          </p>

          <form class="mt-8 space-y-5" @submit.prevent="handleRegister">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Роль</label>
              <div class="grid gap-3 sm:grid-cols-2">
                <label
                    class="flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition"
                    :class="role === 'student' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'"
                >
                  <input v-model="role" type="radio" value="student" class="mt-1" />
                  <div>
                    <p class="font-medium text-slate-900">Ученик</p>
                    <p class="mt-1 text-sm text-slate-600">
                      Для поиска менторов и записи на занятия
                    </p>
                  </div>
                </label>

                <label
                    class="flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition"
                    :class="role === 'mentor' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'"
                >
                  <input v-model="role" type="radio" value="mentor" class="mt-1" />
                  <div>
                    <p class="font-medium text-slate-900">Ментор</p>
                    <p class="mt-1 text-sm text-slate-600">
                      Для ведения профиля и работы с учениками
                    </p>
                  </div>
                </label>
              </div>
            </div>

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
                    autocomplete="new-password"
                    class="w-full rounded-2xl border px-4 py-3 pr-24 outline-none transition"
                    :class="fieldClass(showValidation && !!passwordError)"
                    placeholder="Минимум 8 символов"
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

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Подтверждение пароля</label>
              <input
                  v-model="confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  class="w-full rounded-2xl border px-4 py-3 outline-none transition"
                  :class="fieldClass(showValidation && !!confirmPasswordError)"
                  placeholder="Повторите пароль"
              />
              <p v-if="showValidation && confirmPasswordError" class="mt-2 text-sm text-red-600">
                {{ confirmPasswordError }}
              </p>
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
                class="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="loading"
            >
              {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
            </button>

            <div class="text-center text-sm text-slate-600">
              Уже есть аккаунт?
              <RouterLink to="/login" class="font-semibold text-slate-900 transition hover:opacity-70">
                Войти
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

const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return 'Подтвердите пароль'
  return confirmPassword.value === password.value ? '' : 'Подтверждение пароля не совпадает'
})

const fieldClass = (hasError: boolean) =>
    hasError
        ? 'border-red-300 focus:border-red-500'
        : 'border-slate-300 focus:border-slate-900'

const handleRegister = async () => {
  showValidation.value = true
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

    successMessage.value = 'Регистрация прошла успешно. Перенаправляем на страницу входа...'

    setTimeout(async () => {
      await router.push('/login')
    }, 1000)
  } catch (error: any) {
    errorMessage.value =
        error?.response?.data?.error || 'Не удалось выполнить регистрацию. Попробуйте снова.'
  } finally {
    loading.value = false
  }
}
</script>