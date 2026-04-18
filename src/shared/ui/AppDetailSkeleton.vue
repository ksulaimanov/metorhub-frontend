<template>
  <div class="space-y-6" :aria-label="t('common.loading')">
    <!-- Header skeleton -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-2">
        <div class="h-7 w-48 animate-pulse rounded-lg bg-brand-soft" />
        <div class="h-4 w-36 animate-pulse rounded-lg bg-brand-soft/60" />
      </div>
      <div class="h-6 w-20 animate-pulse rounded-full bg-brand-soft" />
    </div>

    <!-- Section skeletons -->
    <AppCard v-for="s in sections" :key="s">
      <div class="mb-4 h-5 w-40 animate-pulse rounded-lg bg-brand-soft" />
      <div class="space-y-0">
        <div
          v-for="r in rowsPerSection"
          :key="r"
          class="flex flex-col gap-1 border-b border-border-brand py-3 last:border-b-0 sm:flex-row sm:gap-4"
        >
          <div class="h-4 w-28 shrink-0 animate-pulse rounded-lg bg-brand-soft/60" />
          <div
            class="h-4 animate-pulse rounded-lg bg-brand-soft/40"
            :style="{ width: rowWidths[(s * rowsPerSection + r) % rowWidths.length] }"
          />
        </div>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppCard from '@/shared/ui/AppCard.vue'

const { t } = useI18n()

withDefaults(defineProps<{
  sections?: number
  rowsPerSection?: number
}>(), {
  sections: 2,
  rowsPerSection: 5,
})

const rowWidths = ['60%', '75%', '50%', '80%', '45%', '70%', '55%', '65%', '40%', '85%']
</script>

