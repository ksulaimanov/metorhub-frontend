<template>
  <div :class="['bg-surface backdrop-blur-xl border border-border-brand shadow-[0_8px_30px_rgba(0,0,0,0.12)]', radiusClass, paddingClass]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  radius?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  radius: 'lg',
})

const paddingClass = computed(() =>
    ({ none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' })[props.padding],
)
const radiusClass = computed(() =>
    ({ sm: 'rounded-xl', md: 'rounded-2xl', lg: 'rounded-3xl' })[props.radius],
)
</script>
