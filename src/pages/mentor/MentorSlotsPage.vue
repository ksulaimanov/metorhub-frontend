<template>
  <div class="min-h-screen bg-slate-50">
    <PrivateHeader />
    <div class="mx-auto max-w-6xl px-6 py-10">
      <h1 class="text-3xl font-bold text-slate-900">Слоты ментора</h1>

      <form class="mt-8 grid gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2" @submit.prevent="createSlot">
        <input v-model="form.startAt" type="datetime-local" class="rounded-2xl border border-slate-300 px-4 py-3" />
        <input v-model="form.endAt" type="datetime-local" class="rounded-2xl border border-slate-300 px-4 py-3" />
        <input v-model="form.timezone" class="rounded-2xl border border-slate-300 px-4 py-3" placeholder="Часовой пояс" />
        <select v-model="form.lessonFormat" class="rounded-2xl border border-slate-300 px-4 py-3">
          <option value="ONLINE">Онлайн</option>
          <option value="OFFLINE">Офлайн</option>
          <option value="HYBRID">Гибрид</option>
        </select>
        <input v-model="form.meetingLink" class="rounded-2xl border border-slate-300 px-4 py-3 md:col-span-2" placeholder="Ссылка на встречу" />
        <input v-model="form.addressText" class="rounded-2xl border border-slate-300 px-4 py-3 md:col-span-2" placeholder="Адрес" />
        <button class="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white md:col-span-2">
          Создать слот
        </button>
      </form>

      <div class="mt-8 grid gap-4">
        <div
            v-for="slot in slots"
            :key="slot.id"
            class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-lg font-semibold text-slate-900">{{ slot.startAt }} — {{ slot.endAt }}</p>
              <p class="mt-1 text-slate-600">Формат: {{ slot.lessonFormat }}</p>
              <p class="mt-1 text-slate-600">Статус: {{ slot.active ? 'Активен' : 'Неактивен' }}</p>
            </div>

            <button
                v-if="slot.active"
                class="rounded-2xl border border-slate-300 px-4 py-2"
                @click="deactivateSlot(slot.id)"
            >
              Деактивировать
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { http } from '../../shared/api/http'
import PrivateHeader from '../../widgets/header/PrivateHeader.vue'

interface Slot {
  id: number
  startAt: string
  endAt: string
  lessonFormat: string
  active: boolean
}

const slots = ref<Slot[]>([])

const form = reactive({
  startAt: '',
  endAt: '',
  timezone: 'Asia/Bishkek',
  lessonFormat: 'ONLINE',
  meetingLink: '',
  addressText: '',
})

const loadSlots = async () => {
  const { data } = await http.get('/api/mentor/availability-slots')
  slots.value = data
}

const createSlot = async () => {
  await http.post('/api/mentor/availability-slots', form)
  form.startAt = ''
  form.endAt = ''
  form.meetingLink = ''
  form.addressText = ''
  await loadSlots()
}

const deactivateSlot = async (slotId: number) => {
  await http.patch(`/api/mentor/availability-slots/${slotId}/deactivate`)
  await loadSlots()
}

onMounted(loadSlots)
</script>