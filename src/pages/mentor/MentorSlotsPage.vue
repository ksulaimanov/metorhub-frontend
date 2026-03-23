<template>
  <PrivateLayout>
    <div class="space-y-8">
      <AppSectionTitle
          title="Слоты ментора"
          description="Управляйте доступным временем для записи учеников. Можно создавать как индивидуальные, так и мини-групповые занятия."
      />

      <AppCard>
        <form class="grid gap-4 md:grid-cols-2" @submit.prevent="createSlot">
          <input
              v-model="form.startAt"
              type="datetime-local"
              class="rounded-2xl border border-slate-300 px-4 py-3"
          />

          <input
              v-model="form.endAt"
              type="datetime-local"
              class="rounded-2xl border border-slate-300 px-4 py-3"
          />

          <input
              v-model="form.timezone"
              class="rounded-2xl border border-slate-300 px-4 py-3"
              placeholder="Часовой пояс"
          />

          <select
              v-model="form.lessonFormat"
              class="rounded-2xl border border-slate-300 px-4 py-3"
          >
            <option value="ONLINE">Онлайн</option>
            <option value="OFFLINE">Офлайн</option>
            <option value="HYBRID">Гибрид</option>
          </select>

          <input
              v-model.number="form.capacity"
              type="number"
              min="1"
              class="rounded-2xl border border-slate-300 px-4 py-3"
              placeholder="Количество мест"
          />

          <div class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200">
            Укажите 1 для индивидуального занятия или больше 1 для мини-группы.
          </div>

          <input
              v-model="form.meetingLink"
              class="rounded-2xl border border-slate-300 px-4 py-3 md:col-span-2"
              placeholder="Ссылка на встречу"
          />

          <input
              v-model="form.addressText"
              class="rounded-2xl border border-slate-300 px-4 py-3 md:col-span-2"
              placeholder="Адрес"
          />

          <div v-if="createError" class="md:col-span-2 text-sm font-medium text-red-600">
            {{ createError }}
          </div>

          <div v-if="createMessage" class="md:col-span-2 text-sm font-medium text-emerald-600">
            {{ createMessage }}
          </div>

          <button
              class="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white md:col-span-2 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="creating"
          >
            {{ creating ? 'Создание...' : 'Создать слот' }}
          </button>
        </form>
      </AppCard>

      <AppLoadingState v-if="loading" text="Загружаем слоты..." />

      <AppErrorState
          v-else-if="pageError"
          title="Не удалось загрузить слоты"
          :description="pageError"
      />

      <AppEmptyState
          v-else-if="slots.length === 0"
          title="Слоты пока не созданы"
          description="Создайте первый слот, чтобы ученики могли записываться на занятия."
      />

      <div v-else class="grid gap-4">
        <AppCard v-for="slot in slots" :key="slot.id">
          <div class="space-y-4">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-lg font-semibold text-slate-900">
                  {{ formatDateTime(slot.startAt) }} — {{ formatDateTime(slot.endAt) }}
                </p>

                <div class="mt-3 flex flex-wrap gap-3">
                  <AppBadge>{{ formatLessonFormat(slot.lessonFormat) }}</AppBadge>

                  <AppBadge :variant="slot.active ? 'success' : 'danger'">
                    {{ slot.active ? 'Активен' : 'Неактивен' }}
                  </AppBadge>

                  <AppBadge variant="info">
                    Мест: {{ slot.capacity }}
                  </AppBadge>

                  <AppBadge variant="warning">
                    Занято: {{ slot.bookedCount }}
                  </AppBadge>

                  <AppBadge :variant="slot.availableSeats > 0 ? 'success' : 'danger'">
                    Свободно: {{ slot.availableSeats }}
                  </AppBadge>
                </div>
              </div>

              <div class="flex flex-wrap gap-3">
                <button
                    class="rounded-2xl border border-slate-300 px-4 py-2 transition hover:bg-slate-100"
                    @click="toggleEdit(slot)"
                >
                  {{ editingSlotId === slot.id ? 'Скрыть' : 'Редактировать' }}
                </button>

                <button
                    v-if="slot.active"
                    class="rounded-2xl border border-slate-300 px-4 py-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="deactivatingId === slot.id"
                    @click="deactivateSlot(slot.id)"
                >
                  {{ deactivatingId === slot.id ? 'Деактивация...' : 'Деактивировать' }}
                </button>
              </div>
            </div>

            <div
                v-if="editingSlotId === slot.id"
                class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <form class="grid gap-4 md:grid-cols-2" @submit.prevent="updateSlot(slot.id)">
                <input
                    v-model="editForm.startAt"
                    type="datetime-local"
                    class="rounded-2xl border border-slate-300 px-4 py-3"
                />

                <input
                    v-model="editForm.endAt"
                    type="datetime-local"
                    class="rounded-2xl border border-slate-300 px-4 py-3"
                />

                <input
                    v-model="editForm.timezone"
                    class="rounded-2xl border border-slate-300 px-4 py-3"
                    placeholder="Часовой пояс"
                />

                <select
                    v-model="editForm.lessonFormat"
                    class="rounded-2xl border border-slate-300 px-4 py-3"
                >
                  <option value="ONLINE">Онлайн</option>
                  <option value="OFFLINE">Офлайн</option>
                  <option value="HYBRID">Гибрид</option>
                </select>

                <input
                    v-model.number="editForm.capacity"
                    type="number"
                    min="1"
                    class="rounded-2xl border border-slate-300 px-4 py-3"
                    placeholder="Количество мест"
                />

                <label class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <input v-model="editForm.active" type="checkbox" />
                  <span class="text-sm font-medium text-slate-700">Слот активен</span>
                </label>

                <input
                    v-model="editForm.meetingLink"
                    class="rounded-2xl border border-slate-300 px-4 py-3 md:col-span-2"
                    placeholder="Ссылка на встречу"
                />

                <input
                    v-model="editForm.addressText"
                    class="rounded-2xl border border-slate-300 px-4 py-3 md:col-span-2"
                    placeholder="Адрес"
                />

                <div v-if="editError" class="md:col-span-2 text-sm font-medium text-red-600">
                  {{ editError }}
                </div>

                <div v-if="editMessage" class="md:col-span-2 text-sm font-medium text-emerald-600">
                  {{ editMessage }}
                </div>

                <button
                    class="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white md:col-span-2 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="updatingId === slot.id"
                >
                  {{ updatingId === slot.id ? 'Сохранение...' : 'Сохранить изменения' }}
                </button>
              </form>
            </div>
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
import AppLoadingState from '../../shared/ui/AppLoadingState.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'

