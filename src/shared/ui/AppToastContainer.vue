<template>
  <div class="pointer-events-none fixed top-4 sm:top-4 inset-x-4 sm:inset-x-auto sm:right-4 z-[100] flex flex-col items-center sm:items-end gap-2 sm:max-w-sm">
    <transition-group name="toast">
      <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="pointer-events-auto w-full sm:w-auto overflow-hidden rounded-xl border bg-surface/90 backdrop-blur-xl shadow-lg ring-1"
          :class="toastClass(toast.type)"
      >
        <div class="flex items-start justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3 cursor-pointer" @click="toastStore.removeToast(toast.id)">
          <div class="min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-semibold">
              {{ titleByType(toast.type) }}
            </p>
            <p class="mt-0.5 text-xs sm:text-sm leading-relaxed text-text-secondary">
              {{ toast.message }}
            </p>
          </div>

          <button
              type="button"
              class="rounded-lg p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary transition hover:bg-surface-secondary hover:text-text-primary mt-[-4px] mr-[-4px]"
              @click.stop="toastStore.removeToast(toast.id)"
          >
            <span class="text-xl leading-none">&times;</span>
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import type { ToastType } from '../lib/getApiErrorMessage'
import { useToastStore } from '../lib/getApiErrorMessage'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toastStore = useToastStore()

const titleByType = (type: ToastType) => {
  const map: Record<ToastType, string> = {
    success: t('toast.success'),
    error: t('toast.error'),
    info: t('toast.info'),
    warning: t('toast.warning'),
  }

  return map[type]
}

const toastClass = (type: ToastType) => {
  const map: Record<ToastType, string> = {
    success: 'border-emerald-200 ring-emerald-100',
    error: 'border-red-200 ring-red-100',
    info: 'border-blue-200 ring-blue-100',
    warning: 'border-amber-200 ring-amber-100',
  }

  return map[type]
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
