<template>
  <div :class="['bg-white shadow-sm ring-1 ring-border-brand', radiusClass, paddingClass]">
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
