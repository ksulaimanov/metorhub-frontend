<template>
  <div
      :class=" [
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-accent font-bold text-white shadow-sm ring-2 ring-surface transition-transform duration-300',
        sizeClasses[size],
        textClasses[size],
      ]"
  >
    <div v-if="loading" class="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700" />
    <img
        v-if="!loading && resolvedSrc && !imgError"
        :src="resolvedSrc"
        :alt="alt"
        class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        @error="imgError = true"
    />
    <span v-else-if="!loading && initials" class="drop-shadow-sm">{{ initials }}</span>
    <User v-else-if="!loading" class="w-1/2 h-1/2 opacity-80 mix-blend-overlay" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { User } from 'lucide-vue-next'
import { resolveMediaUrl } from '@/shared/lib/resolveMediaUrl'

const props = withDefaults(defineProps<{
  src?: string | null
  firstName?: string | null
  lastName?: string | null
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
}>(), {
  size: 'md',
  alt: '',
  loading: false,
})

const imgError = ref(false)

watch(() => props.src, () => {
  imgError.value = false
})

const resolvedSrc = computed(() => resolveMediaUrl(props.src))

const initials = computed(() => {
  const f = props.firstName?.trim()?.[0] || ''
  const l = props.lastName?.trim()?.[0] || ''
  return (f + l).toUpperCase() || ''
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
