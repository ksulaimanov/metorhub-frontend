<template>
  <div class="flex flex-col gap-2">
    <h1 class="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
      {{ title }}
    </h1>
    <p v-if="description" class="max-w-2xl text-text-secondary">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>