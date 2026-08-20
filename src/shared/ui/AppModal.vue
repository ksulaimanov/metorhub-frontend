<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
          v-if="modelValue"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="close"
      >
        <div class="absolute inset-0 bg-[#16151D]/50" @click="close" />

        <div
            ref="panel"
            class="relative w-full max-w-md rounded-2xl border border-border-default bg-surface p-6 shadow-lg sm:p-7"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? titleId : undefined"
            :aria-describedby="description ? descId : undefined"
            @keydown.esc.stop.prevent="close"
            @keydown.tab="onTab"
        >
          <button
              type="button"
              class="absolute right-3 top-3 rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              :aria-label="t('common.close')"
              @click="close"
          >
            <X class="h-4 w-4" aria-hidden="true" />
          </button>

          <div
              v-if="$slots.icon"
              class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand"
          >
            <slot name="icon" />
          </div>

          <h2 v-if="title" :id="titleId" class="pr-8 text-lg font-semibold tracking-tight text-text-primary">
            {{ title }}
          </h2>

          <p v-if="description" :id="descId" class="mt-1.5 text-sm leading-relaxed text-text-secondary">
            {{ description }}
          </p>

          <div v-if="$slots.default" class="mt-5">
            <slot />
          </div>

          <div v-if="$slots.actions" class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <slot name="actions" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted, nextTick, ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: boolean
  title?: string
  description?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { t } = useI18n()

const uid = useId()
const titleId = `${uid}-title`
const descId = `${uid}-desc`

const panel = ref<HTMLElement | null>(null)
/** Element that had focus before opening, so we can hand it back on close. */
let previouslyFocused: HTMLElement | null = null

const close = () => emit('update:modelValue', false)

const FOCUSABLE =
    'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'

const focusableItems = (): HTMLElement[] =>
    panel.value ? Array.from(panel.value.querySelectorAll<HTMLElement>(FOCUSABLE)) : []

/** Keep Tab cycling inside the dialog. */
const onTab = (e: KeyboardEvent) => {
  const items = focusableItems()
  if (items.length === 0) return

  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement

  if (e.shiftKey && active === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && active === last) {
    e.preventDefault()
    first.focus()
  }
}

const release = () => {
  document.body.style.overflow = ''
}

watch(
    () => props.modelValue,
    async (open) => {
      if (open) {
        previouslyFocused = document.activeElement as HTMLElement | null
        document.body.style.overflow = 'hidden'
        await nextTick()
        // Prefer the first real control; fall back to the panel itself.
        const items = focusableItems()
        const target = items.find((el) => !el.hasAttribute('aria-label')) ?? items[0] ?? panel.value
        target?.focus()
      } else {
        release()
        previouslyFocused?.focus()
        previouslyFocused = null
      }
    },
    { immediate: true },
)

onUnmounted(release)
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
