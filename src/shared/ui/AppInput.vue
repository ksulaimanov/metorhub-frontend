<template>
  <input
      v-bind="$attrs"
      :value="modelValue"
      :aria-invalid="error || undefined"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :class="[
        'w-full min-h-11 sm:min-h-10 rounded-xl border px-3.5 text-base sm:text-sm',
        'bg-surface text-text-primary placeholder:text-text-muted',
        'transition-[border-color,box-shadow] duration-150 ease-out',
        'focus:outline-none focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-text-muted',
        error
          ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/25'
          : 'border-border-default hover:border-border-strong focus:border-brand focus:ring-2 focus:ring-brand/25',
      ]"
  />
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  modelValue?: string
  error?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
