<template>
  <PrivateLayout>
    <div class="space-y-8">
      <AppSectionTitle
          title="Записи учеников"
          description="Подтверждайте занятия, переносите их при необходимости и отмечайте завершённые уроки."
      />

      <AppLoadingState v-if="loading" text="Загружаем записи..." />

      <AppErrorState
          v-else-if="error"
          title="Не удалось загрузить записи"
          :description="error"
      />

      <AppEmptyState
          v-else-if="bookings.length === 0"
          title="Пока нет записей"
          description="Когда ученики начнут записываться к вам, здесь появится список занятий."
      />

      <div v-else class="grid gap-4">
        <AppCard v-for="booking in bookings" :key="booking.id">
          <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div class="space-y-3">
                <div class="flex flex-wrap items-center gap-3">
                  <h3 class="text-lg font-semibold text-slate-900">
                    {{ formatDate(booking.startAt) }}
                  </h3>

                  <AppBadge :variant="statusVariant(booking.status)">
                    {{ formatStatus(booking.status) }}
                  </AppBadge>
                </div>

                <p class="text-sm text-slate-600">
                  {{ formatTime(booking.startAt) }} — {{ formatTime(booking.endAt) }}
                </p>

                <div class="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <p>
                    <span class="font-medium text-slate-800">Начало:</span>
                    {{ formatDateTime(booking.startAt) }}
                  </p>
                  <p>
                    <span class="font-medium text-slate-800">Окончание:</span>
                    {{ formatDateTime(booking.endAt) }}
                  </p>
                </div>

                <div
                    v-if="booking.studentNote"
                    class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200"
                >
                  <span class="font-medium text-slate-900">Комментарий ученика:</span>
                  {{ booking.studentNote }}
                </div>
              </div>

              <div class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200">
                <p>
                  <span class="font-medium text-slate-900">ID записи:</span>
                  #{{ booking.id }}
                </p>
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              <button
                  v-if="canConfirm(booking.status)"
                  class="rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="updatingId === booking.id"
                  @click="updateStatus(booking.id, 'CONFIRMED')"
              >
                {{ updatingId === booking.id ? 'Обновление...' : 'Подтвердить' }}
              </button>

              <button
                  v-if="canComplete(booking.status)"
                  class="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="updatingId === booking.id"
                  @click="updateStatus(booking.id, 'COMPLETED')"
              >
                {{ updatingId === booking.id ? 'Обновление...' : 'Завершить' }}
              </button>

              <button
                  v-if="canCancel(booking.status)"
                  class="rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="updatingId === booking.id"
                  @click="updateStatus(booking.id, 'CANCELLED_BY_MENTOR')"
              >
                {{ updatingId === booking.id ? 'Обновление...' : 'Отменить' }}
              </button>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </PrivateLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { http } from '../../shared/api/http'
import { useToastStore } from '../../shared/lib/getApiErrorMessage'
import { useErrorHandler } from '../../shared/composables/useErrorHandler'
import PrivateLayout from '../../widgets/layout/PrivateLayout.vue'
import AppSectionTitle from '../../shared/ui/AppSectionTitle.vue'
import AppEmptyState from '../../shared/ui/AppEmptyState.vue'
import AppCard from '../../shared/ui/AppCard.vue'
import AppBadge from '../../shared/ui/AppBadge.vue'
import AppLoadingState from '../../shared/ui/AppLoadingState.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'

const toastStore = useToastStore()
const { handleError } = useErrorHandler()

interface Booking {
  id: number
  startAt: string
  endAt: string
  status: string
  studentNote: string | null
}

const bookings = ref<Booking[]>([])
const loading = ref(false)
const error = ref('')
const updatingId = ref<number | null>(null)

const loadBookings = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data } = await http.get('/api/mentor/bookings')
    bookings.value = data
  } catch (e) {
    console.error(e)
    error.value = 'Попробуйте обновить страницу чуть позже.'
  } finally {
    loading.value = false
  }
}

const updateStatus = async (bookingId: number, status: string) => {
  if (status === 'CANCELLED_BY_MENTOR') {
    if (!window.confirm('Вы уверены? Запись будет отменена.')) {
      return
    }
  }

  updatingId.value = bookingId

  try {
    await http.patch(`/api/mentor/bookings/${bookingId}/status`, {
      status,
      mentorNote: '',
    })

    const statusMessages: Record<string, string> = {
      CONFIRMED: 'Запись подтверждена.',
      COMPLETED: 'Запись отмечена как завершённая.',
      CANCELLED_BY_MENTOR: 'Запись отменена.',
    }

    toastStore.success(statusMessages[status] || 'Статус обновлён.')
    await loadBookings()
  } catch (e) {
    console.error(e)
    handleError(e as any, 'Не удалось обновить статус записи.')
  } finally {
    updatingId.value = null
  }
}

const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('ru-RU', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

const formatTime = (value: string) =>
    new Date(value).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    })

const formatStatus = (value: string) => {
  const map: Record<string, string> = {
    PENDING: 'Ожидает подтверждения',
    CONFIRMED: 'Подтверждено',
    CANCELLED_BY_STUDENT: 'Отменено учеником',
    CANCELLED_BY_MENTOR: 'Отменено ментором',
    COMPLETED: 'Завершено',
  }

  return map[value] || value
}

const statusVariant = (
    value: string
): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
  const map: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    CANCELLED_BY_STUDENT: 'danger',
    CANCELLED_BY_MENTOR: 'danger',
    COMPLETED: 'info',
  }

  return map[value] || 'default'
}

const canConfirm = (status: string) => status === 'PENDING'
const canComplete = (status: string) => status === 'CONFIRMED'
const canCancel = (status: string) => status === 'PENDING' || status === 'CONFIRMED'

onMounted(loadBookings)
</script>