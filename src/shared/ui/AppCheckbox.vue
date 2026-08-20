<template>
  <label class="inline-flex cursor-pointer items-start gap-2.5">
    <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
        class="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border-strong bg-surface text-brand accent-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    />
    <span v-if="$slots.default || label" class="text-sm leading-snug text-text-primary">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: boolean
  label?: string
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>
