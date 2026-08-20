<template>
  <button
      :type="type"
      :disabled="disabled || loading"
      :aria-busy="loading || undefined"
      :class="[base, variants[variant], sizes[size], block && 'w-full']"
  >
    <svg
        v-if="loading"
        class="h-4 w-4 shrink-0 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  block?: boolean
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  block: false,
  type: 'button',
})

const base = [
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium whitespace-nowrap',
  'transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out',
  'active:scale-[0.99]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
  'disabled:pointer-events-none disabled:opacity-45',
].join(' ')

/* `text-on-brand` — not `text-text-primary`. On a violet fill the theme's
   primary text is near-black in light mode and would be unreadable. */
const variants = {
  primary: 'bg-brand text-on-brand shadow-xs hover:bg-brand-hover active:bg-brand-active',
  secondary: 'border border-border-default bg-surface text-text-primary hover:bg-surface-hover hover:border-border-strong',
  tertiary: 'bg-brand-soft text-brand hover:bg-brand-soft/70',
  danger: 'bg-danger text-on-brand shadow-xs hover:brightness-110 active:brightness-95',
  ghost: 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
} as const

/* min-h keeps mobile targets ≥44px; desktop tightens to 36/40/44. */
const sizes = {
  sm: 'min-h-11 sm:min-h-9 px-3.5 text-sm',
  md: 'min-h-11 sm:min-h-10 px-4 text-sm',
  lg: 'min-h-12 sm:min-h-11 px-5 text-base',
} as const
</script>
