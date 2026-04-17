<template>
  <select
      v-bind="$attrs"
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      :class="[
        'w-full appearance-none rounded-2xl border px-4 py-3 text-sm text-text-primary outline-none transition [&>option]:bg-[#1a173a] [&>option]:text-white',
        error
          ? 'border-red-500 bg-red-500/10 focus:border-red-500 focus:ring-2 focus:ring-red-300/40'
          : 'border-border-brand/70 bg-surface/60 hover:border-border-brand focus:border-brand/60 focus:ring-2 focus:ring-brand/30',
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
