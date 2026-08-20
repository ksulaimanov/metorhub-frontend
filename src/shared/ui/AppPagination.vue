<template>
  <div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
    <!-- Showing X–Y of Z -->
    <p class="text-sm text-text-secondary">
      {{ t('common.pagination.showing') }}
      <span class="font-medium text-text-primary">{{ rangeStart }}–{{ rangeEnd }}</span>
      {{ t('common.pagination.of') }}
      <span class="font-medium text-text-primary">{{ totalElements }}</span>
    </p>

    <!-- Page buttons -->
    <div class="flex items-center gap-1">
      <button
        :disabled="currentPage === 0"
        :aria-label="t('common.pagination.prevPage')"
        class="inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm transition disabled:pointer-events-none disabled:opacity-40"
        :class="currentPage === 0 ? '' : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'"
        @click="emit('update:currentPage', currentPage - 1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>

      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === -1" class="px-1 text-sm text-text-muted">…</span>
        <button
          v-else
          :aria-current="page === currentPage ? 'page' : undefined"
          class="inline-flex h-9 min-w-9 items-center justify-center rounded-xl text-sm font-medium transition"
          :class="page === currentPage
            ? 'bg-brand text-on-brand'
            : 'text-text-secondary hover:bg-surface-hover hover:text-on-brand'"
          @click="emit('update:currentPage', page)"
        >
          {{ page + 1 }}
        </button>
      </template>

      <button
        :disabled="currentPage >= totalPages - 1"
        :aria-label="t('common.pagination.nextPage')"
        class="inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm transition disabled:pointer-events-none disabled:opacity-40"
        :class="currentPage >= totalPages - 1 ? '' : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'"
        @click="emit('update:currentPage', currentPage + 1)"
      >
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>

    <!-- Page size selector -->
    <div class="flex items-center gap-2">
      <span class="text-sm text-text-secondary">{{ t('common.pagination.perPage') }}</span>
      <AppSelect
        :model-value="String(pageSize)"
        class="w-[72px]"
        @update:model-value="onPageSizeChange"
      >
        <option v-for="opt in pageSizeOptions" :key="opt" :value="String(opt)">{{ opt }}</option>
      </AppSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import AppSelect from '@/shared/ui/AppSelect.vue'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  currentPage: number       // 0-based
  totalPages: number
  totalElements: number
  pageSize: number
  pageSizeOptions?: number[]
}>(), {
  pageSizeOptions: () => [10, 25, 50],
})

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
  (e: 'update:pageSize', size: number): void
}>()

const rangeStart = computed(() =>
  props.totalElements === 0 ? 0 : props.currentPage * props.pageSize + 1,
)
const rangeEnd = computed(() =>
  Math.min((props.currentPage + 1) * props.pageSize, props.totalElements),
)

/**
 * Build visible page numbers with ellipsis (-1).
 * Always show first, last, and ±1 around current page.
 */
const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i)
  }

  const pages = new Set<number>()
  // Always first and last
  pages.add(0)
  pages.add(total - 1)
  // Neighbors of current
  for (let i = Math.max(0, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.add(i)
  }

  const sorted = [...pages].sort((a, b) => a - b)
  const result: number[] = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push(-1) // ellipsis
    }
    result.push(sorted[i])
  }
  return result
})

function onPageSizeChange(val: string) {
  emit('update:pageSize', Number(val))
}
</script>

