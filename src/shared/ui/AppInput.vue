<template>
  <input
      v-bind="$attrs"
      :class="[
        'w-full rounded-2xl border px-4 py-3 text-sm outline-none transition',
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
  error?: boolean
}>()
</script>
