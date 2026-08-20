<template>
  <component
      :is="as"
      :class="[
        'bg-surface transition-[border-color,box-shadow,transform] duration-150 ease-out',
        elevationClass,
        radiusClass,
        paddingClass,
        interactive && 'cursor-pointer hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
      ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  radius?: 'sm' | 'md' | 'lg'
  /** flat = border only (default resting state); raised adds a soft shadow. */
  elevation?: 'flat' | 'raised'
  /** Adds hover lift + focus ring. Pair with `as="button"` or `as="a"`. */
  interactive?: boolean
  as?: string
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  radius: 'lg',
  elevation: 'flat',
  interactive: false,
  as: 'div',
})

const paddingClass = computed(() =>
    ({ none: '', sm: 'p-4', md: 'p-5 sm:p-6', lg: 'p-6 sm:p-8' })[props.padding],
)
const radiusClass = computed(() =>
    ({ sm: 'rounded-lg', md: 'rounded-xl', lg: 'rounded-2xl' })[props.radius],
)
const elevationClass = computed(() =>
    ({
      flat: 'border border-border-subtle',
      raised: 'border border-border-subtle shadow-sm',
    })[props.elevation],
)
</script>
