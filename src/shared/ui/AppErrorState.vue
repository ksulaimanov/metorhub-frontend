<template>
  <div
      class="flex gap-3 rounded-2xl border border-danger-border bg-danger-soft p-4"
      role="alert"
  >
    <AlertCircle class="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
    <div class="min-w-0 flex-1">
      <p class="text-sm font-semibold text-text-primary">{{ title }}</p>
      <p v-if="description" class="mt-1 text-sm leading-relaxed text-text-secondary">
        {{ description }}
      </p>
      <div v-if="$slots.actions" class="mt-3 flex flex-wrap gap-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'

defineProps<{
  title: string
  description?: string
}>()
</script>
