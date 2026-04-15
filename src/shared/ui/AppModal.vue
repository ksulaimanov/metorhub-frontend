<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
          v-if="modelValue"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <!-- Modal panel -->
        <div
            class="relative w-full max-w-md rounded-[1.75rem] bg-surface p-6 shadow-xl ring-1 ring-border-brand/80 sm:p-8"
            role="dialog"
            aria-modal="true"
        >
          <!-- Close button -->
          <button
              type="button"
              class="absolute right-4 top-4 rounded-lg p-1.5 text-text-secondary transition hover:bg-brand-soft hover:text-text-primary"
              @click="close"
          >
            <X class="h-5 w-5" />
          </button>

          <!-- Icon -->
          <div
              v-if="$slots.icon"
              class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft"
          >
            <slot name="icon" />
          </div>

          <!-- Title -->
          <h2 v-if="title" class="text-center text-xl font-bold text-text-primary sm:text-2xl">
            {{ title }}
          </h2>

          <!-- Description -->
          <p v-if="description" class="mt-2 text-center text-sm leading-relaxed text-text-secondary">
            {{ description }}
          </p>

          <!-- Body slot -->
          <div v-if="$slots.default" class="mt-5">
            <slot />
          </div>

          <!-- Actions slot -->
          <div v-if="$slots.actions" class="mt-6">
            <slot name="actions" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: boolean
  title?: string
  description?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const close = () => emit('update:modelValue', false)

// Lock body scroll when modal is open
watch(() => props.modelValue, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
}, { immediate: true })

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
