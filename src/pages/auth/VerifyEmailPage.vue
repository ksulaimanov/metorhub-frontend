<template>
  <PublicLayout>
    <section class="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-10 sm:px-6">
      <div class="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
        <div class="hidden lg:block">
          <p class="inline-flex rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            Подтверждение email
          </p>

          <h1 class="mt-5 max-w-xl text-5xl font-bold leading-tight text-slate-900">
            Завершите регистрацию в MentorHub
          </h1>

          <p class="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Мы отправили 6-значный код на ваш email. Введите его, чтобы подтвердить адрес и войти в аккаунт.
          </p>

          <div class="mt-8 grid max-w-xl gap-4">
            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 class="text-lg font-semibold text-slate-900">Безопасный вход</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                Подтверждение email помогает защитить аккаунт и исключить ошибки при регистрации.
              </p>
            </div>

            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 class="text-lg font-semibold text-slate-900">Быстрое завершение</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                После подтверждения email вы сможете войти и пользоваться всеми возможностями платформы.
              </p>
            </div>
          </div>
        </div>

        <div class="w-full max-w-md justify-self-center rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h1 class="text-3xl font-bold text-slate-900">Подтвердите email</h1>
          <p class="mt-2 text-sm text-slate-600">
            Введите email и 6-значный код из письма.
          </p>

          <form class="mt-8 space-y-5" @submit.prevent="handleVerify">
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
              <label class="mb-2 block text-sm font-medium text-slate-700">Код подтверждения</label>
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

            <AppErrorState
                v-if="errorMessage"
                title="Не удалось подтвердить email"
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
                :disabled="verifying"
            >
              {{ verifying ? 'Подтверждение...' : 'Подтвердить email' }}
            </button>
          </form>

          <div class="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p class="text-sm font-medium text-slate-900">Не пришёл код?</p>
            <p class="mt-1 text-sm text-slate-600">
              Проверьте папку “Спам” или отправьте код повторно.
            </p>

            <button
                type="button"
                class="mt-4 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="resending || resendCooldown > 0"
                @click="handleResend"
            >
              <span v-if="resending">Отправка...</span>
              <span v-else-if="resendCooldown > 0">
                Повторно отправить через {{ resendCooldown }} сек
              </span>
              <span v-else>
                Отправить код повторно
              </span>
            </button>

            <p v-if="resendMessage" class="mt-3 text-sm text-emerald-600">
              {{ resendMessage }}
            </p>
          </div>

          <div class="mt-6 text-center text-sm text-slate-600">
            Уже подтвердили email?
            <RouterLink to="/login" class="font-semibold text-slate-900 transition hover:opacity-70">
              Войти
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { http } from '../../shared/api/http'
import { useToastStore } from '../../shared/lib/getApiErrorMessage'
import { useErrorHandler } from '../../shared/composables/useErrorHandler'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'

const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()
const { handleError } = useErrorHandler()

const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const code = ref('')
const showValidation = ref(false)

const verifying = ref(false)
const resending = ref(false)

const errorMessage = ref('')
const successMessage = ref('')
const resendMessage = ref('')

const resendCooldown = ref(0)
let resendInterval: number | null = null

const emailError = computed(() => {
  if (!email.value) return 'Введите email'
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  return valid ? '' : 'Введите корректный email'
})

const codeError = computed(() => {
  if (!code.value) return 'Введите код подтверждения'
  return /^\d{6}$/.test(code.value) ? '' : 'Код должен содержать 6 цифр'
})

const fieldClass = (hasError: boolean) =>
    hasError
        ? 'border-red-300 focus:border-red-500'
        : 'border-slate-300 focus:border-slate-900'

const startCooldown = (seconds: number) => {
  resendCooldown.value = seconds

  if (resendInterval) {
    window.clearInterval(resendInterval)
  }

  resendInterval = window.setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value -= 1
      return
    }

    if (resendInterval) {
      window.clearInterval(resendInterval)
      resendInterval = null
    }
  }, 1000)
}

const handleVerify = async () => {
  showValidation.value = true

  if (emailError.value || codeError.value) {
    return
  }

  verifying.value = true

  try {
    await http.post('/api/auth/verify-email', {
      email: email.value,
      code: code.value,
    })

    toastStore.success('Email успешно подтверждён. Перенаправляем на страницу входа...')

    setTimeout(async () => {
      await router.push('/login')
    }, 1200)
  } catch (error: any) {
    errorMessage.value = handleError(error, 'Не удалось подтвердить email. Проверьте код и попробуйте снова.')
  } finally {
    verifying.value = false
  }
}

const handleResend = async () => {
  showValidation.value = true

  if (emailError.value) {
    return
  }

  resending.value = true

  try {
    await http.post('/api/auth/resend-verification', {
      email: email.value,
    })

    toastStore.success('Новый код подтверждения отправлен.')
    startCooldown(60)
  } catch (error: any) {
    errorMessage.value = handleError(error, 'Не удалось отправить код повторно.')
  } finally {
    resending.value = false
  }
}



onBeforeUnmount(() => {
  if (resendInterval) {
    window.clearInterval(resendInterval)
  }
})
</script>