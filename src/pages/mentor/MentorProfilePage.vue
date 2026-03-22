<template>
  <div class="min-h-screen bg-slate-50">
    <PrivateHeader />
    <div class="mx-auto max-w-5xl px-6 py-10">
      <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 class="text-3xl font-bold text-slate-900">Профиль ментора</h1>

        <div class="mt-6 grid gap-4 md:grid-cols-4">
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Рейтинг</p>
            <p class="mt-2 text-2xl font-bold text-slate-900">{{ form.averageRating || 0 }}</p>
          </div>

          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Проведено занятий</p>
            <p class="mt-2 text-2xl font-bold text-slate-900">{{ form.lessonsCompleted || 0 }}</p>
          </div>

          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Публичность</p>
            <p class="mt-2 text-lg font-semibold text-slate-900">
              {{ form.public ? 'Публичный профиль' : 'Скрытый профиль' }}
            </p>
          </div>

          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Статус</p>
            <p class="mt-2 text-lg font-semibold" :class="form.verified ? 'text-emerald-600' : 'text-slate-700'">
              {{ form.verified ? 'Проверен' : 'Обычный профиль' }}
            </p>
          </div>
        </div>

        <form class="mt-8 grid gap-4 md:grid-cols-2" @submit.prevent="saveProfile">
          <input v-model="form.firstName" class="rounded-2xl border border-slate-300 px-4 py-3" placeholder="Имя" />
          <input v-model="form.lastName" class="rounded-2xl border border-slate-300 px-4 py-3" placeholder="Фамилия" />
          <input v-model="form.headline" class="rounded-2xl border border-slate-300 px-4 py-3 md:col-span-2" placeholder="Короткий заголовок профиля" />
          <input v-model="form.specialization" class="rounded-2xl border border-slate-300 px-4 py-3" placeholder="Специализация" />
          <input v-model="form.city" class="rounded-2xl border border-slate-300 px-4 py-3" placeholder="Город" />
          <input v-model="form.yearsExperience" type="number" class="rounded-2xl border border-slate-300 px-4 py-3" placeholder="Опыт (лет)" />
          <input v-model="form.pricePerHour" type="number" class="rounded-2xl border border-slate-300 px-4 py-3" placeholder="Стоимость за час" />
          <input v-model="form.addressText" class="rounded-2xl border border-slate-300 px-4 py-3 md:col-span-2" placeholder="Адрес" />
          <input v-model="form.meetingLink" class="rounded-2xl border border-slate-300 px-4 py-3 md:col-span-2" placeholder="Ссылка на встречу" />

          <div class="flex gap-4 md:col-span-2">
            <label class="flex items-center gap-2">
              <input v-model="form.lessonFormatOnline" type="checkbox" />
              Онлайн
            </label>
            <label class="flex items-center gap-2">
              <input v-model="form.lessonFormatOffline" type="checkbox" />
              Офлайн
            </label>
            <label class="flex items-center gap-2">
              <input v-model="form.lessonFormatHybrid" type="checkbox" />
              Гибрид
            </label>
            <label class="flex items-center gap-2">
              <input v-model="form.public" type="checkbox" />
              Публичный профиль
            </label>
          </div>

          <textarea
              v-model="form.bio"
              class="min-h-36 rounded-2xl border border-slate-300 px-4 py-3 md:col-span-2"
              placeholder="Расскажите о себе, опыте и формате обучения"
          />

          <button type="submit" class="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white md:col-span-2">
            Сохранить изменения
          </button>
        </form>

        <p v-if="successMessage" class="mt-4 text-sm font-medium text-emerald-600">{{ successMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { http } from '../../shared/api/http'
import PrivateHeader from '../../widgets/header/PrivateHeader.vue'

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
  verified: false
})

const loadProfile = async () => {
  try {
    const { data } = await http.get('/api/mentor/profile')
    Object.assign(form, data)
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error)
  }
}

const saveProfile = async () => {
  try {
    await http.put('/api/mentor/profile', form)
    successMessage.value = 'Профиль ментора успешно обновлён'
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (error) {
    console.error('Ошибка сохранения профиля:', error)
  }
}

onMounted(loadProfile)
</script>