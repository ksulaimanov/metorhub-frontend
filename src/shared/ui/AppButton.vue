<template>
  <button
      :type="type"
      :disabled="disabled || loading"
      :class="[base, variants[variant], sizes[size]]"
  >
    <svg
        v-if="loading"
        class="h-4 w-4 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
})

const base =
    'inline-flex min-h-[44px] sm:min-h-0 items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary: 'bg-brand text-text-primary shadow-sm shadow-brand/10 hover:bg-brand-hover hover:shadow-md hover:-translate-y-0.5 active:bg-brand-active',
  secondary: 'border border-border-brand bg-surface text-text-primary hover:border-brand/40 hover:bg-surface-secondary hover:text-brand',
  danger: 'bg-red-600 text-text-primary hover:bg-red-700',
  ghost: 'text-text-secondary hover:bg-surface-secondary hover:text-brand',
} as const

const sizes = {
  sm: 'px-4 py-2.5 sm:px-3 sm:py-1.5 text-sm sm:text-xs',
  md: 'px-5 py-3.5 sm:px-4 sm:py-2.5 text-base sm:text-sm',
  lg: 'px-6 py-4 sm:py-3.5 text-lg sm:text-base',
} as const
</script>
