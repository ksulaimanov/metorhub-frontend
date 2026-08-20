<template>
  <div
    v-bind="$attrs"
    :class="cn(
      'relative flex flex-col w-full bg-surface-sunken transition-bg',
      props.class
    )"
  >
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        :class="cn(
          '[--white-gradient:repeating-linear-gradient(100deg,var(--color-white)_0%,var(--color-white)_7%,transparent_10%,transparent_12%,var(--color-white)_16%)]',
          '[--dark-gradient:repeating-linear-gradient(100deg,var(--color-black)_0%,var(--color-black)_7%,transparent_10%,transparent_12%,var(--color-black)_16%)]',
          '[--aurora:repeating-linear-gradient(100deg,var(--color-brand)_10%,var(--color-accent)_15%,var(--color-warning)_20%,var(--color-accent)_25%,var(--color-brand)_30%)]',
          '[background-image:var(--white-gradient),var(--aurora)]',
          'dark:[background-image:var(--dark-gradient),var(--aurora)]',
          '[background-size:300%,_200%]',
          '[background-position:50%_50%,50%_50%]',
          'filter blur-[10px] invert dark:invert-0',
          'after:content-[\'\'] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)]',
          'after:dark:[background-image:var(--dark-gradient),var(--aurora)]',
          'after:[background-size:200%,_100%]',
          'after:animate-[aurora_90s_linear_infinite] after:[background-attachment:fixed] after:mix-blend-difference',
          'pointer-events-none',
          'absolute -inset-[10px] will-change-transform',
          auroraOpacity,
          showRadialGradient ? '[mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]' : ''
        )"
      ></div>
    </div>
    <div class="relative z-10 flex flex-col w-full flex-grow">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

export interface AuroraBackgroundProps {
  class?: string
  showRadialGradient?: boolean
  auroraOpacity?: string
}

const props = withDefaults(defineProps<AuroraBackgroundProps>(), {
  showRadialGradient: true,
  auroraOpacity: 'opacity-20 dark:opacity-30',
})
</script>
