<template>
  <div class="flex flex-col gap-1.5">
    <component :is="as" class="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
      {{ title }}
    </component>
    <p v-if="description" class="max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
      title: string
      description?: string
      /** Use h2/h3 when the page already has an h1 — only one h1 per page. */
      as?: 'h1' | 'h2' | 'h3'
    }>(),
    { as: 'h1' },
)
</script>
