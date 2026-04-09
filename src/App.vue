<template>
  <div>
    <AppLogo style="margin: 2rem auto; display: flex; justify-content: center;" />
    <RouterView />
    <AppToastContainer />
  </div>
</template>

<script setup lang="ts">
import AppToastContainer from './shared/ui/AppToastContainer.vue'
import AppLogo from './components/AppLogo.vue'
</script>