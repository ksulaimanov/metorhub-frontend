<template>
  <div
      :class="[
        'rounded-2xl p-4 text-sm',
        variantClasses[variant],
      ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
      variant?: 'muted' | 'success' | 'warning' | 'error'
    }>(),
    { variant: 'muted' },
)

const variantClasses = {
  muted: 'bg-brand/10 text-text-primary ring-1 ring-inset ring-brand/20 ',
  success: 'bg-success-soft text-success ring-1 ring-inset ring-success-border',
  warning: 'bg-warning-soft text-warning ring-1 ring-inset ring-warning-border',
  error: 'bg-danger-soft text-danger ring-1 ring-inset ring-danger-border',
} as const
</script>

