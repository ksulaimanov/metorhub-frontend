<template>
  <PrivateLayout>
    <div class="space-y-8">
      <AppSectionTitle
          :title="t('mentorSlots.title')"
          :description="t('mentorSlots.description')"
      />

      <AppCard>
        <form class="grid gap-4 md:grid-cols-2" @submit.prevent="createSlot">
          <input
              v-model="form.startAt"
              type="datetime-local"
              class="rounded-2xl border border-border-brand px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
          />

          <input
              v-model="form.endAt"
              type="datetime-local"
              class="rounded-2xl border border-border-brand px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
          />

          <input
              v-model="form.timezone"
              class="rounded-2xl border border-border-brand px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
              :placeholder="t('mentorSlots.timezonePlaceholder')"
          />

          <select
              v-model="form.lessonFormat"
              class="rounded-2xl border border-border-brand px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
          >
            <option value="ONLINE">{{ t('common.lessonFormat.ONLINE') }}</option>
            <option value="OFFLINE">{{ t('common.lessonFormat.OFFLINE') }}</option>
            <option value="HYBRID">{{ t('common.lessonFormat.HYBRID') }}</option>
          </select>

          <input
              v-model.number="form.capacity"
              type="number"
              min="1"
              class="rounded-2xl border border-border-brand px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
              :placeholder="t('mentorSlots.capacityPlaceholder')"
          />

          <div class="rounded-2xl bg-surface-secondary px-4 py-3 text-sm text-text-secondary ring-1 ring-border-brand">
            {{ t('mentorSlots.capacityHint') }}
          </div>

          <input
              v-model="form.meetingLink"
              class="rounded-2xl border border-border-brand px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft md:col-span-2"
              :placeholder="t('mentorSlots.meetingLinkPlaceholder')"
          />

          <input
              v-model="form.addressText"
              class="rounded-2xl border border-border-brand px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft md:col-span-2"
              :placeholder="t('mentorSlots.addressPlaceholder')"
          />

          <div v-if="createError" class="md:col-span-2 text-sm font-medium text-danger">
            {{ createError }}
          </div>

          <div v-if="createMessage" class="md:col-span-2 text-sm font-medium text-success">
            {{ createMessage }}
          </div>

          <button
              class="rounded-2xl bg-brand px-4 py-3 font-semibold text-on-brand transition hover:bg-brand-hover md:col-span-2 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="creating"
          >
            {{ creating ? t('mentorSlots.creating') : t('mentorSlots.createSlot') }}
          </button>
        </form>
      </AppCard>

      <AppLoadingState v-if="loading" :text="t('mentorSlots.loadingSlots')" />

      <AppErrorState
          v-else-if="pageError"
          :title="t('mentorSlots.loadError')"
          :description="pageError"
      />

      <AppEmptyState
          v-else-if="slots.length === 0"
          :title="t('mentorSlots.emptyTitle')"
          :description="t('mentorSlots.emptyDesc')"
      />

      <div v-else class="grid gap-4">
        <AppCard v-for="slot in slots" :key="slot.id">
          <div class="space-y-4">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-lg font-semibold text-white">
                  {{ formatDateTime(slot.startAt) }} — {{ formatDateTime(slot.endAt) }}
                </p>

                <div class="mt-3 flex flex-wrap gap-3">
                  <AppBadge>{{ t(`common.lessonFormat.${slot.lessonFormat}`, slot.lessonFormat) }}</AppBadge>

                  <AppBadge :variant="slot.active ? 'success' : 'danger'">
                    {{ slot.active ? t('mentorSlots.active') : t('mentorSlots.inactive') }}
                  </AppBadge>

                  <AppBadge variant="info">
                    {{ t('mentorSlots.seats') }}: {{ slot.capacity }}
                  </AppBadge>

                  <AppBadge variant="warning">
                    {{ t('mentorSlots.booked') }}: {{ slot.bookedCount }}
                  </AppBadge>

                  <AppBadge :variant="slot.availableSeats > 0 ? 'success' : 'danger'">
                    {{ t('mentorSlots.available') }}: {{ slot.availableSeats }}
                  </AppBadge>
                </div>
              </div>

              <div class="flex flex-wrap gap-3">
                <button
                    class="rounded-2xl border border-border-brand px-4 py-2 text-sm transition hover:bg-brand-soft"
                    @click="toggleEdit(slot)"
                >
                  {{ editingSlotId === slot.id ? t('mentorSlots.hide') : t('mentorSlots.edit') }}
                </button>

                <button
                    v-if="slot.active"
                    class="rounded-2xl border border-border-brand px-4 py-2 text-sm transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="deactivatingId === slot.id"
                    @click="deactivateSlot(slot.id)"
                >
                  {{ deactivatingId === slot.id ? t('mentorSlots.deactivating') : t('mentorSlots.deactivate') }}
                </button>
              </div>
            </div>

            <div
                v-if="editingSlotId === slot.id"
                class="rounded-2xl border border-border-brand bg-surface-secondary p-4"
            >
              <form class="grid gap-4 md:grid-cols-2" @submit.prevent="updateSlot(slot.id)">
                <input v-model="editForm.startAt" type="datetime-local" class="rounded-2xl border border-border-brand px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft" />
                <input v-model="editForm.endAt" type="datetime-local" class="rounded-2xl border border-border-brand px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft" />
                <input v-model="editForm.timezone" class="rounded-2xl border border-border-brand px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft" :placeholder="t('mentorSlots.timezonePlaceholder')" />

                <select v-model="editForm.lessonFormat" class="rounded-2xl border border-border-brand px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft">
                  <option value="ONLINE">{{ t('common.lessonFormat.ONLINE') }}</option>
                  <option value="OFFLINE">{{ t('common.lessonFormat.OFFLINE') }}</option>
                  <option value="HYBRID">{{ t('common.lessonFormat.HYBRID') }}</option>
                </select>

                <input v-model.number="editForm.capacity" type="number" min="1" class="rounded-2xl border border-border-brand px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft" :placeholder="t('mentorSlots.capacityPlaceholder')" />

                <label class="flex items-center gap-3 rounded-2xl border border-border-brand bg-surface px-4 py-3">
                  <input v-model="editForm.active" type="checkbox" class="accent-brand" />
                  <span class="text-sm font-medium text-text-primary">{{ t('mentorSlots.slotActive') }}</span>
                </label>

                <input v-model="editForm.meetingLink" class="rounded-2xl border border-border-brand px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft md:col-span-2" :placeholder="t('mentorSlots.meetingLinkPlaceholder')" />
                <input v-model="editForm.addressText" class="rounded-2xl border border-border-brand px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft md:col-span-2" :placeholder="t('mentorSlots.addressPlaceholder')" />

                <div v-if="editError" class="md:col-span-2 text-sm font-medium text-danger">{{ editError }}</div>
                <div v-if="editMessage" class="md:col-span-2 text-sm font-medium text-success">{{ editMessage }}</div>

                <button
                    class="rounded-2xl bg-brand px-4 py-3 font-semibold text-on-brand transition hover:bg-brand-hover md:col-span-2 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="updatingId === slot.id"
                >
                  {{ updatingId === slot.id ? t('mentorSlots.saving') : t('mentorSlots.saveChanges') }}
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
import { useI18n } from 'vue-i18n'
import { http } from '@/shared/api/http'
import { useToastStore } from '@/shared/model/toastStore'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { formatDateTimeForDisplay } from '@/shared/lib/dateFormatter'
import PrivateLayout from '@/widgets/layout/PrivateLayout.vue'
import AppSectionTitle from '@/shared/ui/AppSectionTitle.vue'
import AppCard from '@/shared/ui/AppCard.vue'
import AppEmptyState from '@/shared/ui/AppEmptyState.vue'
import AppBadge from '@/shared/ui/AppBadge.vue'
import AppLoadingState from '@/shared/ui/AppLoadingState.vue'
import AppErrorState from '@/shared/ui/AppErrorState.vue'

const { t } = useI18n()
const toastStore = useToastStore()
const { handleError } = useErrorHandler()


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
    console.error(error)
    pageError.value = t('mentorSlots.pageLoadError')
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
    toastStore.success(t('mentorSlots.createSuccess'))
    await loadSlots()
  } catch (error: any) {
    console.error(error)
    createError.value = handleError(error, t('mentorSlots.createError'))
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
    toastStore.success(t('mentorSlots.updateSuccess'))
    await loadSlots()
  } catch (error: any) {
    console.error(error)
    handleError(error, t('mentorSlots.updateError'))
  } finally {
    updatingId.value = null
  }
}

const deactivateSlot = async (slotId: number) => {
  deactivatingId.value = slotId

  try {
    await http.patch(`/api/mentor/availability-slots/${slotId}/deactivate`)
    toastStore.success(t('mentorSlots.deactivateSuccess'))
    await loadSlots()
  } catch (error) {
    console.error(error)
    handleError(error as any, t('mentorSlots.deactivateError'))
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

const formatDateTime = (value: string) => formatDateTimeForDisplay(value)


onMounted(loadSlots)
</script>
