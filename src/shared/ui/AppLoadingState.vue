<template>
  <div
      class="rounded-2xl border border-border-subtle bg-surface px-6 py-12 text-center"
      role="status"
      aria-live="polite"
  >
    <div
        class="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-border-default border-t-brand"
        aria-hidden="true"
    />
    <p class="text-sm text-text-secondary">{{ text || t('common.loading') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  text?: string
}>()
</script>
