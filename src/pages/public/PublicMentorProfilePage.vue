<template>
  <PublicLayout>
    <section class="mx-auto max-w-7xl px-6 py-12">
      <AppLoadingState v-if="loading" text="Загружаем профиль ментора..." />

      <AppErrorState
          v-else-if="error"
          title="Не удалось загрузить профиль ментора"
          :description="error"
      />

      <template v-else-if="mentor">
        <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div class="space-y-6">
            <div class="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
              <div class="flex flex-col gap-6 md:flex-row md:items-start">
                <div class="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-3xl font-bold text-slate-600">
                  <img
                      v-if="mentor.avatarUrl"
                      :src="mentor.avatarUrl"
                      :alt="mentorName"
                      class="h-full w-full object-cover"
                  />
                  <span v-else>{{ mentorInitials }}</span>
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-3">
                    <h1 class="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                      {{ mentorName }}
                    </h1>

                    <AppBadge v-if="mentor.verified" variant="success">
                      Проверен
                    </AppBadge>
                  </div>

                  <p class="mt-3 text-lg text-slate-600">
                    {{ mentor.headline || 'Ментор MentorHub' }}
                  </p>

                  <div class="mt-5 flex flex-wrap gap-2">
                    <AppBadge v-if="mentor.lessonFormatOnline">Онлайн</AppBadge>
                    <AppBadge v-if="mentor.lessonFormatOffline">Офлайн</AppBadge>
                    <AppBadge v-if="mentor.lessonFormatHybrid">Гибрид</AppBadge>
                  </div>

                  <div class="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div class="rounded-2xl bg-slate-50 p-4">
                      <p class="text-sm text-slate-500">Специализация</p>
                      <p class="mt-1 font-semibold text-slate-900">
                        {{ mentor.specialization || 'Не указана' }}
                      </p>
                    </div>

                    <div class="rounded-2xl bg-slate-50 p-4">
                      <p class="text-sm text-slate-500">Опыт</p>
                      <p class="mt-1 font-semibold text-slate-900">
                        {{ mentor.yearsExperience ?? 0 }} лет
                      </p>
                    </div>

                    <div class="rounded-2xl bg-slate-50 p-4">
                      <p class="text-sm text-slate-500">Рейтинг</p>
                      <p class="mt-1 font-semibold text-slate-900">
                        {{ mentor.averageRating ?? 0 }}
                      </p>
                    </div>

                    <div class="rounded-2xl bg-slate-50 p-4">
                      <p class="text-sm text-slate-500">Проведено занятий</p>
                      <p class="mt-1 font-semibold text-slate-900">
                        {{ mentor.lessonsCompleted ?? 0 }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <AppCard>
              <h2 class="text-xl font-semibold text-slate-900">О менторе</h2>
              <p class="mt-4 whitespace-pre-line leading-8 text-slate-600">
                {{ mentor.bio || 'Описание пока не добавлено.' }}
              </p>
            </AppCard>

            <AppCard>
              <h2 class="text-xl font-semibold text-slate-900">Детали занятий</h2>

              <div class="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <p class="text-sm text-slate-500">Город</p>
                  <p class="mt-1 font-medium text-slate-900">
                    {{ mentor.city || 'Не указан' }}
                  </p>
                </div>

                <div>
                  <p class="text-sm text-slate-500">Стоимость</p>
                  <p class="mt-1 font-medium text-slate-900">
                    {{ mentor.pricePerHour ? `${mentor.pricePerHour} сом/час` : 'Не указана' }}
                  </p>
                </div>

                <div v-if="mentor.addressText">
                  <p class="text-sm text-slate-500">Адрес</p>
                  <p class="mt-1 font-medium text-slate-900">
                    {{ mentor.addressText }}
                  </p>
                </div>

                <div v-if="mentor.meetingLink">
                  <p class="text-sm text-slate-500">Ссылка на встречу</p>
                  <a
                      :href="mentor.meetingLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="mt-1 inline-block break-all font-medium text-slate-900 underline underline-offset-4"
                  >
                    {{ mentor.meetingLink }}
                  </a>
                </div>
              </div>
            </AppCard>
          </div>

          <div class="space-y-6">
            <AppCard>
              <h2 class="text-xl font-semibold text-slate-900">Запись на занятие</h2>
              <p class="mt-3 text-slate-600">
                Выберите доступный слот и отправьте заявку на занятие с этим ментором.
              </p>

              <div class="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p class="text-sm text-slate-500">Форматы занятий</p>
                <div class="mt-3 flex flex-wrap gap-2">
                  <AppBadge v-if="mentor.lessonFormatOnline">Онлайн</AppBadge>
                  <AppBadge v-if="mentor.lessonFormatOffline">Офлайн</AppBadge>
                  <AppBadge v-if="mentor.lessonFormatHybrid">Гибрид</AppBadge>
                </div>
              </div>

              <button
                  type="button"
                  class="mt-6 w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  @click="scrollToSlots"
              >
                Посмотреть доступные слоты
              </button>
            </AppCard>

            <AppCard id="slots">
              <h2 class="text-xl font-semibold text-slate-900">Доступные слоты</h2>

              <AppLoadingState
                  v-if="slotsLoading"
                  text="Загружаем доступные слоты..."
              />

              <AppErrorState
                  v-else-if="slotsError"
                  title="Не удалось загрузить слоты"
                  :description="slotsError"
              />

              <AppEmptyState
                  v-else-if="slots.length === 0"
                  title="Свободных слотов пока нет"
                  description="Попробуйте зайти позже или выбрать другого ментора."
              />

              <div v-else class="mt-5 grid gap-4">
                <AppCard
                    v-for="slot in slots"
                    :key="slot.id"
                >
                  <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p class="text-lg font-semibold text-slate-900">
                        {{ formatDateTime(slot.startAt) }} — {{ formatDateTime(slot.endAt) }}
                      </p>

                      <div class="mt-3 flex flex-wrap gap-2">
                        <AppBadge>{{ formatLessonFormat(slot.lessonFormat) }}</AppBadge>
                        <AppBadge :variant="slot.active ? 'success' : 'danger'">
                          {{ slot.active ? 'Доступен' : 'Недоступен' }}
                        </AppBadge>
                      </div>
                    </div>

                    <button
                        type="button"
                        class="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="bookingLoadingId === slot.id || !slot.active"
                        @click="bookSlot(slot.id)"
                    >
                      {{
                        bookingLoadingId === slot.id
                            ? 'Отправка...'
                            : slot.active
                                ? 'Записаться'
                                : 'Недоступно'
                      }}
                    </button>
                  </div>
                </AppCard>
              </div>

              <p v-if="bookingMessage" class="mt-4 text-sm font-medium text-emerald-600">
                {{ bookingMessage }}
              </p>
              <p v-if="bookingError" class="mt-4 text-sm font-medium text-red-600">
                {{ bookingError }}
              </p>
            </AppCard>
          </div>
        </div>
      </template>
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { http } from '../../shared/api/http'
import PublicLayout from '../../widgets/layout/PublicLayout.vue'
import AppCard from '../../shared/ui/AppCard.vue'
import AppBadge from '../../shared/ui/AppBadge.vue'
import AppLoadingState from '../../shared/ui/AppLoadingState.vue'
import AppErrorState from '../../shared/ui/AppErrorState.vue'
import AppEmptyState from '../../shared/ui/AppEmptyState.vue'

interface MentorProfile {
  id: number
  userId: number
  firstName: string | null
  lastName: string | null
  avatarKey?: string | null
  avatarUrl?: string | null
  headline: string | null
  bio: string | null
  specialization: string | null
  yearsExperience: number | null
  lessonFormatOnline: boolean
  lessonFormatOffline: boolean
  lessonFormatHybrid: boolean
  city: string | null
  addressText: string | null
  meetingLink: string | null
  pricePerHour: number | null
  averageRating: number | null
  lessonsCompleted: number | null
  verified: boolean
}

interface Slot {
  id: number
  mentorId: number
  startAt: string
  endAt: string
  timezone: string
  lessonFormat: string
  meetingLink: string | null
  addressText: string | null
  active: boolean
}

const route = useRoute()
const router = useRouter()

const mentor = ref<MentorProfile | null>(null)
const loading = ref(false)
const error = ref('')

const slots = ref<Slot[]>([])
const slotsLoading = ref(false)
const slotsError = ref('')

const bookingLoadingId = ref<number | null>(null)
const bookingMessage = ref('')
const bookingError = ref('')

const mentorId = Number(route.params.id)

const mentorName = computed(() => {
  if (!mentor.value) return 'Ментор'
  const full = `${mentor.value.firstName || ''} ${mentor.value.lastName || ''}`.trim()
  return full || 'Без имени'
})

const mentorInitials = computed(() => {
  if (!mentor.value) return 'M'
  const first = mentor.value.firstName?.trim()?.[0] || ''
  const last = mentor.value.lastName?.trim()?.[0] || ''
  return (first + last).toUpperCase() || 'M'
})

const loadMentor = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data } = await http.get(`/api/public/mentors/${mentorId}`)
    mentor.value = data
  } catch (e) {
    console.error(e)
    error.value = 'Попробуйте обновить страницу чуть позже.'
  } finally {
    loading.value = false
  }
}

