<template>
  <!-- Always mounted so screen readers pick up toasts inserted later. -->
  <div
      class="pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-4 sm:max-w-sm sm:items-end"
      aria-live="polite"
      aria-atomic="false"
  >
    <transition-group name="toast">
      <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="pointer-events-auto w-full overflow-hidden rounded-xl border bg-surface shadow-md sm:w-auto sm:min-w-[20rem]"
          :class="borderByType(toast.type)"
          :role="toast.type === 'error' ? 'alert' : 'status'"
      >
        <div class="flex items-start gap-3 px-4 py-3">
          <component
              :is="iconByType(toast.type)"
              class="mt-0.5 h-4 w-4 shrink-0"
              :class="accentByType(toast.type)"
              aria-hidden="true"
          />

          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-text-primary">
              {{ titleByType(toast.type) }}
            </p>
            <p v-if="toast.message" class="mt-0.5 text-sm leading-relaxed text-text-secondary">
              {{ toast.message }}
            </p>
          </div>

          <button
              type="button"
              class="-mr-1.5 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              :aria-label="t('common.close')"
              @click="toastStore.removeToast(toast.id)"
          >
            <X class="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToastStore, type ToastType } from '@/shared/model/toastStore'
import { useI18n } from 'vue-i18n'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-vue-next'

const { t } = useI18n()
const toastStore = useToastStore()

const titleByType = (type: ToastType) =>
    ({
      success: t('toast.success'),
      error: t('toast.error'),
      info: t('toast.info'),
      warning: t('toast.warning'),
    })[type]

const iconByType = (type: ToastType) =>
    ({
      success: CheckCircle2,
      error: AlertCircle,
      info: Info,
      warning: AlertTriangle,
    })[type]

const accentByType = (type: ToastType) =>
    ({
      success: 'text-success',
      error: 'text-danger',
      info: 'text-info',
      warning: 'text-warning',
    })[type]

const borderByType = (type: ToastType) =>
    ({
      success: 'border-success-border',
      error: 'border-danger-border',
      info: 'border-info-border',
      warning: 'border-warning-border',
    })[type]
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
