<template>
  <div class="relative w-full">
    <select
        v-bind="$attrs"
        :value="modelValue"
        :aria-invalid="error || undefined"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        :class="[
          'w-full min-h-11 sm:min-h-10 appearance-none rounded-xl border pl-3.5 pr-10 text-base sm:text-sm',
          'bg-surface text-text-primary',
          'transition-[border-color,box-shadow] duration-150 ease-out',
          'focus:outline-none focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-text-muted',
          error
            ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/25'
            : 'border-border-default hover:border-border-strong focus:border-brand focus:ring-2 focus:ring-brand/25',
        ]"
    >
      <slot />
    </select>

    <ChevronDown
        class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
        aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

defineOptions({ inheritAttrs: false })

defineProps<{
  modelValue?: string | number
  error?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
