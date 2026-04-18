<template>
  <div>
    <RouterView />
    <AppToastContainer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import AppToastContainer from '@/shared/ui/AppToastContainer.vue'
import { useAuthStore } from '@/entities/auth/model/authStore'
import { notificationService } from '@/shared/api/notificationService'
import { useNotificationStore } from '@/entities/notification/model/notificationStore'
import { useToastStore } from '@/shared/lib/getApiErrorMessage'

const authStore = useAuthStore()

const handleNotification = (notif: any) => {
  const notificationStore = useNotificationStore()
  const toastStore = useToastStore()

  notificationStore.addNotification(notif)
  toastStore.info(`${notif.title}: ${notif.message}`)
}

onMounted(() => {
  notificationService.onNotification(handleNotification)
})

watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    notificationService.connect()
  } else {
    notificationService.disconnect()
  }
}, { immediate: true })

onUnmounted(() => {
  notificationService.offNotification(handleNotification)
  notificationService.disconnect()
})
</script>
