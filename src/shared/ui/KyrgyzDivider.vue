<template>
  <div
      :class="[
        'relative mx-auto flex items-center justify-center',
        variant === 'brand' ? 'opacity-100' : 'opacity-60',
      ]"
  >
    <!-- Left ornament line -->
    <div class="h-px flex-1 bg-gradient-to-r from-transparent via-brand/20 to-brand/10" />

    <!-- Center Shyrdak motif -->
    <svg
        :class="['mx-3 shrink-0', sizeClass]"
        viewBox="0 0 48 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Shyrdak-inspired diamond pattern -->
      <path d="M8 2l6 6-6 6-6-6z" :stroke="color" stroke-width="1.2" fill="none" opacity="0.6" />
      <path d="M24 0l8 8-8 8-8-8z" :stroke="color" stroke-width="1.5" fill="none" opacity="0.4" />
      <path d="M40 2l6 6-6 6-6-6z" :stroke="color" stroke-width="1.2" fill="none" opacity="0.6" />
      <!-- Inner details -->
      <circle cx="8" cy="8" r="1.5" :fill="color" opacity="0.3" />
      <circle cx="24" cy="8" r="2" :fill="color" opacity="0.25" />
      <circle cx="40" cy="8" r="1.5" :fill="color" opacity="0.3" />
    </svg>

    <!-- Right ornament line -->
    <div class="h-px flex-1 bg-gradient-to-l from-transparent via-brand/20 to-brand/10" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'brand' | 'subtle'
  size?: 'sm' | 'md'
}>(), {
  variant: 'brand',
  size: 'md',
})

const color = '#5B3FD3'

const sizeClass = computed(() =>
    props.size === 'sm' ? 'h-3 w-12' : 'h-4 w-16',
)
</script>

