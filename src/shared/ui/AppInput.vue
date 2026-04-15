<template>
  <input
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :class="[
        'w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 text-text-primary placeholder:text-text-secondary ring-1',
        error
          ? 'ring-red-500 bg-red-50/50 focus:ring-red-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface text-red-900 dark:text-red-100'
          : 'ring-border-brand bg-surface-secondary hover:ring-text-muted/50 focus:bg-surface focus:ring-brand focus:ring-2',
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
