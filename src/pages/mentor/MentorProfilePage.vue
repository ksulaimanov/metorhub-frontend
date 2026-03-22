<template>
  <div class="min-h-screen bg-slate-50">
    <PrivateHeader />
    <div class="mx-auto max-w-5xl px-6 py-10">
      <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 class="text-3xl font-bold text-slate-900">Профиль ментора</h1>

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

          <button class="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white md:col-span-2">
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
})

const loadProfile = async () => {
  const { data } = await http.get('/api/mentor/profile')
  Object.assign(form, data)
}

const saveProfile = async () => {
  await http.put('/api/mentor/profile', form)
  successMessage.value = 'Профиль ментора успешно обновлён'
}

onMounted(loadProfile)
</script>