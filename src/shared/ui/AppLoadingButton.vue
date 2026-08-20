<template>
  <button
      :type="type"
      :class="[
        'inline-flex min-h-11 sm:min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium whitespace-nowrap',
        'transition-[background-color,border-color,color,box-shadow] duration-150 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'disabled:cursor-not-allowed disabled:opacity-45',
        variantClasses,
      ]"
      :disabled="isLoading || disabled"
      :aria-busy="isLoading || undefined"
      @click="$emit('click')"
  >
    <svg
        v-if="isLoading"
        class="h-4 w-4 shrink-0 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    <span>{{ isLoading ? resolvedLoadingLabel : null }}<slot v-if="!isLoading" /></span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  isLoading?: boolean
  disabled?: boolean
  loadingLabel?: string
  variant?: 'primary' | 'secondary' | 'danger'
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  disabled: false,
  loadingLabel: '',
  variant: 'primary',
  type: 'button',
})

defineEmits<{ click: [] }>()

const resolvedLoadingLabel = computed(() => props.loadingLabel || t('common.loading'))

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'border border-border-default bg-surface text-text-primary hover:bg-surface-hover hover:border-border-strong'
    case 'danger':
      return 'border border-danger-border bg-danger-soft text-danger hover:bg-danger hover:text-on-brand hover:border-danger'
    case 'primary':
    default:
      return 'bg-brand text-on-brand shadow-xs hover:bg-brand-hover active:bg-brand-active'
  }
})
</script>
