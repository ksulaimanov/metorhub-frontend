<template>
  <svg
      :class="[
        'pointer-events-none absolute',
        positionClass,
        sizeClass,
      ]"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
  >
    <!-- Shyrdak-inspired corner ornament -->
    <path
        d="M2 2l8 8M2 10l4 4M10 2l4 4"
        :stroke="color"
        stroke-width="1"
        stroke-linecap="round"
        :opacity="opacity"
    />
    <path
        d="M4 4l3 0M4 4l0 3"
        :stroke="color"
        stroke-width="0.8"
        stroke-linecap="round"
        :opacity="opacity * 0.7"
    />
    <circle cx="8" cy="8" r="1.2" :fill="color" :opacity="opacity * 0.5" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  size?: 'sm' | 'md'
}>(), {
  position: 'top-left',
  size: 'md',
})

const color = '#5B3FD3'
const opacity = 0.15

const positionClass = computed(() => {
  const map = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2 -scale-x-100',
    'bottom-left': 'bottom-2 left-2 -scale-y-100',
    'bottom-right': 'bottom-2 right-2 -scale-x-100 -scale-y-100',
  }
  return map[props.position]
})

const sizeClass = computed(() =>
    props.size === 'sm' ? 'h-6 w-6' : 'h-8 w-8',
)
</script>

