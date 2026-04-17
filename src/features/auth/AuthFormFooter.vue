<template>
  <div class="flex flex-col items-center gap-1 text-center text-sm">
    <p class="text-slate-400">
      {{ prompt }}
      <RouterLink :to="linkTo" class="font-semibold text-brand transition hover:text-brand-hover">
        {{ linkLabel }}
      </RouterLink>
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  prompt: string
  linkTo: string
  linkLabel: string
}>()
</script>

