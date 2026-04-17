<template>
  <div>
    <RouterView />
    <AppToastContainer />
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import AppToastContainer from './shared/ui/AppToastContainer.vue'
import { useAuthStore } from '@/stores/authStore'
import { notificationService } from '@/shared/api/notificationService'

const authStore = useAuthStore()

watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    notificationService.connect()
  } else {
    notificationService.disconnect()
  }
}, { immediate: true })

onUnmounted(() => {
  notificationService.disconnect()
})
</script>
