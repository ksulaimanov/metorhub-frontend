<template>
  <div class="min-h-screen bg-slate-50">
    <PrivateHeader />
    <div class="mx-auto max-w-6xl px-6 py-10">
      <h1 class="text-3xl font-bold text-slate-900">Мои занятия</h1>

      <div class="mt-8 grid gap-4">
        <div
            v-for="booking in bookings"
            :key="booking.id"
            class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-lg font-semibold text-slate-900">{{ booking.startAt }} — {{ booking.endAt }}</p>
              <p class="mt-2 text-slate-600">Формат: {{ booking.lessonFormat }}</p>
              <p class="mt-1 text-slate-600">Статус: {{ booking.status }}</p>
              <p v-if="booking.studentNote" class="mt-1 text-slate-600">Ваш комментарий: {{ booking.studentNote }}</p>
            </div>

            <button
                v-if="booking.status === 'PENDING' || booking.status === 'CONFIRMED'"
                class="rounded-2xl border border-red-300 px-4 py-2 text-red-600"
                @click="cancelBooking(booking.id)"
            >
              Отменить
            </button>
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
  lessonFormat: string
  status: string
  studentNote: string | null
}

const bookings = ref<Booking[]>([])

const loadBookings = async () => {
  const { data } = await http.get('/api/student/bookings')
  bookings.value = data
}

const cancelBooking = async (bookingId: number) => {
  await http.patch(`/api/student/bookings/${bookingId}/cancel`)
  await loadBookings()
}

onMounted(loadBookings)
</script>