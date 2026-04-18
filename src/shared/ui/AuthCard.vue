<template>
  <div :class="cardClasses">
    <div v-if="showAccentGlow" class="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent pointer-events-none" />
    <div class="relative z-10" :class="contentClass">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  compact?: boolean
  showAccentGlow?: boolean
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  showAccentGlow: false,
  contentClass: '',
})

const cardClasses = computed(() => [
  'relative overflow-hidden rounded-[2rem] border border-border-brand bg-surface backdrop-blur-2xl',
  props.compact
    ? 'p-4 shadow-sm'
    : 'p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:p-10',
])
</script>

