<template>
  <span
      class="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap"
      :class="variantClass"
  >
    <!-- Shape as well as colour, so status never depends on hue alone. -->
    <span v-if="dot" class="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
      variant?: 'default' | 'neutral' | 'success' | 'warning' | 'danger' | 'info'
      dot?: boolean
    }>(),
    {
      variant: 'default',
      dot: false,
    },
)

const variantClass = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-success-soft text-success border-success-border'
    case 'warning':
      return 'bg-warning-soft text-warning border-warning-border'
    case 'danger':
      return 'bg-danger-soft text-danger border-danger-border'
    case 'info':
      return 'bg-info-soft text-info border-info-border'
    case 'neutral':
      return 'bg-surface-sunken text-text-secondary border-border-default'
    default:
      return 'bg-brand-soft text-brand border-brand-border'
  }
})
</script>
