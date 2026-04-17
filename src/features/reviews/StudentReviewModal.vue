<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="close" />
        <div class="relative w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-6 shadow-xl ring-1 ring-border-brand/80">
          <button
              class="absolute right-4 top-4 rounded-full p-1.5 text-text-muted transition hover:bg-surface-secondary hover:text-white"
              @click="close"
          >
            <X class="h-5 w-5" />
          </button>

          <h2 class="text-xl font-bold text-text-primary mb-2">Оставьте отзыв</h2>
          <p class="text-sm text-slate-400 mb-6">Поделитесь впечатлениями о прошедшем уроке</p>

          <div class="grid gap-4">
            <div>
              <label class="block text-sm font-medium text-text-primary mb-1.5">Рейтинг</label>
              <div class="flex items-center gap-2">
                <button
                  v-for="star in 5"
                  :key="star"
                  class="p-1 rounded-md hover:bg-surface-secondary transition-colors"
                  @click="rating = star"
                >
                  <Star
                    class="h-8 w-8 transition-colors duration-200"
                    :class="star <= rating ? 'fill-amber-400 text-amber-400' : 'text-border-brand'"
                  />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-text-primary mb-1.5">Комментарий</label>
              <textarea
                  v-model="comment"
                  class="min-h-24 w-full rounded-xl border border-border-brand bg-surface px-4 py-3 text-sm outline-none transition placeholder:text-slate-400/60 focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="Расскажите, что вам понравилось..."
              />
            </div>

            <div class="flex flex-col gap-3">
              <AppButton size="md" :loading="loading" @click="submit">
                Отправить отзыв
              </AppButton>
              <p v-if="errorMsg" class="text-sm font-medium text-red-600">{{ errorMsg }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { X, Star } from 'lucide-vue-next'
import { useNotificationStore } from '../../stores/notificationStore'
import { createStudentReview } from '../../shared/api/reviewApi'
import { useToastStore } from '../../shared/lib/getApiErrorMessage'
import AppButton from '../../shared/ui/AppButton.vue'

const notificationStore = useNotificationStore()
const toastStore = useToastStore()

const isOpen = computed(() => notificationStore.isReviewModalOpen)
const bookingId = computed(() => notificationStore.reviewBookingId)

const rating = ref(5)
const comment = ref('')
const loading = ref(false)
const errorMsg = ref('')

const close = () => {
  notificationStore.closeReviewModal()
}

watch(isOpen, (newVal) => {
  if (newVal) {
    rating.value = 5
    comment.value = ''
    errorMsg.value = ''
  }
})

const submit = async () => {
  if (!bookingId.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    await createStudentReview({ bookingId: bookingId.value, rating: rating.value, comment: comment.value })
    toastStore.success('Спасибо за ваш отзыв!')
    close()
  } catch (err: any) {
    errorMsg.value = err?.response?.data?.message || 'Ошибка отправки отзыва'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

