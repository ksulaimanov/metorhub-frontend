<template>
  <PrivateLayout>
    <div class="space-y-8">
      <AppSectionTitle
          title="Профиль ученика"
          description="Заполненный профиль помогает быстрее записываться на занятия, понятнее формулировать запрос и удобнее взаимодействовать с ментором."
      />

      <AppLoadingState v-if="loading" text="Загружаем профиль..." />

      <AppErrorState
          v-else-if="pageError"
          title="Не удалось загрузить профиль"
          :description="pageError"
      />

      <template v-else>
        <AppCard>
          <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div class="flex items-center gap-4">
              <div class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-2xl font-bold text-slate-600">
                <img
                    v-if="form.avatarUrl"
                    :src="form.avatarUrl"
                    alt="Аватар ученика"
                    class="h-full w-full object-cover"
                />
                <span v-else>{{ avatarInitials }}</span>
              </div>

              <div>
                <h2 class="text-xl font-semibold text-slate-900">{{ fullName }}</h2>
                <p class="mt-1 text-sm text-slate-600">
                  Добавьте фото профиля, чтобы кабинет выглядел персональнее.
                </p>
              </div>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row">
              <label
                  class="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <input
                    type="file"
                    class="hidden"
                    accept="image/png,image/jpeg,image/webp"
                    :disabled="avatarUploading"
                    @change="handleAvatarUpload"
                />
                {{ avatarUploading ? 'Загрузка...' : 'Загрузить фото' }}
              </label>

              <button
                  v-if="form.avatarUrl"
                  type="button"
                  class="inline-flex items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="avatarDeleting"
                  @click="handleAvatarDelete"
              >
                {{ avatarDeleting ? 'Удаление...' : 'Удалить фото' }}
              </button>
            </div>
          </div>

          <p v-if="avatarMessage" class="mt-4 text-sm font-medium text-emerald-600">
            {{ avatarMessage }}
          </p>
          <p v-if="avatarError" class="mt-4 text-sm font-medium text-red-600">
            {{ avatarError }}
          </p>
        </AppCard>

        <div class="grid gap-4 md:grid-cols-3">
          <AppCard>
            <p class="text-sm text-slate-500">Имя и фамилия</p>
            <p class="mt-2 text-lg font-semibold text-slate-900">
              {{ fullName }}
            </p>
          </AppCard>

          <AppCard>
            <p class="text-sm text-slate-500">Город</p>
            <p class="mt-2 text-lg font-semibold text-slate-900">
              {{ form.city || 'Не указан' }}
            </p>
          </AppCard>

          <AppCard>
            <p class="text-sm text-slate-500">Часовой пояс</p>
            <p class="mt-2 text-lg font-semibold text-slate-900">
              {{ form.timezone || 'Не указан' }}
            </p>
          </AppCard>
        </div>

        <form class="space-y-6" @submit.prevent="saveProfile">
          <AppCard>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-semibold text-slate-900">Основная информация</h2>
                <p class="mt-1 text-sm text-slate-600">
                  Эти данные помогут ментору лучше понимать, как к вам обращаться и откуда вы.
                </p>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">Имя</label>
                  <input
                      v-model.trim="form.firstName"
                      class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      placeholder="Введите имя"
                  />
                  <p v-if="fieldErrors.firstName" class="mt-2 text-sm text-red-600">
                    {{ fieldErrors.firstName }}
                  </p>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">Фамилия</label>
                  <input
                      v-model.trim="form.lastName"
                      class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      placeholder="Введите фамилию"
                  />
                  <p v-if="fieldErrors.lastName" class="mt-2 text-sm text-red-600">
                    {{ fieldErrors.lastName }}
                  </p>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">Город</label>
                  <input
                      v-model.trim="form.city"
                      class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      placeholder="Например: Бишкек"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">Телефон</label>
                  <input
                      v-model.trim="form.phone"
                      class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      placeholder="+996 700 00 00 00"
                  />
                  <p class="mt-2 text-xs text-slate-500">
                    Укажите номер, по которому с вами удобно связаться.
                  </p>
                </div>

                <div class="md:col-span-2">
                  <label class="mb-2 block text-sm font-medium text-slate-700">Часовой пояс</label>
                  <input
                      v-model.trim="form.timezone"
                      class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      placeholder="Например: Asia/Bishkek"
                  />
                  <p class="mt-2 text-xs text-slate-500">
                    Это поможет корректно показывать время занятий и бронирований.
                  </p>
                </div>
              </div>
            </div>
          </AppCard>

          <AppCard>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-semibold text-slate-900">О себе</h2>
                <p class="mt-1 text-sm text-slate-600">
                  Расскажите коротко о своих целях, интересах и запросе к обучению.
                </p>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700">Краткое описание</label>
                <textarea
                    v-model.trim="form.bio"
                    class="min-h-40 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    placeholder="Например: Хочу улучшить навыки frontend-разработки, подготовиться к собеседованиям и научиться работать с Vue."
                />
                <p class="mt-2 text-xs text-slate-500">
                  Хорошее описание помогает ментору лучше подготовиться к занятию.
                </p>
              </div>
            </div>
          </AppCard>

          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="min-h-[24px]">
              <p v-if="successMessage" class="text-sm font-medium text-emerald-600">
                {{ successMessage }}
              </p>
              <p v-else-if="saveError" class="text-sm font-medium text-red-600">
                {{ saveError }}
              </p>
            </div>

            <button
                type="submit"
                class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="saving"
            >
              {{ saving ? 'Сохранение...' : 'Сохранить изменения' }}
            </button>
          </div>
        </form>
      </template>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { http } from '../../shared/api/http'
