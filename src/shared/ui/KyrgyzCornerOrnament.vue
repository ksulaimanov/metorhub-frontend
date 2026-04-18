<template>
  <svg
    class="pointer-events-none absolute text-brand dark:text-zinc-600"
    :class="positionClass"
    :style="{ opacity }"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- Embroidery inspired borders -->
    <path d="M2 20V2H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 14V8H14" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
    <!-- Elegant scroll or horn accent -->
    <path d="M20 2 C35 2, 35 15, 20 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>
    <path d="M2 20 C2 35, 15 35, 15 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>
    <!-- Corner dot -->
    <rect x="4" y="4" width="2" height="2" fill="currentColor" opacity="0.5"/>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  opacity?: number
}>(), {
  position: 'top-left',
  opacity: 0.12
})

const positionClass = computed(() => {
  const map = {
    'top-left': 'top-2 left-2 w-16 h-16 sm:w-24 sm:h-24',
    'top-right': 'top-2 right-2 w-16 h-16 sm:w-24 sm:h-24 -scale-x-100',
    'bottom-left': 'bottom-2 left-2 w-16 h-16 sm:w-24 sm:h-24 -scale-y-100',
    'bottom-right': 'bottom-2 right-2 w-16 h-16 sm:w-24 sm:h-24 -scale-x-100 -scale-y-100',
  }
  return map[props.position]
})
</script>

