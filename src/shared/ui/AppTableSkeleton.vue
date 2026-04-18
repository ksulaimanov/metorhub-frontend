<template>
  <div>
    <!-- Desktop table skeleton -->
    <div class="hidden md:block" :aria-label="t('common.loading')">
      <AppCard padding="none" radius="lg">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-border-brand">
              <th v-for="col in columns" :key="col" class="px-5 py-3">
                <div class="h-3 animate-pulse rounded-lg bg-brand-soft" :style="{ width: headerWidths[col % headerWidths.length] }" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in rows"
              :key="row"
              class="border-b border-border-brand last:border-b-0"
            >
              <td v-for="col in columns" :key="col" class="px-5 py-4">
                <div
                  class="h-4 animate-pulse rounded-lg bg-brand-soft/70"
                  :style="{ width: cellWidths[(row * columns + col) % cellWidths.length] }"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </AppCard>
    </div>

    <!-- Mobile card skeletons -->
    <div class="flex flex-col gap-3 md:hidden">
      <AppCard v-for="i in rows" :key="i" padding="sm" radius="md">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0 flex-1 space-y-2">
            <div class="h-4 w-3/4 animate-pulse rounded-lg bg-brand-soft" />
            <div class="h-3 w-1/2 animate-pulse rounded-lg bg-brand-soft/60" />
          </div>
          <div class="h-6 w-16 animate-pulse rounded-full bg-brand-soft" />
        </div>
        <div class="mt-2 flex gap-2">
          <div class="h-3 w-20 animate-pulse rounded-lg bg-brand-soft/60" />
          <div class="h-3 w-28 animate-pulse rounded-lg bg-brand-soft/60" />
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppCard from '@/shared/ui/AppCard.vue'

const { t } = useI18n()

withDefaults(defineProps<{
  columns?: number
  rows?: number
}>(), {
  columns: 6,
  rows: 5,
})

const headerWidths = ['60%', '50%', '70%', '45%', '40%', '30%']
const cellWidths = ['80%', '60%', '75%', '50%', '65%', '55%', '70%', '45%', '85%', '40%']
</script>

