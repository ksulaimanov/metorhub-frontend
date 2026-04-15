<template>
  <div>
    <RouterView />
    <AppToastContainer />
  </div>
</template>

<script setup lang="ts">
import AppToastContainer from './shared/ui/AppToastContainer.vue'
</script>
