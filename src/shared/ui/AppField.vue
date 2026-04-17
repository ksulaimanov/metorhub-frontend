<template>
  <div class="relative pb-6">
    <label v-if="label" class="mb-2 block text-sm font-medium text-text-primary sm:text-text-secondary">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <slot />

    <div class="absolute bottom-0 left-0 w-full overflow-hidden flex items-end h-6">
      <transition name="slide-fade" mode="out-in">
        <p v-if="error" class="text-sm text-red-400 font-medium pb-0.5">{{ error }}</p>
        <p v-else-if="hint" class="text-sm text-text-muted pb-0.5">{{ hint }}</p>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>

<script setup lang="ts">
defineProps<{
  label?: string
  error?: string
  hint?: string
  required?: boolean
}>()
</script>