const loadSlots = async () => {
  slotsLoading.value = true
  slotsError.value = ''

  try {
    const { data } = await http.get(`/api/public/mentors/${mentorId}/slots`)
    slots.value = data
  } catch (e) {
    console.error(e)
    slotsError.value = 'Не удалось загрузить доступные слоты.'
  } finally {
    slotsLoading.value = false
  }
}

const bookSlot = async (slotId: number) => {
  bookingLoadingId.value = slotId
  bookingError.value = ''
  bookingMessage.value = ''

  try {
    await http.post('/api/student/bookings', {
      availabilitySlotId: slotId,
      studentNote: '',
    })

    bookingMessage.value = 'Заявка на занятие успешно отправлена.'
    await loadSlots()
  } catch (e: any) {
    console.error(e)

    const status = e?.response?.status
    if (status === 401 || status === 403) {
      await router.push('/login')
      return
    }

    bookingError.value =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Не удалось записаться на слот.'
  } finally {
    bookingLoadingId.value = null
  }
}

const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('ru-RU', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })

const formatLessonFormat = (value: string) => {
  const map: Record<string, string> = {
    ONLINE: 'Онлайн',
    OFFLINE: 'Офлайн',
    HYBRID: 'Гибрид',
  }
  return map[value] || value
}

const scrollToSlots = () => {
  document.getElementById('slots')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(async () => {
  await loadMentor()
  await loadSlots()
})
</script>