<template>
  <div class="relative mx-auto flex items-center justify-center py-4" :style="{ opacity }" aria-hidden="true">
    <div class="h-px flex-1 bg-gradient-to-r from-transparent to-brand/30" />

    <svg class="mx-6 h-5 shrink-0 text-brand" viewBox="0 0 76 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <!-- Left Motif -->
      <path d="M10 2 L16 8 L10 14 L4 8 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
      <path d="M4 8 C -2 8, -2 2, 4 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M4 8 C -2 8, -2 14, 4 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="10" cy="8" r="1.5" />

      <!-- Center Motif -->
      <path d="M38 2 L44 8 L38 14 L32 8 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
      <path d="M32 8 C 26 8, 26 2, 32 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M32 8 C 26 8, 26 14, 32 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M44 8 C 50 8, 50 2, 44 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M44 8 C 50 8, 50 14, 44 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="38" cy="8" r="1.5" />

      <!-- Right Motif -->
      <path d="M66 2 L72 8 L66 14 L60 8 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
      <path d="M72 8 C 78 8, 78 2, 72 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M72 8 C 78 8, 78 14, 72 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="66" cy="8" r="1.5" />

      <!-- Connectors -->
      <line x1="20" y1="8" x2="28" y2="8" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" />
      <line x1="48" y1="8" x2="56" y2="8" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" />
    </svg>

    <div class="h-px flex-1 bg-gradient-to-l from-transparent to-brand/30" />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  opacity?: number
}>(), {
  opacity: 0.12
})
</script>

