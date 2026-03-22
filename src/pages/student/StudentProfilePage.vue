<template>
  <div class="min-h-screen bg-slate-50">
    <PrivateHeader />
    <div class="mx-auto max-w-4xl px-6 py-10">
      <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 class="text-3xl font-bold text-slate-900">Профиль ученика</h1>

        <form class="mt-8 grid gap-4 md:grid-cols-2" @submit.prevent="saveProfile">
          <input v-model="form.firstName" class="rounded-2xl border border-slate-300 px-4 py-3" placeholder="Имя" />
          <input v-model="form.lastName" class="rounded-2xl border border-slate-300 px-4 py-3" placeholder="Фамилия" />
          <input v-model="form.city" class="rounded-2xl border border-slate-300 px-4 py-3" placeholder="Город" />
          <input v-model="form.phone" class="rounded-2xl border border-slate-300 px-4 py-3" placeholder="Телефон" />
          <input v-model="form.timezone" class="rounded-2xl border border-slate-300 px-4 py-3 md:col-span-2" placeholder="Часовой пояс" />
          <textarea
              v-model="form.bio"
              class="min-h-32 rounded-2xl border border-slate-300 px-4 py-3 md:col-span-2"
              placeholder="Расскажите немного о себе"
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
  bio: '',
  timezone: '',
  phone: '',
  city: '',
})

const loadProfile = async () => {
  const { data } = await http.get('/api/student/profile')
  Object.assign(form, data)
}

const saveProfile = async () => {
  await http.put('/api/student/profile', form)
  successMessage.value = 'Профиль успешно обновлён'
}

onMounted(loadProfile)
</script>