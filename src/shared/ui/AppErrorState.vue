<template>
  <div class="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
    <p class="font-semibold">{{ title }}</p>
    <p v-if="description" class="mt-2 text-sm">{{ description }}</p>
    <div v-if="$slots.actions" class="mt-3">
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