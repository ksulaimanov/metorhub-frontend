<template>
  <span
      class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
      :class="variantClass"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
      variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
    }>(),
    {
      variant: 'default',
    },
)

const variantClass = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20'
    case 'warning':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20'
    case 'danger':
      return 'bg-red-500/10 text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-500/20'
    case 'info':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20'
    default:
      return 'bg-brand/10 text-brand-active dark:text-brand-soft ring-1 ring-inset ring-brand/20'
  }
})
</script>
