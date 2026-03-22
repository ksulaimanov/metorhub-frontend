<template>
  <div class="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
    <h3 class="text-xl font-semibold text-slate-900">{{ title }}</h3>
    <p v-if="description" class="mt-3 text-slate-500">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>