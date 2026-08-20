<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" :aria-label="t('common.loading')">
    <AppCard v-for="i in count" :key="i">
      <div class="flex items-start gap-4">
        <div class="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-surface-sunken" />
        <div class="min-w-0 flex-1 space-y-2.5">
          <div class="h-3 w-24 animate-pulse rounded-lg bg-surface-sunken" />
          <div class="h-7 w-16 animate-pulse rounded-lg bg-surface-sunken" />
          <div class="h-2.5 w-20 animate-pulse rounded-lg bg-surface-sunken/60" />
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
  count?: number
}>(), {
  count: 6,
})
</script>

