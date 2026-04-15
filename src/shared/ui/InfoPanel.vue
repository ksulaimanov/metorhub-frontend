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
  muted: 'bg-brand/10 text-text-primary ring-1 ring-inset ring-brand/20 dark:text-brand-soft',
  success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20',
  error: 'bg-red-500/10 text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-500/20',
} as const
</script>

