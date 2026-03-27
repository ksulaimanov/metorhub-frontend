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
  muted: 'bg-brand-soft/50 text-text-primary ring-1 ring-border-brand/60',
  success: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border border-amber-200 bg-amber-50 text-amber-700',
  error: 'border border-red-200 bg-red-50 text-red-700',
} as const
</script>

