<template>
  <div class="rounded-3xl bg-surface p-10 text-center shadow-sm ring-1 ring-border-brand">
    <div class="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-brand-soft border-t-brand" />
    <p class="text-text-secondary">{{ text || t('common.loading') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  text?: string
}>()
</script>
