<template>
  <div class="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
    <transition-group name="toast">
      <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="pointer-events-auto overflow-hidden rounded-2xl border bg-white shadow-lg ring-1"
          :class="toastClass(toast.type)"
      >
        <div class="flex items-start justify-between gap-3 px-4 py-3">
          <div class="min-w-0">
            <p class="text-sm font-semibold">
              {{ titleByType(toast.type) }}
            </p>
            <p class="mt-1 text-sm leading-6 text-slate-700">
              {{ toast.message }}
            </p>
          </div>

          <button
              type="button"
              class="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              @click="toastStore.removeToast(toast.id)"
          >
            ✕
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import type { ToastType } from '../lib/getApiErrorMessage'
import { useToastStore } from '../lib/getApiErrorMessage'

const toastStore = useToastStore()

const titleByType = (type: ToastType) => {
  const map: Record<ToastType, string> = {
    success: 'Успешно',
    error: 'Ошибка',
    info: 'Информация',
    warning: 'Внимание',
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