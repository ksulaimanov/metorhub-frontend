<template>
  <select
      v-bind="$attrs"
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      :class="[
        'w-full appearance-none rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition',
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
          : 'border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200',
      ]"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  modelValue?: string | number
  error?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

