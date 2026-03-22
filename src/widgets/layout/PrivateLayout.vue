<template>
  <div class="min-h-screen bg-slate-50">
    <PrivateHeader />
    <main class="mx-auto max-w-7xl px-6 py-10">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import PrivateHeader from '../header/PrivateHeader.vue'
</script>