interface Slot {
  id: number
  startAt: string
  endAt: string
  timezone: string
  lessonFormat: string
  meetingLink: string | null
  addressText: string | null
  capacity: number
  bookedCount: number
  availableSeats: number
  active: boolean
}

interface UpdateSlotPayload {
  startAt: string
  endAt: string
  timezone: string
  lessonFormat: string
  meetingLink: string
  addressText: string
  capacity: number
  active: boolean
}

const slots = ref<Slot[]>([])
const loading = ref(false)
const pageError = ref('')

const creating = ref(false)
const createError = ref('')
const createMessage = ref('')

const updatingId = ref<number | null>(null)
const deactivatingId = ref<number | null>(null)
const editingSlotId = ref<number | null>(null)
const editError = ref('')
const editMessage = ref('')

const form = reactive({
  startAt: '',
  endAt: '',
  timezone: 'Asia/Bishkek',
  lessonFormat: 'ONLINE',
  capacity: 1,
  meetingLink: '',
  addressText: '',
})

const editForm = reactive<UpdateSlotPayload>({
  startAt: '',
  endAt: '',
  timezone: 'Asia/Bishkek',
  lessonFormat: 'ONLINE',
  meetingLink: '',
  addressText: '',
  capacity: 1,
  active: true,
})

const loadSlots = async () => {
  loading.value = true
  pageError.value = ''

  try {
    const { data } = await http.get('/api/mentor/availability-slots')
    slots.value = data
  } catch (error) {
    console.error('Ошибка загрузки слотов:', error)
    pageError.value = 'Попробуйте обновить страницу чуть позже.'
  } finally {
    loading.value = false
  }
}

const createSlot = async () => {
  createError.value = ''
  createMessage.value = ''
  creating.value = true

  try {
    await http.post('/api/mentor/availability-slots', form)
    form.startAt = ''
    form.endAt = ''
    form.capacity = 1
    form.meetingLink = ''
    form.addressText = ''
    createMessage.value = 'Слот успешно создан.'
    await loadSlots()
  } catch (error: any) {
    console.error('Ошибка создания слота:', error)
    createError.value =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Не удалось создать слот.'
  } finally {
    creating.value = false
  }
}

const toggleEdit = (slot: Slot) => {
  editError.value = ''
  editMessage.value = ''

  if (editingSlotId.value === slot.id) {
    editingSlotId.value = null
    return
  }

  editingSlotId.value = slot.id
  editForm.startAt = toDateTimeLocalValue(slot.startAt)
  editForm.endAt = toDateTimeLocalValue(slot.endAt)
  editForm.timezone = slot.timezone
  editForm.lessonFormat = slot.lessonFormat
  editForm.meetingLink = slot.meetingLink || ''
  editForm.addressText = slot.addressText || ''
  editForm.capacity = slot.capacity
  editForm.active = slot.active
}

const updateSlot = async (slotId: number) => {
  editError.value = ''
  editMessage.value = ''
  updatingId.value = slotId

  try {
    await http.put(`/api/mentor/availability-slots/${slotId}`, editForm)
    editMessage.value = 'Слот успешно обновлён.'
    await loadSlots()
  } catch (error: any) {
    console.error('Ошибка обновления слота:', error)
    editError.value =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Не удалось обновить слот.'
  } finally {
    updatingId.value = null
  }
}

const deactivateSlot = async (slotId: number) => {
  deactivatingId.value = slotId

  try {
    await http.patch(`/api/mentor/availability-slots/${slotId}/deactivate`)
    await loadSlots()
  } catch (error) {
    console.error('Ошибка деактивации слота:', error)
    pageError.value = 'Не удалось деактивировать слот.'
  } finally {
    deactivatingId.value = null
  }
}

const toDateTimeLocalValue = (value: string) => {
  const date = new Date(value)
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60000)
  return localDate.toISOString().slice(0, 16)
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