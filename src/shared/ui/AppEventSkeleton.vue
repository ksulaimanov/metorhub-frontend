<template>
  <div class="space-y-3">
    <div v-for="i in count" :key="i" class="space-y-3">
      <!-- Header skeleton -->
      <div class="flex items-center justify-between gap-3">
        <div class="flex-1 space-y-2">
          <div class="h-5 w-3/4 animate-pulse rounded-lg bg-slate-200"></div>
          <div class="h-4 w-1/2 animate-pulse rounded-lg bg-slate-100"></div>
        </div>
        <div class="h-6 w-16 animate-pulse rounded-lg bg-slate-200"></div>
      </div>

      <!-- Details skeleton -->
      <div class="grid gap-2">
        <div class="h-4 w-2/3 animate-pulse rounded-lg bg-slate-100"></div>
        <div class="h-4 w-3/4 animate-pulse rounded-lg bg-slate-100"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  count: {
    type: Number,
    default: 3,
  },
})
</script>

