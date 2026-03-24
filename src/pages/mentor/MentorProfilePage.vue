<template>
  <PrivateLayout>
    <div class="space-y-8">
      <AppSectionTitle
          title="Профиль ментора"
          description="Заполните профиль так, чтобы ученикам было проще понять ваш опыт, формат работы и стоимость занятий."
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
                    alt="Аватар ментора"
                    class="h-full w-full object-cover"
                />
                <span v-else>{{ avatarInitials }}</span>
              </div>

              <div>
                <h2 class="text-xl font-semibold text-slate-900">{{ mentorName }}</h2>
                <p class="mt-1 text-sm text-slate-600">
                  Добавьте фото, чтобы профиль выглядел профессиональнее и вызывал больше доверия.
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
                  @click="confirmAvatarDelete"
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

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AppCard>
            <p class="text-sm text-slate-500">Рейтинг</p>
            <p class="mt-2 text-2xl font-bold text-slate-900">
              {{ form.averageRating || 0 }}
            </p>
          </AppCard>

          <AppCard>
            <p class="text-sm text-slate-500">Проведено занятий</p>
            <p class="mt-2 text-2xl font-bold text-slate-900">
              {{ form.lessonsCompleted || 0 }}
            </p>
          </AppCard>

          <AppCard>
            <p class="text-sm text-slate-500">Публичность</p>
            <div class="mt-3">
              <AppBadge :variant="form.public ? 'success' : 'default'">
                {{ form.public ? 'Публичный профиль' : 'Скрытый профиль' }}
              </AppBadge>
            </div>
          </AppCard>

          <AppCard>
            <p class="text-sm text-slate-500">Статус</p>
            <div class="mt-3">
              <AppBadge :variant="form.verified ? 'success' : 'info'">
                {{ form.verified ? 'Проверен' : 'Обычный профиль' }}
              </AppBadge>
            </div>
          </AppCard>
        </div>

        <form class="space-y-6" @submit.prevent="saveProfile">
          <AppCard>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-semibold text-slate-900">Основная информация</h2>
                <p class="mt-1 text-sm text-slate-600">
                  Эти данные видят ученики в вашем профиле и каталоге.
                </p>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">Имя</label>
                  <input
                      v-model="form.firstName"
                      type="text"
                      class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      placeholder="Введите имя"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">Фамилия</label>
                  <input
                      v-model="form.lastName"
                      type="text"
                      class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      placeholder="Введите фамилию"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="mb-2 block text-sm font-medium text-slate-700">
                    Заголовок профиля
                  </label>
                  <input
                      v-model="form.headline"
                      type="text"
                      class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      placeholder="Например: Java-ментор, помогаю подготовиться к собеседованиям"
                  />
                  <p class="mt-2 text-xs text-slate-500">
                    Коротко опишите, чем вы полезны ученику.
                  </p>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">
                    Специализация
                  </label>
                  <input
                      v-model="form.specialization"
                      type="text"
                      class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      placeholder="Например: Frontend, Java, Data Science"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">Город</label>
                  <input
                      v-model="form.city"
                      type="text"
                      class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      placeholder="Например: Бишкек"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">
                    Опыт работы (лет)
                  </label>
                  <input
                      v-model.number="form.yearsExperience"
                      type="number"
                      min="0"
                      class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      placeholder="Например: 5"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">
                    Стоимость за час
                  </label>
                  <input
                      v-model.number="form.pricePerHour"
                      type="number"
                      min="0"
                      class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      placeholder="Например: 1500"
                  />
                </div>
              </div>
            </div>
          </AppCard>

          <AppCard>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-semibold text-slate-900">Формат занятий</h2>
                <p class="mt-1 text-sm text-slate-600">
                  Выберите, как именно вы готовы проводить занятия.
                </p>
              </div>

              <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300">
                  <input v-model="form.lessonFormatOnline" type="checkbox" class="mt-1 h-4 w-4" />
                  <div>
                    <p class="font-medium text-slate-900">Онлайн</p>
                    <p class="text-sm text-slate-600">Видеозвонки и дистанционные занятия</p>
                  </div>
                </label>

                <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300">
                  <input v-model="form.lessonFormatOffline" type="checkbox" class="mt-1 h-4 w-4" />
                  <div>
                    <p class="font-medium text-slate-900">Офлайн</p>
                    <p class="text-sm text-slate-600">Личные встречи по адресу</p>
                  </div>
                </label>

                <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300">
                  <input v-model="form.lessonFormatHybrid" type="checkbox" class="mt-1 h-4 w-4" />
                  <div>
                    <p class="font-medium text-slate-900">Гибрид</p>
                    <p class="text-sm text-slate-600">Можно и онлайн, и офлайн</p>
                  </div>
                </label>

                <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300">
                  <input v-model="form.public" type="checkbox" class="mt-1 h-4 w-4" />
                  <div>
                    <p class="font-medium text-slate-900">Публичный профиль</p>
                    <p class="text-sm text-slate-600">Показывать вас в общем каталоге</p>
                  </div>
                </label>
              </div>

              <p v-if="formatError" class="text-sm font-medium text-red-600">
                {{ formatError }}
              </p>
            </div>
          </AppCard>

          <AppCard>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-semibold text-slate-900">Контакты и проведение занятий</h2>
                <p class="mt-1 text-sm text-slate-600">
                  Укажите ссылку и адрес, если используете онлайн или офлайн формат.
                </p>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div class="md:col-span-2">
                  <label class="mb-2 block text-sm font-medium text-slate-700">Адрес</label>
                  <input
                      v-model="form.addressText"
                      type="text"
                      class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      placeholder="Например: Бишкек, ул. Исанова 42"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="mb-2 block text-sm font-medium text-slate-700">
                    Ссылка на встречу
                  </label>
                  <input
                      v-model="form.meetingLink"
                      type="text"
                      class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      placeholder="Например: Zoom / Google Meet ссылка"
                  />
                </div>
              </div>
            </div>
          </AppCard>

          <AppCard>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-semibold text-slate-900">О себе</h2>
                <p class="mt-1 text-sm text-slate-600">
                  Расскажите об опыте, подходе к обучению и с какими запросами вы помогаете.
                </p>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700">Описание профиля</label>
                <textarea
                    v-model="form.bio"
                    class="min-h-40 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    placeholder="Расскажите о себе, своём опыте, формате занятий и том, чем вы можете быть полезны ученикам."
                />
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
import { useToastStore } from '../../shared/lib/getApiErrorMessage'
import { useErrorHandler } from '../../shared/composables/useErrorHandler'
import PrivateLayout from '../../widgets/layout/PrivateLayout.vue'
import AppCard from '../../shared/ui/AppCard.vue'
import AppSectionTitle from '../../shared/ui/AppSectionTitle.vue'
import AppLoadingState from '../../shared/ui/AppLoadingState.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'
import AppBadge from '../../shared/ui/AppBadge.vue'

