<template>
  <div class="rounded-2xl bg-white p-5 shadow-sm shadow-brand/5 ring-1 ring-border-brand/80">
    <div v-if="$slots.icon" class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
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

