<template>
  <PrivateLayout>
    <div class="space-y-8">
      <AppSectionTitle
          title="Профиль ментора"
          description="Заполненный и публичный профиль помогает ученикам быстрее выбрать вас, понять ваш опыт и записаться на занятие."
      />

      <AppLoadingState v-if="loading" text="Загружаем профиль..." />

      <AppErrorState
          v-else-if="pageError"
          title="Не удалось загрузить профиль"
          :description="pageError"
      />

      <template v-else>
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                  Эти данные отображаются в вашем профиле и помогают ученикам быстрее понять, чем вы полезны.
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

                <div class="md:col-span-2">
                  <label class="mb-2 block text-sm font-medium text-slate-700">
                    Заголовок профиля
                  </label>
                  <input
                      v-model.trim="form.headline"
                      class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      placeholder="Например: Java-ментор, помогаю подготовиться к собеседованиям"
                  />
                  <p class="mt-2 text-xs text-slate-500">
                    Коротко опишите, в чём ваша сила как ментора.
                  </p>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">Специализация</label>
                  <input
                      v-model.trim="form.specialization"
                      class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      placeholder="Например: Frontend, Java, Data Science"
                  />
                  <p v-if="fieldErrors.specialization" class="mt-2 text-sm text-red-600">
                    {{ fieldErrors.specialization }}
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
                  Выберите, в каком формате вы готовы проводить занятия.
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
                    <p class="text-sm text-slate-600">Показывать вас в каталоге MentorHub</p>
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
                  Укажите адрес и ссылку, если используете офлайн или онлайн формат.
                </p>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div class="md:col-span-2">
                  <label class="mb-2 block text-sm font-medium text-slate-700">Адрес</label>
                  <input
                      v-model.trim="form.addressText"
                      class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      placeholder="Например: Бишкек, ул. Исанова 42"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="mb-2 block text-sm font-medium text-slate-700">
                    Ссылка на встречу
                  </label>
                  <input
                      v-model.trim="form.meetingLink"
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
                  Расскажите об опыте, подходе к обучению и о том, с какими запросами вы работаете.
                </p>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700">Описание профиля</label>
                <textarea
                    v-model.trim="form.bio"
                    class="min-h-40 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    placeholder="Расскажите о себе, опыте, подходе к обучению и том, чем вы можете быть полезны ученикам."
                />
                <p v-if="fieldErrors.bio" class="mt-2 text-sm text-red-600">
                  {{ fieldErrors.bio }}
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
import AppBadge from '../../shared/ui/AppBadge.vue'
import AppSectionTitle from '../../shared/ui/AppSectionTitle.vue'
import AppLoadingState from '../../shared/ui/AppLoadingState.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'

const loading = ref(false)
const saving = ref(false)
const pageError = ref('')
const saveError = ref('')
const successMessage = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  avatarKey: '',
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

const fieldErrors = reactive({
  firstName: '',
  lastName: '',
  specialization: '',
  bio: '',
})

const formatError = computed(() => {
  if (!form.lessonFormatOnline && !form.lessonFormatOffline && !form.lessonFormatHybrid) {
    return 'Выберите хотя бы один формат занятий: онлайн, офлайн или гибрид.'
  }

  return ''
})

const validate = () => {
  fieldErrors.firstName = ''
  fieldErrors.lastName = ''
  fieldErrors.specialization = ''
  fieldErrors.bio = ''

  let isValid = true

  if (!form.firstName.trim()) {
    fieldErrors.firstName = 'Введите имя'
    isValid = false
  }

  if (!form.lastName.trim()) {
    fieldErrors.lastName = 'Введите фамилию'
    isValid = false
  }

  if (!form.specialization.trim()) {
    fieldErrors.specialization = 'Укажите специализацию'
    isValid = false
  }

  if (!form.bio.trim()) {
    fieldErrors.bio = 'Добавьте описание профиля'
    isValid = false
  }

  if (form.pricePerHour < 0) {
    saveError.value = 'Стоимость не может быть отрицательной.'
    isValid = false
  }

  if (form.yearsExperience < 0) {
    saveError.value = 'Опыт не может быть отрицательным.'
    isValid = false
  }

  return isValid
}

const loadProfile = async () => {
  loading.value = true
  pageError.value = ''

  try {
    const { data } = await http.get('/api/mentor/profile')
    Object.assign(form, data)
  } catch (error) {
    console.error('Ошибка загрузки профиля ментора:', error)
    pageError.value = 'Попробуйте обновить страницу чуть позже.'
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  successMessage.value = ''
  saveError.value = ''

  if (formatError.value) {
    saveError.value = formatError.value
    return
  }

  if (!validate()) {
    if (!saveError.value) {
      saveError.value = 'Проверьте заполнение обязательных полей.'
    }
    return
  }

  saving.value = true

  try {
    await http.put('/api/mentor/profile', form)
    successMessage.value = 'Профиль ментора успешно обновлён.'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Ошибка сохранения профиля ментора:', error)
    saveError.value = 'Не удалось сохранить изменения. Попробуйте ещё раз.'
  } finally {
    saving.value = false
  }
}

onMounted(loadProfile)
</script>