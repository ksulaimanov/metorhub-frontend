<template>
  <PrivateLayout>
    <div class="mx-auto max-w-4xl">
      <AppCard>
        <AppSectionTitle
            title="Профиль ученика"
            description="Заполненный профиль помогает быстрее и удобнее записываться на занятия и поддерживать связь с ментором."
        />

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
      </AppCard>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { http } from '../../shared/api/http'
import PrivateLayout from '../../widgets/layout/PrivateLayout.vue'
import AppCard from '../../shared/ui/AppCard.vue'
import AppSectionTitle from '../../shared/ui/AppSectionTitle.vue'

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