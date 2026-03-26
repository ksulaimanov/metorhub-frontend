<template>
  <label class="inline-flex cursor-pointer items-start gap-2">
    <input
        type="radio"
        :value="value"
        :checked="modelValue === value"
        @change="$emit('update:modelValue', value)"
        class="mt-0.5 h-4 w-4 shrink-0 cursor-pointer border-slate-300 text-slate-900 focus:ring-slate-300"
    />
    <span v-if="$slots.default || label" class="text-sm text-slate-700">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string | number
  value: string | number
  label?: string
}>()

defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>