const toastStore = useToastStore()
const { handleError } = useErrorHandler()
const saveError = ref('')
const loading = ref(false)
const saving = ref(false)
const avatarUploading = ref(false)
const avatarDeleting = ref(false)

const pageError = ref('')
const avatarError = ref('')
const successMessage = ref('')
const avatarMessage = ref('')
const form = reactive({
  firstName: '',
  lastName: '',
  avatarKey: '',
  avatarUrl: '',
  headline: '',
  bio: '',
  specialization: '',
  yearsExperience: 0,
  lessonFormatOnline: false,
  lessonFormatOffline: false,
  lessonFormatHybrid: false,
  city: '',
  addressText: '',
  meetingLink: '',
  pricePerHour: 0,
  public: true,
  averageRating: 0,
  lessonsCompleted: 0,
  verified: false,
})

const mentorName = computed(() => {
  const full = `${form.firstName || ''} ${form.lastName || ''}`.trim()
  return full || 'Новый ментор'
})

const avatarInitials = computed(() => {
  const first = form.firstName?.charAt(0) || ''
  const last = form.lastName?.charAt(0) || ''
  return (first + last).toUpperCase() || 'M'
})

const formatError = computed(() => {
  if (!form.lessonFormatOnline && !form.lessonFormatOffline && !form.lessonFormatHybrid) {
    return 'Выберите хотя бы один формат занятий: онлайн, офлайн или гибрид.'
  }

  return ''
})

const loadProfile = async () => {
  loading.value = true
  pageError.value = ''

  try {
    const { data } = await http.get('/api/mentor/profile')
    Object.assign(form, data)
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error)
    pageError.value = 'Попробуйте обновить страницу чуть позже.'
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  if (formatError.value) {
    toastStore.error(formatError.value)
    return
  }

  saving.value = true
  saveError.value = ''
  successMessage.value = ''

  try {
    await http.put('/api/mentor/profile', form)
    successMessage.value = 'Профиль успешно сохранён!'
    toastStore.success('Профиль ментора успешно обновлён.')
  } catch (error) {
    saveError.value = handleError(error, 'Не удалось сохранить изменения.')
  } finally {
    saving.value = false
  }
}

const handleAvatarUpload = async (event: Event) => {
  avatarError.value = ''

  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  avatarUploading.value = true

  try {
    const { data } = await http.post('/api/mentor/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    form.avatarKey = data.avatarKey
    form.avatarUrl = data.avatarUrl
    toastStore.success('Фото профиля успешно обновлено.')
  } catch (error: any) {
    console.error('Ошибка загрузки аватара ментора:', error)
    avatarError.value = handleError(error, 'Не удалось загрузить фото.')
  } finally {
    avatarUploading.value = false
    input.value = ''
  }
}

const confirmAvatarDelete = async () => {
  if (!window.confirm('Вы уверены? Фото профиля будет удалено.')) {
    return
  }

  await handleAvatarDelete()
}

const handleAvatarDelete = async () => {
  avatarError.value = ''

  avatarDeleting.value = true

  try {
    await http.delete('/api/mentor/profile/avatar')
    form.avatarKey = ''
    form.avatarUrl = ''
    toastStore.success('Фото профиля удалено.')
  } catch (error: any) {
    console.error('Ошибка удаления аватара ментора:', error)
    avatarError.value = handleError(error, 'Не удалось удалить фото.')
  } finally {
    avatarDeleting.value = false
  }
}

onMounted(loadProfile)
</script>