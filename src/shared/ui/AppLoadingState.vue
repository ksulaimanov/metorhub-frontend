<template>
  <div class="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
    <p class="text-slate-600">{{ text || 'Загрузка...' }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>