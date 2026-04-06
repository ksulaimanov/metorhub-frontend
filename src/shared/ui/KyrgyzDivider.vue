<template>
  <div
      :class="[
        'relative mx-auto flex items-center justify-center',
        variant === 'brand' ? 'opacity-100' : 'opacity-50',
        size === 'sm' ? 'py-1' : 'py-2',
      ]"
  >
    <!-- Left ornament line -->
    <div class="h-px flex-1 bg-gradient-to-r from-transparent via-brand/15 to-brand/10" />

    <!-- Center Shyrdak motif -->
    <svg
        :class="['mx-3 shrink-0', sizeClass]"
        viewBox="0 0 80 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Outer frame diamonds -->
      <path d="M10 3l7 7-7 7-7-7z" :stroke="color" stroke-width="1" fill="none" opacity="0.35" />
      <path d="M70 3l7 7-7 7-7-7z" :stroke="color" stroke-width="1" fill="none" opacity="0.35" />

      <!-- Central large diamond -->
      <path d="M40 1l9 9-9 9-9-9z" :stroke="color" stroke-width="1.4" fill="none" opacity="0.3" />
      <!-- Inner diamond -->
      <path d="M40 5l5 5-5 5-5-5z" :stroke="color" stroke-width="0.8" fill="none" opacity="0.25" />

      <!-- Кочкор-style horn curves connecting diamonds -->
      <path d="M17 10c3-3 6-3 9-3" :stroke="color" stroke-width="0.8" fill="none" opacity="0.2" stroke-linecap="round" />
      <path d="M54 10c3 0 6 0 9-3" :stroke="color" stroke-width="0.8" fill="none" opacity="0.2" stroke-linecap="round" transform="scale(-1,1) translate(-126,0)" />

      <!-- Small accent dots -->
      <circle cx="10" cy="10" r="1.5" :fill="color" opacity="0.2" />
      <circle cx="40" cy="10" r="2" :fill="color" opacity="0.18" />
      <circle cx="70" cy="10" r="1.5" :fill="color" opacity="0.2" />

      <!-- Tiny corner accents -->
      <circle cx="25" cy="10" r="0.8" :fill="color" opacity="0.15" />
      <circle cx="55" cy="10" r="0.8" :fill="color" opacity="0.15" />
    </svg>

    <!-- Right ornament line -->
    <div class="h-px flex-1 bg-gradient-to-l from-transparent via-brand/15 to-brand/10" />
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
    props.size === 'sm' ? 'h-4 w-20' : 'h-5 w-24',
)
</script>