import PrivateLayout from '../../widgets/layout/PrivateLayout.vue'
import AppCard from '../../shared/ui/AppCard.vue'
import AppSectionTitle from '../../shared/ui/AppSectionTitle.vue'
import AppLoadingState from '../../shared/ui/AppLoadingState.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'

const loading = ref(false)
const saving = ref(false)
const avatarUploading = ref(false)
const avatarDeleting = ref(false)

const pageError = ref('')
const saveError = ref('')
const successMessage = ref('')
const avatarMessage = ref('')
const avatarError = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  avatarKey: '',
  avatarUrl: '',
  bio: '',
  timezone: '',
  phone: '',
  city: '',
})

const fieldErrors = reactive({
  firstName: '',
  lastName: '',
})

const fullName = computed(() => {
  const full = `${form.firstName} ${form.lastName}`.trim()
  return full || 'Не заполнено'
})

const avatarInitials = computed(() => {
  const first = form.firstName?.trim()?.[0] || ''
  const last = form.lastName?.trim()?.[0] || ''
  return (first + last).toUpperCase() || 'U'
})

const validate = () => {
  fieldErrors.firstName = ''
  fieldErrors.lastName = ''

  let isValid = true

  if (!form.firstName.trim()) {
    fieldErrors.firstName = 'Введите имя'
    isValid = false
  }

  if (!form.lastName.trim()) {
    fieldErrors.lastName = 'Введите фамилию'
    isValid = false
  }

  return isValid
}

const loadProfile = async () => {
  loading.value = true
  pageError.value = ''

  try {
    const { data } = await http.get('/api/student/profile')
    Object.assign(form, data)
  } catch (error) {
    console.error('Ошибка загрузки профиля ученика:', error)
    pageError.value = 'Попробуйте обновить страницу чуть позже.'
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  successMessage.value = ''
  saveError.value = ''

  if (!validate()) {
    saveError.value = 'Проверьте заполнение обязательных полей.'
    return
  }

  saving.value = true

  try {
    await http.put('/api/student/profile', form)
    successMessage.value = 'Профиль успешно обновлён.'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Ошибка сохранения профиля ученика:', error)
    saveError.value = 'Не удалось сохранить изменения. Попробуйте ещё раз.'
  } finally {
    saving.value = false
  }
}

const handleAvatarUpload = async (event: Event) => {
  avatarError.value = ''
  avatarMessage.value = ''

  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  avatarUploading.value = true

  try {
    const { data } = await http.post('/api/student/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    form.avatarKey = data.avatarKey
    form.avatarUrl = data.avatarUrl
    avatarMessage.value = 'Фото профиля успешно обновлено.'
  } catch (error: any) {
    console.error('Ошибка загрузки аватара ученика:', error)
    avatarError.value =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Не удалось загрузить фото.'
  } finally {
    avatarUploading.value = false
    input.value = ''
  }
}

const handleAvatarDelete = async () => {
  avatarError.value = ''
  avatarMessage.value = ''

  avatarDeleting.value = true

  try {
    await http.delete('/api/student/profile/avatar')
    form.avatarKey = ''
    form.avatarUrl = ''
    avatarMessage.value = 'Фото профиля удалено.'
  } catch (error: any) {
    console.error('Ошибка удаления аватара ученика:', error)
    avatarError.value =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Не удалось удалить фото.'
  } finally {
    avatarDeleting.value = false
  }
}

onMounted(loadProfile)
</script>