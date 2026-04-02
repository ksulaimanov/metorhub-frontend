<template>
  <textarea
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :class="[
        'w-full resize-y rounded-2xl border px-4 py-3 text-sm outline-none transition',
        'placeholder:text-text-secondary/60',
        error
          ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
          : 'border-border-brand bg-white focus:border-brand focus:ring-2 focus:ring-brand-soft',
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
