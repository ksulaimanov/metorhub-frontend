<template>
  <div
      :class="[
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-soft font-bold text-brand',
        sizeClasses[size],
        textClasses[size],
      ]"
  >
    <img
        v-if="src"
        :src="src"
        :alt="alt"
        class="absolute inset-0 h-full w-full object-cover"
        @error="imgError = true"
    />
    <span v-if="!src || imgError">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  src?: string | null
  firstName?: string | null
  lastName?: string | null
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  size: 'md',
  alt: '',
})

const imgError = ref(false)

watch(() => props.src, () => {
  imgError.value = false
})

const initials = computed(() => {
  const f = props.firstName?.trim()?.[0] || ''
  const l = props.lastName?.trim()?.[0] || ''
  return (f + l).toUpperCase() || 'U'
})

const sizeClasses: Record<string, string> = {
  sm: 'h-10 w-10',
  md: 'h-16 w-16',
  lg: 'h-24 w-24',
  xl: 'h-28 w-28',
}

const textClasses: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
  xl: 'text-3xl',
}
</script>

