<template>
  <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-text-primary">{{ title }}</h1>
      <p v-if="description" class="mt-1 text-sm text-text-secondary">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="mt-3 sm:mt-0">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

