<template>
  <div class="rounded-2xl border border-dashed border-border-default bg-surface px-6 py-12 text-center">
    <div
        v-if="$slots.icon || icon"
        class="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand"
    >
      <slot name="icon">
        <component :is="icon" v-if="icon" class="h-5 w-5" aria-hidden="true" />
      </slot>
    </div>
    <h3 class="text-base font-semibold tracking-tight text-text-primary">{{ title }}</h3>
    <p v-if="description" class="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-text-secondary">
      {{ description }}
    </p>
    <div v-if="$slots.actions" class="mt-5 flex flex-wrap justify-center gap-2">
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
