<template>
  <div class="rounded-2xl bg-surface p-5 shadow-sm shadow-slate-900/10 ring-1 ring-border-brand/80 transition-shadow hover:shadow-md">
    <div v-if="$slots.icon" class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand dark:bg-brand/20">
      <slot name="icon" />
    </div>
    <h3 class="text-base font-semibold leading-snug text-text-primary">
      <slot name="title">{{ title }}</slot>
    </h3>
    <p v-if="description || $slots.default" class="mt-1.5 text-sm leading-relaxed text-text-secondary">
      <slot>{{ description }}</slot>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

