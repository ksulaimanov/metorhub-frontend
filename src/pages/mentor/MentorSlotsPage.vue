<template>
  <PrivateLayout>
    <div class="space-y-8">
      <AppSectionTitle
          title="Слоты ментора"
          description="Управляйте доступным временем для записи учеников."
      />

      <AppCard>
        <form class="grid gap-4 md:grid-cols-2" @submit.prevent="createSlot">
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
      </AppCard>

      <AppEmptyState
          v-if="slots.length === 0"
          title="Слоты пока не созданы"
          description="Создайте первый слот, чтобы ученики могли записываться на занятия."
      />

      <div v-else class="grid gap-4">
        <AppCard v-for="slot in slots" :key="slot.id">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-lg font-semibold text-slate-900">{{ formatDateTime(slot.startAt) }} — {{ formatDateTime(slot.endAt) }}</p>
              <div class="mt-3 flex flex-wrap gap-3">
                <AppBadge>{{ formatLessonFormat(slot.lessonFormat) }}</AppBadge>
                <AppBadge :variant="slot.active ? 'success' : 'danger'">
                  {{ slot.active ? 'Активен' : 'Неактивен' }}
                </AppBadge>
              </div>
            </div>

            <button
                v-if="slot.active"
                class="rounded-2xl border border-slate-300 px-4 py-2 transition hover:bg-slate-100"
                @click="deactivateSlot(slot.id)"
            >
              Деактивировать
            </button>
          </div>
        </AppCard>
      </div>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { http } from '../../shared/api/http'
import PrivateLayout from '../../widgets/layout/PrivateLayout.vue'
import AppSectionTitle from '../../shared/ui/AppSectionTitle.vue'
import AppCard from '../../shared/ui/AppCard.vue'
import AppEmptyState from '../../shared/ui/AppEmptyState.vue'
import AppBadge from '../../shared/ui/AppBadge.vue'

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

const formatDateTime = (value: string) => new Date(value).toLocaleString('ru-RU')

const formatLessonFormat = (value: string) => {
  const map: Record<string, string> = {
    ONLINE: 'Онлайн',
    OFFLINE: 'Офлайн',
    HYBRID: 'Гибрид',
  }
  return map[value] || value
}

onMounted(loadSlots)
</script>