<template>
  <PublicLayout>
    <section class="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-10 sm:px-6">
      <div class="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
        <div class="hidden lg:block">
          <p class="inline-flex rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            Новый пароль
          </p>

          <h1 class="mt-5 max-w-xl text-5xl font-bold leading-tight text-slate-900">
            Обновите пароль и войдите снова
          </h1>

          <p class="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Введите email, код из письма и новый пароль.
          </p>
        </div>

        <div class="w-full max-w-md justify-self-center rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h1 class="text-3xl font-bold text-slate-900">Сброс пароля</h1>
          <p class="mt-2 text-sm text-slate-600">
            Подтвердите код и задайте новый пароль.
          </p>

          <form class="mt-8 space-y-5" @submit.prevent="handleSubmit">
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
              <label class="mb-2 block text-sm font-medium text-slate-700">Код сброса</label>
              <input
                  v-model.trim="code"
                  inputmode="numeric"
                  maxlength="6"
                  class="w-full rounded-2xl border px-4 py-3 tracking-[0.35em] outline-none transition"
                  :class="fieldClass(showValidation && !!codeError)"
                  placeholder="123456"
              />
              <p v-if="showValidation && codeError" class="mt-2 text-sm text-red-600">
                {{ codeError }}
              </p>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Новый пароль</label>
              <input
                  v-model="newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  class="w-full rounded-2xl border px-4 py-3 outline-none transition"
                  :class="fieldClass(showValidation && !!newPasswordError)"
                  placeholder="Минимум 8 символов"
              />
              <p v-if="showValidation && newPasswordError" class="mt-2 text-sm text-red-600">
                {{ newPasswordError }}
              </p>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Подтверждение нового пароля</label>
              <input
                  v-model="confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  class="w-full rounded-2xl border px-4 py-3 outline-none transition"
                  :class="fieldClass(showValidation && !!confirmPasswordError)"
                  placeholder="Повторите новый пароль"
              />
              <p v-if="showValidation && confirmPasswordError" class="mt-2 text-sm text-red-600">
                {{ confirmPasswordError }}
              </p>
            </div>

            <button
                type="button"
                class="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Скрыть пароль' : 'Показать пароль' }}
            </button>

            <AppErrorState
                v-if="errorMessage"
                title="Не удалось обновить пароль"
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
              {{ loading ? 'Сохранение...' : 'Обновить пароль' }}
            </button>

            <div class="text-center text-sm text-slate-600">
              Нужен новый код?
              <RouterLink
                  :to="{ path: '/forgot-password', query: { email } }"
                  class="font-semibold text-slate-900 transition hover:opacity-70"
              >
                Запросить повторно
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
import { useRoute, useRouter } from 'vue-router'
import { http } from '../../shared/api/http'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'

const route = useRoute()
const router = useRouter()

const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const code = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showValidation = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const emailError = computed(() => {
  if (!email.value) return 'Введите email'
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  return valid ? '' : 'Введите корректный email'
})

const codeError = computed(() => {
  if (!code.value) return 'Введите код сброса'
  return /^\d{6}$/.test(code.value) ? '' : 'Код должен содержать 6 цифр'
})

const newPasswordError = computed(() => {
  if (!newPassword.value) return 'Введите новый пароль'
  return newPassword.value.length >= 8 ? '' : 'Пароль должен содержать минимум 8 символов'
})

const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return 'Подтвердите новый пароль'
  return confirmPassword.value === newPassword.value ? '' : 'Пароли не совпадают'
})

const fieldClass = (hasError: boolean) =>
    hasError
        ? 'border-red-300 focus:border-red-500'
        : 'border-slate-300 focus:border-slate-900'

const handleSubmit = async () => {
  showValidation.value = true
  errorMessage.value = ''
  successMessage.value = ''

  if (
      emailError.value ||
      codeError.value ||
      newPasswordError.value ||
      confirmPasswordError.value
  ) {
    return
  }

  loading.value = true

  try {
    const { data } = await http.post('/api/auth/reset-password', {
      email: email.value,
      code: code.value,
      newPassword: newPassword.value,
    })

    successMessage.value = data?.message || 'Пароль успешно обновлён.'

    setTimeout(async () => {
      await router.push('/login')
    }, 1200)
  } catch (error: any) {
    errorMessage.value =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Не удалось обновить пароль.'
  } finally {
    loading.value = false
  }
}
</script>