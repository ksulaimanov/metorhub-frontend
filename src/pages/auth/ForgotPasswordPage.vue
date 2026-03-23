<template>
  <PublicLayout>
    <section class="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-10 sm:px-6">
      <div class="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
        <div class="hidden lg:block">
          <p class="inline-flex rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            Восстановление доступа
          </p>

          <h1 class="mt-5 max-w-xl text-5xl font-bold leading-tight text-slate-900">
            Сбросьте пароль и вернитесь в MentorHub
          </h1>

          <p class="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Введите email, и мы отправим код для сброса пароля.
          </p>
        </div>

        <div class="w-full max-w-md justify-self-center rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h1 class="text-3xl font-bold text-slate-900">Забыли пароль?</h1>
          <p class="mt-2 text-sm text-slate-600">
            Укажите email, связанный с вашим аккаунтом.
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

            <AppErrorState
                v-if="errorMessage"
                title="Не удалось отправить код"
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
              {{ loading ? 'Отправка...' : 'Отправить код' }}
            </button>

            <div class="text-center text-sm text-slate-600">
              Вспомнили пароль?
              <RouterLink to="/login" class="font-semibold text-slate-900 transition hover:opacity-70">
                Вернуться ко входу
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

const email = ref('')
const loading = ref(false)
const showValidation = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const emailError = computed(() => {
  if (!email.value) return 'Введите email'
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  return valid ? '' : 'Введите корректный email'
})

const fieldClass = (hasError: boolean) =>
    hasError
        ? 'border-red-300 focus:border-red-500'
        : 'border-slate-300 focus:border-slate-900'

const handleSubmit = async () => {
  showValidation.value = true
  errorMessage.value = ''
  successMessage.value = ''

  if (emailError.value) return

  loading.value = true

  try {
    const { data } = await http.post('/api/auth/forgot-password', {
      email: email.value,
    })

    successMessage.value =
        data?.message || 'Если email зарегистрирован, код для сброса отправлен.'

    setTimeout(async () => {
      await router.push({
        path: '/reset-password',
        query: { email: email.value },
      })
    }, 1000)
  } catch (error: any) {
    errorMessage.value =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Не удалось отправить код для сброса.'
  } finally {
    loading.value = false
  }
}
</script>