<template>
  <div class="min-h-screen bg-slate-50">
    <PrivateHeader />
    <div class="mx-auto max-w-6xl px-6 py-10">
      <h1 class="text-3xl font-bold text-slate-900">Записи учеников</h1>

      <div class="mt-8 grid gap-4">
        <div
            v-for="booking in bookings"
            :key="booking.id"
            class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex flex-col gap-4">
            <div>
              <p class="text-lg font-semibold text-slate-900">{{ booking.startAt }} — {{ booking.endAt }}</p>
              <p class="mt-1 text-slate-600">Статус: {{ booking.status }}</p>
              <p v-if="booking.studentNote" class="mt-1 text-slate-600">Комментарий ученика: {{ booking.studentNote }}</p>
            </div>

            <div class="flex flex-wrap gap-3">
              <button
                  class="rounded-2xl bg-emerald-600 px-4 py-2 text-white"
                  @click="updateStatus(booking.id, 'CONFIRMED')"
              >
                Подтвердить
              </button>

              <button
                  class="rounded-2xl bg-red-600 px-4 py-2 text-white"
                  @click="updateStatus(booking.id, 'CANCELLED_BY_MENTOR')"
              >
                Отменить
              </button>

              <button
                  class="rounded-2xl bg-slate-900 px-4 py-2 text-white"
                  @click="updateStatus(booking.id, 'COMPLETED')"
              >
                Завершить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { http } from '../../shared/api/http'
import PrivateHeader from '../../widgets/header/PrivateHeader.vue'

interface Booking {
  id: number
  startAt: string
  endAt: string
  status: string
  studentNote: string | null
}

const bookings = ref<Booking[]>([])

const loadBookings = async () => {
  const { data } = await http.get('/api/mentor/bookings')
  bookings.value = data
}

const updateStatus = async (bookingId: number, status: string) => {
  await http.patch(`/api/mentor/bookings/${bookingId}/status`, {
    status,
    mentorNote: '',
  })
  await loadBookings()
}

onMounted(loadBookings)
</script>