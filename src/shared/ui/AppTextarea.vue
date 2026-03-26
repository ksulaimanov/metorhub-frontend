<template>
  <textarea
      v-bind="$attrs"
      :class="[
        'w-full resize-y rounded-2xl border px-4 py-3 text-sm outline-none transition',
        'placeholder:text-slate-400',
        error
          ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
          : 'border-slate-200 bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-200',
      ]"
  />
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  error?: boolean
}>()
</script>

