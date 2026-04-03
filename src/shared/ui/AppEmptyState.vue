<template>
  <div class="rounded-3xl bg-surface p-10 text-center shadow-sm ring-1 ring-border-brand">
    <div v-if="$slots.icon || icon" class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft">
      <slot name="icon">
        <component :is="icon" v-if="icon" class="h-6 w-6 text-brand" />
      </slot>
    </div>
    <h3 class="text-xl font-semibold text-text-primary">{{ title }}</h3>
    <p v-if="description" class="mx-auto mt-3 max-w-md text-text-secondary">{{ description }}</p>
    <div v-if="$slots.actions" class="mt-6">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  description?: string
  icon?: Component
}>()
</script>