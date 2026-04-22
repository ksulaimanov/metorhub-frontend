<template>
  <div class="relative">
    <button
        class="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand transition hover:bg-brand-soft/80"
        @click="isOpen = !isOpen"
    >
      <Bell class="h-5 w-5" />
      <span v-if="notificationStore.unreadCount > 0" class="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
        {{ notificationStore.unreadCount }}
      </span>
    </button>

    <Transition name="slide-up">
      <div v-if="isOpen" class="absolute right-0 top-12 w-80 rounded-2xl bg-surface p-4 shadow-xl ring-1 ring-border-brand/80 sm:w-96 z-50 origin-top-right backdrop-blur-3xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-text-primary">{{ t('notifications.title') }}</h3>
          <button class="text-xs text-brand hover:underline" @click="markAllAsRead">{{ t('notifications.markAllAsRead') }}</button>
        </div>

        <div v-if="notificationStore.notifications.length === 0" class="py-8 text-center text-sm text-text-muted">
          {{ t('notifications.empty') }}
        </div>

        <div v-else class="flex max-h-[320px] flex-col gap-2 overflow-y-auto">
          <div
              v-for="notif in notificationStore.notifications"
              :key="notif.id"
              class="group relative flex cursor-pointer gap-3 rounded-xl p-3 transition"
              :class="notif.isRead ? 'bg-surface-secondary opacity-70' : 'bg-brand-soft/30 hover:bg-brand-soft/50 ring-1 ring-brand/20'"
              @click="handleNotificationClick(notif)"
          >
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface shadow-sm ring-1 ring-border-brand/40">
              <Star v-if="notif.type === 'REVIEW_REMINDER'" class="h-5 w-5 text-amber-500" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-text-primary" :class="!notif.isRead && 'text-brand'">{{ notif.title }}</p>
              <p class="mt-0.5 text-xs text-text-secondary line-clamp-2">
                {{ notif.message }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Overlay array -->
    <div v-if="isOpen" class="fixed inset-0 z-40 bg-transparent" @click="isOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Bell, Star } from 'lucide-vue-next'
import { useNotificationStore, type NotificationDto } from '@/entities/notification/model/notificationStore'

const { t } = useI18n()
const isOpen = ref(false)
const notificationStore = useNotificationStore()

const handleNotificationClick = (notif: NotificationDto) => {
  notificationStore.markAsRead(notif.id)
  isOpen.value = false
  if (notif.type === 'REVIEW_REMINDER' && typeof notif.payload?.bookingId === 'number') {
    notificationStore.openReviewModal(notif.payload.bookingId)
  }
}

const markAllAsRead = () => {
  notificationStore.notifications.forEach(n => notificationStore.markAsRead(n.id))
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>
