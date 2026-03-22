<template>
  <div class="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
    <p class="font-semibold">{{ title }}</p>
    <p v-if="description" class="mt-2 text-sm">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>