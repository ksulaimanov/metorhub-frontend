<template>
  <div
    class="pointer-events-none absolute inset-0 overflow-hidden"
    aria-hidden="true"
    :style="{ opacity }"
  >
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          :id="patternId"
          :width="patternSize"
          :height="patternSize"
          patternUnits="userSpaceOnUse"
          :patternTransform="`scale(${scale})`"
        >
          <!-- Elegant geometric Kochkor Muyuz (Ram's horn) repeating motif -->
          <!-- Center diamond -->
          <path d="M20 5 L35 20 L20 35 L5 20 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />

          <!-- Outer curl / horn left-top -->
          <path d="M5 20 C -5 20, -5 5, 5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          <!-- Outer curl / horn left-bottom -->
          <path d="M5 20 C -5 20, -5 35, 5 35" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />

          <!-- Outer curl / horn right-top -->
          <path d="M35 20 C 45 20, 45 5, 35 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          <!-- Outer curl / horn right-bottom -->
          <path d="M35 20 C 45 20, 45 35, 35 35" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />

          <!-- Inner diamond dot -->
          <rect x="18" y="18" width="4" height="4" fill="currentColor" opacity="0.6"/>
        </pattern>
      </defs>
      <!-- Base pattern fill -->
      <rect width="100%" height="100%" :fill="`url(#${patternId})`" class="text-brand dark:text-zinc-500" />
    </svg>
    <!-- Dark/Light gradient to fade pattern naturally -->
    <div v-if="fade" class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg"></div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'

withDefaults(defineProps<{
  opacity?: number
  scale?: number
  patternSize?: number
  fade?: boolean
}>(), {
  opacity: 0.08,
  scale: 1.5,
  patternSize: 40,
  fade: true
})

const patternId = `kyrgyz-pattern-${getCurrentInstance()?.uid ?? 'default'}`
</script>
