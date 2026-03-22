<template>
  <span
      class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
      :class="variantClass"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
      variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
    }>(),
    {
      variant: 'default',
    },
)

const variantClass = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-emerald-100 text-emerald-700'
    case 'warning':
      return 'bg-amber-100 text-amber-700'
    case 'danger':
      return 'bg-red-100 text-red-700'
    case 'info':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
})
</script>