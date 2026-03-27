<template>
  <div class="flex flex-col gap-0.5 sm:flex-row sm:gap-4 py-3 border-b border-border-brand last:border-b-0">
    <dt class="min-w-[160px] shrink-0 text-sm font-medium text-text-secondary">{{ label }}</dt>
    <dd class="text-sm text-text-primary break-words">
      <slot>{{ value ?? '—' }}</slot>
    </dd>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value?: string | number | null
}>()
</script>

