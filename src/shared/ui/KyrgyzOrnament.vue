<template>
  <div
    class="pointer-events-none absolute overflow-hidden"
    :class="[positionClasses, sizeClasses]"
    :style="{ opacity }"
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 100 100"
      class="h-full w-full fill-current text-brand"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <!-- Stylized Kochkor Muyuz (Ram's Horn) Pattern - scalable, lightweight, clean SVG -->
      <path d="M50 0 C70 0, 90 20, 90 40 C90 55, 80 70, 65 70 C55 70, 50 60, 50 50 C50 40, 55 30, 65 30 C75 30, 80 40, 80 50 C80 60, 70 80, 50 80 C30 80, 20 60, 20 50 C20 40, 25 30, 35 30 C45 30, 50 40, 50 50 C50 60, 45 70, 35 70 C20 70, 10 55, 10 40 C10 20, 30 0, 50 0 Z" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  position?: 'top' | 'bottom' | 'left' | 'right'
  opacity?: number
  size?: 'small' | 'medium' | 'large'
}>(), {
  position: 'right',
  opacity: 0.05,
  size: 'medium'
})

const positionClasses = computed(() => {
  switch (props.position) {
    case 'top': return 'top-0 left-1/2 -translate-x-1/2'
    case 'bottom': return 'bottom-0 left-1/2 -translate-x-1/2'
    case 'left': return 'top-1/2 left-0 -translate-y-1/2 -translate-x-1/4'
    case 'right': return 'top-1/2 right-0 -translate-y-1/2 translate-x-1/4'
    default: return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'small': return 'w-32 h-32 sm:w-48 sm:h-48'
    case 'medium': return 'w-48 h-48 sm:w-64 sm:h-64'
    case 'large': return 'w-72 h-72 sm:w-[28rem] sm:h-[28rem]'
    default: return 'w-48 h-48'
  }
})
</script>
